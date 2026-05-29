from __future__ import annotations

from app.services.demo_store import demo_store


class QuestionGenerationService:
    """Schema-first generation facade.

    Provider-specific LLM clients plug in here. The initial implementation is deterministic so
    auth, streaming, saving, and audit flows can be built before a provider is configured.
    """

    def create_session(self, payload: dict, user: dict) -> dict:
        return demo_store.create_generation_session(payload, user)


class RagRetrievalService:
    def retrieve_context(self, query: str, project_id: str, limit: int = 5) -> list[dict]:
        return [{"text": f"Context placeholder for {query}", "projectId": project_id, "score": 1.0}][
            :limit
        ]


question_generation_service = QuestionGenerationService()
rag_retrieval_service = RagRetrievalService()
