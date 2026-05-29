from __future__ import annotations

from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "GenQue API"
    app_version: str = "0.1.0"
    app_env: str = "local"
    database_url: str = "postgresql+asyncpg://genque:genque@localhost:5432/genque"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret_key: str = Field(default="local-dev-change-me", min_length=16)
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 15
    refresh_token_days: int = 30
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:8080"]
    s3_endpoint_url: AnyHttpUrl | str = "http://localhost:9000"
    s3_access_key_id: str = "genque"
    s3_secret_access_key: str = "genque-secret"
    s3_bucket: str = "genque-assets"
    vector_backend: str = "milvus"
    milvus_uri: str = "http://localhost:19530"
    generation_model: str = "provider-configured"
    embedding_model: str = "provider-configured"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
