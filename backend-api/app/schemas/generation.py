from __future__ import annotations

from app.schemas.common import CamelModel


class GenerationRequest(CamelModel):
    project_id: str
    topic: str
    formats: list[str]
    quantity: int = 10
    difficulty: str = "Mixed"
    audience: str | None = None
    blooms_levels: list[str] = []
    avoid_topics: str | None = None
    tone: str = "Professional"
    answer_key: bool = True
    source_asset_ids: list[str] = []


class GenerationSessionResponse(CamelModel):
    id: str
    status: str
    project_id: str


class SaveGeneratedRequest(CamelModel):
    question_ids: list[str] | None = None
