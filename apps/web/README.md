# AI Chatbox Frontend (React + Vite + Tailwind CSS)

A modern, responsive, high-performance Chatbox frontend specifically designed for the **Amazon Hybrid RAG** assistant.

## Features

- ⚡ **Vite + React 19 + TypeScript**: Instant HMR and robust typing.
- 🎨 **Tailwind CSS v4 + Dark Mode Theme**: Sleek dark UI with glowing accents and responsive layouts.
- 💬 **Hybrid RAG Integration**: Communicates directly with `POST /rag/` FastAPI endpoint.
- 📦 **Referenced Products Showcase**: Visualizes Amazon product contexts returned by the RAG pipeline with images, ASINs, descriptions, and price tags.
- 📝 **Markdown & Code Highlighting**: Syntax-highlighted code blocks with 1-click copy-to-clipboard and GFM tables.
- 🌊 **Fluid Streaming UX**: Micro-token streaming simulation with bouncing typing indicator and generation cancellation (`Stop`).
- 📜 **Smart Auto-Scroll**: Smooth bottom pinning with floating "New messages" jump indicator when scrolled up.

## Quick Start

### 1. Start the FastAPI Backend
From the root repository directory:
```bash
uv run uvicorn api.main:app --reload --port 8000
```

### 2. Start the Frontend
From `apps/web`:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Vite automatically proxies `/rag` requests to `http://localhost:8000`.

### Production Build
```bash
npm run build
npm run preview
```
