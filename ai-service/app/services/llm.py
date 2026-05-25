from collections.abc import AsyncGenerator

import httpx
from openai import OpenAI

from app.config import get_settings

SYSTEM_PROMPT = (
    "You are a helpful assistant. Answer questions based ONLY on the provided context. "
    "If the context doesn't contain relevant information, say "
    "'제공된 문서에서 관련 정보를 찾을 수 없습니다.' "
    "Always cite which part of the context you used."
)


class LLMService:
    def __init__(self):
        self.settings = get_settings()
        self.provider = self.settings.llm_provider

        if self.provider == "openai":
            self.client = OpenAI(api_key=self.settings.openai_api_key)

    def _build_messages(self, prompt: str, context: str) -> list[dict]:
        user_content = f"Context:\n{context}\n\nQuestion: {prompt}"
        return [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ]

    def generate(self, prompt: str, context: str) -> str:
        messages = self._build_messages(prompt, context)

        if self.provider == "openai":
            return self._generate_openai(messages)
        elif self.provider == "ollama":
            return self._generate_ollama(messages)
        else:
            raise ValueError(f"Unsupported LLM provider: {self.provider}")

    def _generate_openai(self, messages: list[dict]) -> str:
        response = self.client.chat.completions.create(
            model=self.settings.llm_model,
            messages=messages,
            temperature=0.3,
        )
        return response.choices[0].message.content

    def _generate_ollama(self, messages: list[dict]) -> str:
        response = httpx.post(
            f"{self.settings.ollama_base_url}/api/chat",
            json={
                "model": self.settings.llm_model,
                "messages": messages,
                "stream": False,
            },
            timeout=120.0,
        )
        response.raise_for_status()
        return response.json()["message"]["content"]

    async def generate_stream(
        self, prompt: str, context: str
    ) -> AsyncGenerator[str, None]:
        messages = self._build_messages(prompt, context)

        if self.provider == "openai":
            async for chunk in self._stream_openai(messages):
                yield chunk
        elif self.provider == "ollama":
            async for chunk in self._stream_ollama(messages):
                yield chunk
        else:
            raise ValueError(f"Unsupported LLM provider: {self.provider}")

    async def _stream_openai(
        self, messages: list[dict]
    ) -> AsyncGenerator[str, None]:
        stream = self.client.chat.completions.create(
            model=self.settings.llm_model,
            messages=messages,
            temperature=0.3,
            stream=True,
        )
        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def _stream_ollama(
        self, messages: list[dict]
    ) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream(
                "POST",
                f"{self.settings.ollama_base_url}/api/chat",
                json={
                    "model": self.settings.llm_model,
                    "messages": messages,
                    "stream": True,
                },
            ) as response:
                response.raise_for_status()
                import json

                async for line in response.aiter_lines():
                    if line.strip():
                        data = json.loads(line)
                        if content := data.get("message", {}).get("content"):
                            yield content
