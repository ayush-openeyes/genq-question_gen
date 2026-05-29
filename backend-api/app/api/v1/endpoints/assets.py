from __future__ import annotations

from hashlib import sha256
from uuid import uuid4

from fastapi import APIRouter, Depends, File, UploadFile

from app.core.rbac import require_permission
from app.services.ingestion import asset_ingestion_service, ocr_service, transcription_service
from app.services.storage import storage

router = APIRouter()


@router.post("")
async def upload_asset(
    project_id: str,
    file: UploadFile = File(...),
    user: dict = Depends(require_permission("questions.generate")),
) -> dict:
    content = await file.read()
    digest = sha256(content).hexdigest()
    key = f"{user['orgId']}/{project_id}/{uuid4().hex}-{file.filename}"
    uri = await storage.put_object(key, content, file.content_type)
    lower_name = (file.filename or "").lower()
    if lower_name.endswith((".mp3", ".wav", ".mp4", ".mov")):
        segments = transcription_service.transcribe(content, file.filename or "upload")
        text = "\n".join(segment["text"] for segment in segments)
    elif lower_name.endswith((".png", ".jpg", ".jpeg", ".pdf")):
        text = ocr_service.extract_text(content, file.filename or "upload")
        segments = []
    else:
        text = content.decode("utf-8", errors="ignore")
        segments = []
    chunks = asset_ingestion_service.chunk_text(text)
    return {
        "id": f"asset_{uuid4().hex[:12]}",
        "projectId": project_id,
        "filename": file.filename,
        "contentType": file.content_type,
        "sha256": digest,
        "uri": uri,
        "chunkCount": len(chunks),
        "segments": segments,
    }
