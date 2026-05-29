from __future__ import annotations

from collections.abc import Callable
from typing import Any

from fastapi import Depends, HTTPException, status

from app.core.security import get_current_user

ROLE_PERMISSIONS: dict[str, set[str]] = {
    "SA": {"*"},
    "OA": {
        "organizations.manage",
        "users.manage",
        "roles.manage",
        "projects.manage",
        "questions.read",
        "questions.review",
        "assessments.manage",
        "analytics.read",
        "audit.read",
        "integrations.manage",
    },
    "PM": {
        "projects.manage",
        "questions.generate",
        "questions.edit",
        "questions.read",
        "questions.review",
        "assessments.manage",
        "analytics.read",
    },
    "SME": {"questions.generate", "questions.edit", "questions.read"},
    "RE": {"questions.edit", "questions.read", "questions.review"},
    "VI": {"questions.read", "analytics.read"},
}


def has_permission(role: str, permission: str) -> bool:
    permissions = ROLE_PERMISSIONS.get(role, set())
    return "*" in permissions or permission in permissions


def require_permission(permission: str) -> Callable[..., Any]:
    async def dependency(user: dict[str, Any] = Depends(get_current_user)) -> dict[str, Any]:
        if not has_permission(user["role"], permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing permission: {permission}",
            )
        return user

    return dependency
