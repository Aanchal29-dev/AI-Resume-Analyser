"""Tests for Recommendations API endpoints."""

def test_list_recommendations(client):
    """Test GET /api/v1/recommendations returns list with seeded recommendation."""
    response = client.get("/api/v1/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(r["recommendation_id"] == "rec_demo123456" for r in data)


def test_get_recommendation_by_id(client):
    """Test GET /api/v1/recommendations/{id} returns role, skill, and course recommendations."""
    response = client.get("/api/v1/recommendations/rec_demo123456")
    assert response.status_code == 200
    data = response.json()
    assert data["recommendation_id"] == "rec_demo123456"
    assert len(data["recommended_roles"]) >= 1
    assert len(data["recommended_skills"]) >= 1
    assert len(data["recommended_courses"]) >= 1


def test_create_recommendation(client):
    """Test POST /api/v1/recommendations generates recommendations for target role."""
    payload = {
        "user_id": "usr_demo123456",
        "target_role": "Data Scientist",
        "skills": ["Python", "Pandas", "Scikit-Learn"],
    }
    response = client.post("/api/v1/recommendations", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["target_role"] == "Data Scientist"
    assert data["recommendation_id"].startswith("rec_")
    assert len(data["recommended_roles"]) >= 1
