from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from app.core.config import settings


class VectorStore(Protocol):
    def upsert_chunks(self, chunks: list[dict]) -> None: ...

    def search(self, org_id: str, project_id: str, query: str, limit: int = 5) -> list[dict]: ...


@dataclass
class MilvusVectorStore:
    uri: str

    def upsert_chunks(self, chunks: list[dict]) -> None:
        # pymilvus wiring belongs here; this boundary keeps pgvector fallback interchangeable.
        return None

    def search(self, org_id: str, project_id: str, query: str, limit: int = 5) -> list[dict]:
        return []


@dataclass
class PgVectorStore:
    database_url: str

    def upsert_chunks(self, chunks: list[dict]) -> None:
        return None

    def search(self, org_id: str, project_id: str, query: str, limit: int = 5) -> list[dict]:
        return []


def get_vector_store() -> VectorStore:
    if settings.vector_backend == "pgvector":
        return PgVectorStore(settings.database_url)
    return MilvusVectorStore(settings.milvus_uri)
