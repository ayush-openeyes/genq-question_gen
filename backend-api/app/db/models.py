from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class TenantMixin:
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    org_id: Mapped[str] = mapped_column(String(64), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    plan: Mapped[str] = mapped_column(String(64), default="Enterprise")
    status: Mapped[str] = mapped_column(String(64), default="Active")
    settings: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Role(TenantMixin, Base):
    __tablename__ = "roles"

    key: Mapped[str] = mapped_column(String(32), index=True)
    name: Mapped[str] = mapped_column(String(128))
    system: Mapped[bool] = mapped_column(default=False)


class Permission(TenantMixin, Base):
    __tablename__ = "permissions"

    key: Mapped[str] = mapped_column(String(128), index=True)
    description: Mapped[str] = mapped_column(Text, default="")


class RolePermission(TenantMixin, Base):
    __tablename__ = "role_permissions"

    role_id: Mapped[str] = mapped_column(String(64), ForeignKey("roles.id"))
    permission_id: Mapped[str] = mapped_column(String(64), ForeignKey("permissions.id"))


class User(TenantMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(32), index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(64), default="Active")


class RefreshToken(TenantMixin, Base):
    __tablename__ = "refresh_tokens"

    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), index=True)
    token_hash: Mapped[str] = mapped_column(String(255), unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Project(TenantMixin, Base):
    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(String(255), index=True)
    status: Mapped[str] = mapped_column(String(64), default="Draft")
    description: Mapped[str] = mapped_column(Text, default="")
    settings: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)


class ProjectMember(TenantMixin, Base):
    __tablename__ = "project_members"

    project_id: Mapped[str] = mapped_column(String(64), ForeignKey("projects.id"), index=True)
    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), index=True)
    role: Mapped[str] = mapped_column(String(32))


class Question(TenantMixin, Base):
    __tablename__ = "questions"

    project_id: Mapped[str | None] = mapped_column(String(64), ForeignKey("projects.id"), nullable=True)
    public_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    stem: Mapped[str] = mapped_column(Text)
    format: Mapped[str] = mapped_column(String(64), index=True)
    difficulty: Mapped[str] = mapped_column(String(32), index=True)
    status: Mapped[str] = mapped_column(String(64), index=True, default="Draft")
    metadata_json: Mapped[dict[str, Any]] = mapped_column("metadata", JSON, default=dict)
    options: Mapped[list["QuestionOption"]] = relationship(cascade="all, delete-orphan")


class QuestionOption(TenantMixin, Base):
    __tablename__ = "question_options"

    question_id: Mapped[str] = mapped_column(String(64), ForeignKey("questions.id"), index=True)
    label: Mapped[str] = mapped_column(String(16))
    text: Mapped[str] = mapped_column(Text)
    is_correct: Mapped[bool] = mapped_column(default=False)


class JsonPayloadTable(TenantMixin):
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    status: Mapped[str | None] = mapped_column(String(64), nullable=True)


class QuestionVersion(JsonPayloadTable, Base):
    __tablename__ = "question_versions"


class Comment(JsonPayloadTable, Base):
    __tablename__ = "comments"


class ReviewAssignment(JsonPayloadTable, Base):
    __tablename__ = "review_assignments"


class ReviewDecision(JsonPayloadTable, Base):
    __tablename__ = "review_decisions"


class Assessment(JsonPayloadTable, Base):
    __tablename__ = "assessments"


class AssessmentSection(JsonPayloadTable, Base):
    __tablename__ = "assessment_sections"


class AssessmentItem(JsonPayloadTable, Base):
    __tablename__ = "assessment_items"


class GenerationSession(JsonPayloadTable, Base):
    __tablename__ = "generation_sessions"


class SourceAsset(JsonPayloadTable, Base):
    __tablename__ = "source_assets"


class DocumentChunk(JsonPayloadTable, Base):
    __tablename__ = "document_chunks"


class Notification(JsonPayloadTable, Base):
    __tablename__ = "notifications"


class Integration(JsonPayloadTable, Base):
    __tablename__ = "integrations"


class ApiKey(JsonPayloadTable, Base):
    __tablename__ = "api_keys"


class FeatureFlag(JsonPayloadTable, Base):
    __tablename__ = "feature_flags"


class AuditLog(JsonPayloadTable, Base):
    __tablename__ = "audit_logs"
