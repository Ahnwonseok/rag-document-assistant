from fastapi import APIRouter, Depends, UploadFile
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sqlalchemy.orm import Session

from app.models.database import DocumentChunk, get_db
from app.models.schemas import IngestRequest, IngestResponse
from app.services.embeddings import EmbeddingService

router = APIRouter(prefix="/api/ingest", tags=["ingest"])

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
)


def _ingest_content(
    title: str,
    content: str,
    source: str | None,
    db: Session,
) -> int:
    chunks = text_splitter.split_text(content)
    embedding_service = EmbeddingService()
    embeddings = embedding_service.embed_texts(chunks)

    for chunk_text, embedding in zip(chunks, embeddings):
        doc_chunk = DocumentChunk(
            document_title=title,
            content=chunk_text,
            embedding=embedding,
            source=source,
        )
        db.add(doc_chunk)

    db.commit()
    return len(chunks)


@router.post("", response_model=IngestResponse)
async def ingest_text(request: IngestRequest, db: Session = Depends(get_db)):
    chunks_created = _ingest_content(
        title=request.title,
        content=request.content,
        source=request.source,
        db=db,
    )
    return IngestResponse(
        message=f"Successfully ingested '{request.title}'",
        chunks_created=chunks_created,
    )


SUPPORTED_EXTENSIONS = {".pdf", ".md", ".txt"}


@router.post("/file", response_model=IngestResponse)
async def ingest_file(file: UploadFile, db: Session = Depends(get_db)):
    filename = file.filename or "untitled"
    extension = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if extension not in SUPPORTED_EXTENSIONS:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{extension}'. Supported: {SUPPORTED_EXTENSIONS}",
        )

    raw_bytes = await file.read()
    content = raw_bytes.decode("utf-8", errors="replace")

    chunks_created = _ingest_content(
        title=filename,
        content=content,
        source=filename,
        db=db,
    )
    return IngestResponse(
        message=f"Successfully ingested file '{filename}'",
        chunks_created=chunks_created,
    )
