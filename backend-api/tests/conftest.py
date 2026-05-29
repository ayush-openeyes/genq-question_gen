import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def auth_token(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "jordan@acme.com", "password": "demo1234"},
    )
    return response.json()["accessToken"]
