"""Tests for AI and Gemini endpoints."""

def test_ai_chat_endpoint(client):
    """Test POST /api/v1/ai/chat returns chat response."""
    payload = {
        "message": "How do I improve my resume for a Software Engineer role?",
        "candidate_name": "Alex",
        "target_role": "Software Engineer",
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 10


def test_ai_bullet_optimization(client):
    """Test POST /api/v1/ai/optimize-bullet returns improved bullet."""
    payload = {
        "bullet": "Worked on backend APIs using Python.",
        "role_title": "Backend Developer",
    }
    response = client.post("/api/v1/ai/optimize-bullet", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "improved_bullet" in data
    assert len(data["improved_bullet"]) > 10


def test_ai_analyze_text(client):
    """Test POST /api/v1/ai/analyze-text evaluates raw resume content."""
    payload = {
        "resume_text": "Alex Morgan. Computer Science graduate with Python, FastAPI, React and SQL experience.",
        "target_role": "Full Stack Developer",
    }
    response = client.post("/api/v1/ai/analyze-text", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert "matched_keywords" in data
