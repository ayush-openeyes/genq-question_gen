import pytest


async def test_login_success(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "jordan@acme.com", "password": "demo1234"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "accessToken" in data
    assert data["user"]["email"] == "jordan@acme.com"


async def test_login_wrong_password(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "jordan@acme.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


async def test_login_unknown_user(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@unknown.com", "password": "demo1234"},
    )
    assert response.status_code == 401


async def test_me_requires_auth(client):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401


async def test_me_returns_user(client, auth_token):
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "jordan@acme.com"
