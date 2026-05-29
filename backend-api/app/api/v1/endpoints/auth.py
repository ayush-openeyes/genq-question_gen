from __future__ import annotations

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status

from app.core.config import settings
from app.core.metrics import AUTH_FAILURES
from app.core.security import create_access_token, create_refresh_token, get_current_user
from app.schemas.auth import AuthResponse, LoginRequest, UserPublic
from app.services.demo_store import DemoStore, demo_store

router = APIRouter()


def get_demo_store() -> DemoStore:
    return demo_store


def public_user(user: dict) -> UserPublic:
    return UserPublic(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        role=user["role"],
        avatar=user["avatar"],
        org_id=user["orgId"],
        org=user["org"],
    )


def issue_tokens(user: dict, response: Response) -> AuthResponse:
    access_token = create_access_token(user["id"], user["role"], user["orgId"])
    refresh_token = create_refresh_token()
    demo_store.remember_refresh(refresh_token, user["id"])
    response.set_cookie(
        "genque_refresh",
        refresh_token,
        httponly=True,
        secure=settings.app_env != "local",
        samesite="lax",
        max_age=settings.refresh_token_days * 24 * 60 * 60,
        path="/api/v1/auth",
    )
    return AuthResponse(access_token=access_token, user=public_user(user))


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, response: Response, store: DemoStore = Depends(get_demo_store)) -> AuthResponse:
    user = await store.authenticate(payload.email, payload.password)
    if not user:
        AUTH_FAILURES.inc()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return issue_tokens(user, response)


@router.post("/refresh", response_model=AuthResponse)
async def refresh(response: Response, genque_refresh: str | None = Cookie(default=None)) -> AuthResponse:
    if not genque_refresh:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
    replacement = create_refresh_token()
    user = demo_store.rotate_refresh(genque_refresh, replacement)
    if not user:
        AUTH_FAILURES.inc()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    access_token = create_access_token(user["id"], user["role"], user["orgId"])
    response.set_cookie(
        "genque_refresh",
        replacement,
        httponly=True,
        secure=settings.app_env != "local",
        samesite="lax",
        max_age=settings.refresh_token_days * 24 * 60 * 60,
        path="/api/v1/auth",
    )
    return AuthResponse(access_token=access_token, user=public_user(user))


@router.post("/logout")
async def logout(response: Response, genque_refresh: str | None = Cookie(default=None)) -> dict[str, str]:
    if genque_refresh:
        demo_store.refresh_tokens.pop(genque_refresh, None)
    response.delete_cookie("genque_refresh", path="/api/v1/auth")
    return {"status": "ok"}


@router.get("/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)) -> UserPublic:
    return public_user(user)
