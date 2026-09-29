"""Tests for root and health check endpoints."""

def test_root_endpoint(client):
    """Test GET / returns active message and docs reference."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"
    assert "AI Resume Platform Backend is running" in data["message"]
    assert "docs_url" in data


def test_api_health_endpoint(client):
    """Test GET /api/health returns healthy status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_standalone_health_endpoint(client):
    """Test GET /health returns healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
