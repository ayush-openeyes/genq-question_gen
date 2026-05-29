import pytest
from app.services.demo_store import demo_store


async def test_authenticate_correct():
    user = await demo_store.authenticate("jordan@acme.com", "demo1234")
    assert user is not None
    assert user["email"] == "jordan@acme.com"


async def test_authenticate_wrong_password():
    user = await demo_store.authenticate("jordan@acme.com", "wrongpassword")
    assert user is None


async def test_authenticate_unknown_user():
    user = await demo_store.authenticate("nobody@unknown.com", "demo1234")
    assert user is None


async def test_authenticate_case_insensitive_email():
    user = await demo_store.authenticate("JORDAN@ACME.COM", "demo1234")
    assert user is not None


def test_get_user_by_id():
    user = demo_store.get_user("u3")
    assert user is not None
    assert user["role"] == "PM"


def test_get_user_unknown_id():
    user = demo_store.get_user("nonexistent")
    assert user is None
