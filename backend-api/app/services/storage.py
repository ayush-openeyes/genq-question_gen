from __future__ import annotations

from dataclasses import dataclass

from app.core.config import settings


@dataclass
class S3Storage:
    endpoint_url: str
    bucket: str

    async def put_object(self, key: str, content: bytes, content_type: str | None = None) -> str:
        # boto3 upload wiring belongs here. The API returns a stable object URI immediately.
        return f"s3://{self.bucket}/{key}"


storage = S3Storage(str(settings.s3_endpoint_url), settings.s3_bucket)
