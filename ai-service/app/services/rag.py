from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.database import DocumentChunk, SessionLocal
from app.services.embeddings import EmbeddingService
from app.services.llm import LLMService


class RAGService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.llm_service = LLMService()

    def retrieve(
        self, query: str, top_k: int = 3
    ) -> list[dict]:
        query_embedding = self.embedding_service.embed_text(query)
        embedding_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

        db: Session = SessionLocal()
        try:
            results = db.execute(
                text(
                    """
                    SELECT id, document_title, content, source,
                           1 - (embedding <=> CAST(:embedding AS vector)) AS score
                    FROM document_chunks
                    ORDER BY embedding <=> CAST(:embedding AS vector)
                    LIMIT :top_k
                    """
                ),
                {"embedding": embedding_str, "top_k": top_k},
            ).fetchall()

            return [
                {
                    "content": row.content,
                    "document_title": row.document_title,
                    "score": float(row.score),
                    "source": row.source,
                }
                for row in results
            ]
        finally:
            db.close()

    def ask(self, question: str) -> dict:
        chunks = self.retrieve(question)

        context = "\n\n---\n\n".join(
            f"[Source: {chunk['document_title']}]\n{chunk['content']}"
            for chunk in chunks
        )

        answer = self.llm_service.generate(question, context)

        sources = [
            {
                "content": chunk["content"],
                "document_title": chunk["document_title"],
                "score": chunk["score"],
            }
            for chunk in chunks
        ]

        return {"answer": answer, "sources": sources}
