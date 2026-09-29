"""Tests for Career Discovery API endpoints."""

def test_list_career_roles(client):
    """Test GET /api/v1/career/roles returns catalog of roles."""
    response = client.get("/api/v1/career/roles")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2


def test_get_career_role_by_id(client):
    """Test GET /api/v1/career/roles/{role_id} returns detailed role profile."""
    response = client.get("/api/v1/career/roles/role_frontend_eng")
    assert response.status_code == 200
    data = response.json()
    assert data["role_id"] == "role_frontend_eng"
    assert data["title"] == "Frontend Engineer"
    assert len(data["required_skills"]) >= 1
    assert len(data["action_plan"]) >= 1


def test_submit_career_questionnaire(client):
    """Test POST /api/v1/career/questionnaire processes career questionnaire."""
    payload = {
        "user_id": "usr_demo123456",
        "interests": ["Web Design", "Interactive UI", "Animation"],
        "work_areas": ["Frontend", "Design Systems"],
        "technical_preference": "balanced",
        "existing_skills": ["HTML", "CSS", "Basic JavaScript"],
        "experience_level": "student",
        "preferred_industries": ["Tech", "EdTech"],
        "learning_style": "hands-on",
    }
    response = client.post("/api/v1/career/questionnaire", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["discovery_id"].startswith("dsc_")
    assert "primary_recommendation" in data
    assert "summary_insight" in data
    assert data["is_mock"] is True


def test_list_career_recommendations(client):
    """Test GET /api/v1/career/recommendations returns previous questionnaire runs."""
    response = client.get("/api/v1/career/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
