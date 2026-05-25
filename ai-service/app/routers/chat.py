from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.schemas import ChatRequest, ChatResponse, SourceInfo
from app.services.rag import RAGService

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: ChatRequest):
    rag_service = RAGService()
    result = rag_service.ask(request.question)

    sources = [
        SourceInfo(
            content=s["content"],
            document_title=s["document_title"],
            score=s["score"],
        )
        for s in result["sources"]
    ]

    return ChatResponse(answer=result["answer"], sources=sources)


@router.post("/stream")
async def stream_answer(request: ChatRequest):
    rag_service = RAGService()
    chunks = rag_service.retrieve(request.question)

    context = "\n\n---\n\n".join(
        f"[Source: {chunk['document_title']}]\n{chunk['content']}"
        for chunk in chunks
    )

    async def event_generator():
        async for token in rag_service.llm_service.generate_stream(
            request.question, context
        ):
            yield token

    return StreamingResponse(event_generator(), media_type="text/plain")
