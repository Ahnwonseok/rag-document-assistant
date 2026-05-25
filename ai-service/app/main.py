import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.database import init_db
from app.routers import chat, ingest

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting LLM RAG AI Service...")
    init_db()
    logger.info("Database initialized.")
    yield
    logger.info("Shutting down LLM RAG AI Service...")


app = FastAPI(
    title="LLM RAG AI Service",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(ingest.router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LLM RAG AI Service"}
