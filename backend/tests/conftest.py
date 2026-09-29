"""Pytest configuration and global test fixtures."""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="session")
def client():
    """FastAPI TestClient session fixture."""
    with TestClient(app) as test_client:
        yield test_client
