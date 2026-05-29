from __future__ import annotations

import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.core.metrics import LLM_LATENCY
from app.core.rbac import require_permission
from app.schemas.generation import GenerationRequest, GenerationSessionResponse, SaveGeneratedRequest
from app.services.demo_store import demo_store
from app.services.orchestration import question_generation_service

router = APIRouter()


@router.post("/sessions", response_model=GenerationSessionResponse)
async def create_session(
    payload: GenerationRequest,
    user: dict = Depends(require_permission("questions.generate")),
) -> GenerationSessionResponse:
    with LLM_LATENCY.time():
        session = question_generation_service.create_session(payload.model_dump(by_alias=True), user)
    return GenerationSessionResponse(id=session["id"], status=session["status"], project_id=payload.project_id)


@router.get("/sessions/{session_id}/events")
async def session_events(
    session_id: str,
    user: dict = Depends(require_permission("questions.generate")),
) -> StreamingResponse:
    session = demo_store.generation_sessions.get(session_id)
    if not session or session["userId"] != user["id"]:
        raise HTTPException(status_code=404, detail="Generation session not found")

    async def event_stream():
        for question in session["questions"]:
            await asyncio.sleep(0.05)
            yield f"event: question\ndata: {json.dumps(question)}\n\n"
        yield f"event: done\ndata: {json.dumps({'status': session['status']})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/sessions/{session_id}/save")
async def save_session(
    session_id: str,
    payload: SaveGeneratedRequest,
    user: dict = Depends(require_permission("questions.generate")),
) -> dict[str, list[dict]]:
    session = demo_store.generation_sessions.get(session_id)
    if not session or session["userId"] != user["id"]:
        raise HTTPException(status_code=404, detail="Generation session not found")
    return {"items": demo_store.save_generated(session_id, payload.question_ids)}
