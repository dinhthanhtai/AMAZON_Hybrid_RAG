# AGENTS.md

## Repository Overview
Monorepo with a Python FastAPI backend and a React/Vite frontend.

## Project Structure
- `apps/api/`: Python API (`FastAPI`, `SQLAlchemy`, `asyncpg`, `openai`, `qdrant`).
- `apps/web/`: React frontend (`Vite`, `TailwindCSS`, `AI SDK`).
- `pyproject.toml` (root): Defines `uv` workspace. Note: `packages/` is referenced but currently does not exist.

## Development Workflow
### Backend (`apps/api/`)
- Tooling: `uv`
- Run: `uv run api` (defined in `pyproject.toml` as `api = "api:main"`)

### Frontend (`apps/web/`)
- Tooling: `npm`
- Dependencies: `@ai-sdk/react`, `ai`, `react`, `tailwindcss`
- Commands:
  - `npm run dev`: Start development server.
  - `npm run build`: Typecheck and build.
  - `npm run lint`: Run `oxlint`.
