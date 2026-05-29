"""initial GenQue schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-25
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def org_columns() -> list[sa.Column]:
    return [
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("org_id", sa.String(length=64), nullable=False, index=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    ]


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table(
        "organizations",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("plan", sa.String(length=64), nullable=False, server_default="Enterprise"),
        sa.Column("status", sa.String(length=64), nullable=False, server_default="Active"),
        sa.Column("settings", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    for table_name in [
        "roles",
        "permissions",
        "role_permissions",
        "users",
        "refresh_tokens",
        "projects",
        "project_members",
        "questions",
        "question_options",
        "question_versions",
        "comments",
        "review_assignments",
        "review_decisions",
        "assessments",
        "assessment_sections",
        "assessment_items",
        "generation_sessions",
        "source_assets",
        "document_chunks",
        "notifications",
        "integrations",
        "api_keys",
        "feature_flags",
        "audit_logs",
    ]:
        op.create_table(
            table_name,
            *org_columns(),
            sa.Column("payload", sa.JSON(), nullable=False, server_default="{}"),
            sa.Column("status", sa.String(length=64), nullable=True),
        )


def downgrade() -> None:
    for table_name in reversed(
        [
            "roles",
            "permissions",
            "role_permissions",
            "users",
            "refresh_tokens",
            "projects",
            "project_members",
            "questions",
            "question_options",
            "question_versions",
            "comments",
            "review_assignments",
            "review_decisions",
            "assessments",
            "assessment_sections",
            "assessment_items",
            "generation_sessions",
            "source_assets",
            "document_chunks",
            "notifications",
            "integrations",
            "api_keys",
            "feature_flags",
            "audit_logs",
        ]
    ):
        op.drop_table(table_name)
    op.drop_table("organizations")
