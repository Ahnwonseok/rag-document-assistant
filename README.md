# RAG Document Assistant 

An AI-powered document Q&A system that uses Retrieval-Augmented Generation (RAG) to provide accurate answers grounded in your uploaded documents.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│             │     │                  │     │                      │
│   Next.js   │────▶│   Spring Boot    │────▶│  PostgreSQL + pgvector│
│  (Frontend) │     │   (Backend API)  │     │  (Document Storage)  │
│             │     │                  │     │                      │
└─────────────┘     └──────┬───────────┘     └──────────────────────┘
                           │                          ▲
                           ▼                          │
                    ┌──────────────────┐              │
                    │                  │              │
                    │    FastAPI       │──────────────┘
                    │  (AI Service)   │
                    │                  │
                    └──────┬───────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │  OpenAI API      │
                    │  (Embeddings +   │
                    │   Chat Completion)│
                    └──────────────────┘
```

## Tech Stack

| Layer      | Technology                    | Purpose                          |
|------------|-------------------------------|----------------------------------|
| Frontend   | Next.js 15, TypeScript, Tailwind CSS | Chat UI, document management |
| Backend    | Spring Boot 3, Java 17        | REST API, business logic, auth   |
| AI Service | FastAPI, Python 3.11, LangChain | RAG pipeline, embeddings, LLM   |
| Database   | PostgreSQL 16, pgvector        | Document storage, vector search  |
| AI Model   | OpenAI GPT-4 / Embeddings     | Text generation, vectorization   |
| Infra      | Docker Compose                 | Local development environment    |

## Prerequisites

- **Node.js** 18+
- **Java** 17+
- **Python** 3.11+
- **Docker** & Docker Compose
- **OpenAI API Key**

## Quick Start

### 1. Start the database

```bash
docker compose up -d
```

### 2. Run the backend (Spring Boot)

```bash
cd backend
./gradlew bootRun
```

The API will be available at `http://localhost:8080`.

### 3. Run the AI service (FastAPI)

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The AI service will be available at `http://localhost:8000`.

### 4. Run the frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Project Structure

```
llm/
├── frontend/              # Next.js frontend application
│   ├── app/               # App router pages and layouts
│   ├── components/        # React components
│   └── lib/               # API helpers and utilities
├── backend/               # Spring Boot backend API
│   └── src/main/java/     # Java source code
├── ai-service/            # FastAPI AI/RAG service
│   └── app/               # Python application modules
├── docker-compose.yml     # PostgreSQL + pgvector setup
└── README.md
```

## Features

- **Document Upload** — Upload PDF, TXT, and Markdown files for processing
- **RAG-based Q&A** — Ask questions and receive answers grounded in your documents
- **Source Citations** — Every answer includes relevant source passages with relevance scores
- **Chat History** — Maintain conversation context across multiple exchanges
- **Vector Search** — Semantic similarity search powered by pgvector embeddings
- **Modern Chat UI** — Clean, responsive dark-themed interface

## API Endpoints

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| POST   | `/api/chat/ask`           | Send a question, get an answer with sources |
| GET    | `/api/chat/history`       | Retrieve chat history by session |
| POST   | `/api/documents/upload`   | Upload a document for processing |
| GET    | `/api/documents`          | List all uploaded documents  |
| DELETE | `/api/documents/{id}`     | Delete a document            |

## Future Improvements

- [ ] Streaming responses (SSE) for real-time answer generation
- [ ] Multi-model support (Claude, Gemini, local LLMs via Ollama)
- [ ] User authentication and per-user document spaces
- [ ] Document chunking strategy optimization
- [ ] Conversation memory with summarization
- [ ] File type support expansion (DOCX, XLSX, HTML)
- [ ] Deployment configuration (AWS / GCP / Vercel)
- [ ] Monitoring and observability (OpenTelemetry)

## License

MIT
