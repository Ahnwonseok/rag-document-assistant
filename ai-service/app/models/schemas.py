from pydantic import BaseModel


class SourceInfo(BaseModel):
    content: str
    document_title: str
    score: float


class ChatRequest(BaseModel):
    question: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceInfo]


class IngestRequest(BaseModel):
    title: str
    content: str
    source: str | None = None


class IngestResponse(BaseModel):
    message: str
    chunks_created: int
