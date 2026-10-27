import asyncio
from typing import List
from fastapi import Request, APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.agents.retrieval_generation import rag_pipeline_wrapper
from api.api.models import (
    RAGRequest,
    RAGResponse,
    RAGUsedContext,
    SessionSummaryResponse,
    SessionDetailResponse,
)
from api.db.session import get_db
from api.memory.session_history import (
    get_or_create_session,
    add_message,
    get_recent_messages,
    format_chat_history,
    list_sessions,
    get_session_with_messages,
    delete_session,
)

rag_router = APIRouter()


async def process_rag_request(
    request: Request,
    payload: RAGRequest,
    db: AsyncSession,
) -> RAGResponse:
    request_id = str(getattr(request.state, "request_id", "unknown"))

    # 1. Fetch or initialize conversation session
    session = await get_or_create_session(
        db=db,
        session_id=payload.session_id,
        title=payload.query[:60] if payload.query else "New Conversation",
    )

    # 2. Retrieve recent message history before adding the new user message
    recent_messages = await get_recent_messages(db=db, session_id=session.id, limit=6)
    chat_history_str = format_chat_history(recent_messages)

    # 3. Store user query into Postgres memory
    await add_message(
        db=db,
        session_id=session.id,
        role="user",
        content=payload.query,
        request_id=request_id,
    )

    # 4. Execute RAG generation with conversation history context
    answer = await asyncio.to_thread(
        rag_pipeline_wrapper,
        question=payload.query,
        chat_history=chat_history_str,
    )

    used_contexts = [RAGUsedContext(**item) for item in answer.get("used_contexts", [])]

    # 5. Store assistant response into Postgres memory
    await add_message(
        db=db,
        session_id=session.id,
        role="assistant",
        content=answer["answer"],
        used_contexts=[item.model_dump() for item in used_contexts],
        request_id=request_id,
    )

    return RAGResponse(
        answer=answer["answer"],
        request_id=request_id,
        session_id=session.id,
        used_contexts=used_contexts,
    )


@rag_router.post("/", response_model=RAGResponse)
async def rag(
    request: Request,
    payload: RAGRequest,
    db: AsyncSession = Depends(get_db),
) -> RAGResponse:
    return await process_rag_request(request, payload, db)


# Sessions management router
sessions_router = APIRouter()


@sessions_router.get("/", response_model=List[SessionSummaryResponse])
async def get_sessions(
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
) -> List[SessionSummaryResponse]:
    sessions = await list_sessions(db, limit=limit, offset=offset)
    return [SessionSummaryResponse.model_validate(s) for s in sessions]


@sessions_router.get("/{session_id}", response_model=SessionDetailResponse)
async def get_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
) -> SessionDetailResponse:
    session = await get_session_with_messages(db, session_id=session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found.",
        )
    return SessionDetailResponse.model_validate(session)


@sessions_router.delete("/{session_id}")
async def remove_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
):
    deleted = await delete_session(db, session_id=session_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found.",
        )
    return {"message": f"Session '{session_id}' deleted successfully."}


api_router = APIRouter()
api_router.include_router(rag_router, prefix="/rag", tags=["rag"])
api_router.include_router(rag_router, prefix="/agent", tags=["agent"])
api_router.include_router(sessions_router, prefix="/sessions", tags=["sessions"])
