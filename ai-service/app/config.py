from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    database_url: str = "postgresql://llm_user:llm_password@localhost:5432/llm_db"
    ollama_base_url: str = "http://localhost:11434"
    llm_provider: str = "openai"
    embedding_model: str = "text-embedding-3-small"
    llm_model: str = "gpt-4o-mini"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
