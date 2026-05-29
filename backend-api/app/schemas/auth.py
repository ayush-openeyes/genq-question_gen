from __future__ import annotations

from pydantic import EmailStr

from app.schemas.common import CamelModel


class LoginRequest(CamelModel):
    email: EmailStr
    password: str


class UserPublic(CamelModel):
    id: str
    name: str
    email: EmailStr
    role: str
    avatar: str
    org_id: str
    org: str


class AuthResponse(CamelModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
