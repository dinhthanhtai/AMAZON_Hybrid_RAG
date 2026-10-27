# Project Title: AI-Powered Monorepo

This repository is a monorepo containing a full-stack AI-powered application.

## Overview
- AMAZON_Hybrid_RAG - Build suggest product using amazon data

### Backend (`apps/api/`)
A Python-based FastAPI application designed for AI-driven workflows.
- **Framework:** FastAPI
- **Key Dependencies:** SQLAlchemy (ORM), asyncpg (PostgreSQL driver), Instructor (for structured data), LangSmith (tracing), OpenAI SDK, Qdrant (vector database).
- **Run command:** `uv run api`

### Frontend (`apps/web/`)
A React-based web application with AI capabilities.
- **Framework:** React + Vite
- **Styling:** TailwindCSS
- **AI Integration:** Vercel AI SDK (`@ai-sdk/react`, `ai`)
- **Key Dependencies:** Lucide-react (icons), React-markdown (content rendering).
- **Commands:**
  - `npm run dev`: Start the development server.
  - `npm run build`: Run type checking and production build.
  - `npm run lint`: Run `oxlint`.

## Tech Stack
- **Language:** Python 3.13+, TypeScript
- **Tooling:** `uv` (Python dependency management), `npm` (Node.js dependency management)
