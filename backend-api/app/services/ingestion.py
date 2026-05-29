from __future__ import annotations


class OcrService:
    def extract_text(self, content: bytes, filename: str) -> str:
        return f"OCR placeholder for {filename} ({len(content)} bytes)"


class TranscriptionService:
    def transcribe(self, content: bytes, filename: str) -> list[dict]:
        return [{"start": 0, "end": 0, "text": f"Whisper placeholder for {filename}"}]


class AssetIngestionService:
    def chunk_text(self, text: str, chunk_size: int = 1200) -> list[str]:
        return [text[i : i + chunk_size] for i in range(0, len(text), chunk_size)] or [""]


ocr_service = OcrService()
transcription_service = TranscriptionService()
asset_ingestion_service = AssetIngestionService()
