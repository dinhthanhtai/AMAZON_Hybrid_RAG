from typing import Optional, List
from datetime import datetime, timezone
import uuid
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from api.db.models import SessionModel, MessageModel


async def get_or_create_session(
    db: AsyncSession,
    session_id: Optional[str] = None,
    title: Optional[str] = None
) -> SessionModel:
    """Fetch an existing session by ID or create a new one."""
    if session_id:
        stmt = select(SessionModel).where(SessionModel.id == session_id)
        result = await db.execute(stmt)
        session = result.scalar_one_or_none()
        if session:
            return session

    # Create new session
    new_id = session_id if session_id else str(uuid.uuid4())
    new_session = SessionModel(
        id=new_id,
        title=title or "New Conversation",
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    return new_session


async def add_message(
    db: AsyncSession,
    session_id: str,
    role: str,
    content: str,
    used_contexts: Optional[list] = None,
    request_id: Optional[str] = None
) -> MessageModel:
    """Add a message to a session and touch the session's updated_at timestamp."""
    message = MessageModel(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role=role,
        content=content,
        used_contexts=used_contexts,
        request_id=request_id,
        created_at=datetime.now(timezone.utc),
    )
    db.add(message)

    # Touch session's updated_at
    touch_stmt = (
        update(SessionModel)
        .where(SessionModel.id == session_id)
        .values(updated_at=datetime.now(timezone.utc))
    )
    await db.execute(touch_stmt)
    await db.commit()
    await db.refresh(message)
    return message


async def get_recent_messages(
    db: AsyncSession,
    session_id: str,
    limit: int = 10
) -> List[MessageModel]:
    """
    Retrieve the most recent messages for a session in chronological order.
    `limit` is the maximum number of recent messages to fetch.
    """
    stmt = (
        select(MessageModel)
        .where(MessageModel.session_id == session_id)
        .order_by(MessageModel.created_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    messages = list(result.scalars().all())
    # Reverse so they are returned in ascending chronological order
    messages.reverse()
    return messages


def format_chat_history(messages: List[MessageModel]) -> str:
    """
    Format a list of MessageModel instances into a clean string suitable for Jinja2 LLM prompt injection.
    """
    if not messages:
        return ""

    lines = []
    for msg in messages:
        role_label = "User" if msg.role == "user" else "Assistant"
        lines.append(f"{role_label}: {msg.content}")

    return "\n".join(lines)


async def list_sessions(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0
) -> List[SessionModel]:
    """List sessions ordered by most recently active."""
    stmt = (
        select(SessionModel)
        .order_by(SessionModel.updated_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_session_with_messages(
    db: AsyncSession,
    session_id: str
) -> Optional[SessionModel]:
    """Fetch session with all its messages."""
    stmt = select(SessionModel).where(SessionModel.id == session_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def delete_session(
    db: AsyncSession,
    session_id: str
) -> bool:
    """Delete a session and all its associated messages."""
    stmt = delete(SessionModel).where(SessionModel.id == session_id)
    result = await db.execute(stmt)
    await db.commit()
    return result.rowcount > 0
