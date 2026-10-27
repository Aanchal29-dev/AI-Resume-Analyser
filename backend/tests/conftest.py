"""Pytest configuration and global test fixtures."""

import pytest
import mongomock
from app.database import repository
from app.core.config import settings
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """FastAPI TestClient session fixture."""
    with pytest.MonkeyPatch.context() as patch:
        patch.setattr(repository, "MongoClient", mongomock.MongoClient)
        patch.setattr(settings, "MONGODB_URI", "mongodb://test-only")
        patch.setattr(settings, "MONGODB_DATABASE", "test_resume_analyser")
        patch.setattr(settings, "SEED_DEMO_DATA", True)
        with TestClient(app) as test_client:
            yield test_client
