"""Tests for Users API endpoints."""

def test_list_users(client):
    """Test GET /api/v1/users returns list including seeded demo user."""
    response = client.get("/api/v1/users")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(u["user_id"] == "usr_demo123456" for u in data)


def test_get_user_by_id(client):
    """Test GET /api/v1/users/{user_id} returns existing user."""
    response = client.get("/api/v1/users/usr_demo123456")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "usr_demo123456"
    assert data["name"] == "Alex Morgan"
    assert data["email"] == "alex.morgan@example.com"


def test_get_user_profile(client):
    """Test GET /api/v1/users/{user_id}/profile returns profile and statistics."""
    response = client.get("/api/v1/users/usr_demo123456/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "usr_demo123456"
    assert "resumes_count" in data
    assert "profile" in data


def test_create_user(client):
    """Test POST /api/v1/users creates new user."""
    payload = {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "avatar_url": "https://example.com/avatar.png",
        "profile": {
            "headline": "Junior Python Developer",
            "target_role": "Backend Engineer",
            "location": "New York, NY",
        },
    }
    response = client.post("/api/v1/users", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Jane Doe"
    assert data["email"] == "jane.doe@example.com"
    assert data["user_id"].startswith("usr_")


def test_create_duplicate_user_conflict(client):
    """Test POST /api/v1/users with duplicate email returns 409 Conflict."""
    payload = {
        "name": "Alex Duplicate",
        "email": "alex.morgan@example.com",
    }
    response = client.post("/api/v1/users", json=payload)
    assert response.status_code == 409
    data = response.json()
    assert data["success"] is False


def test_get_nonexistent_user(client):
    """Test GET /api/v1/users/nonexistent returns 404."""
    response = client.get("/api/v1/users/usr_nonexistent999")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
