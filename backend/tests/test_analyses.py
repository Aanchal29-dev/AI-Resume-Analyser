"""Tests for Resume Analyses and ATS scoring endpoints."""

def test_list_analyses(client):
    """Test GET /api/v1/analyses returns list with demo analysis."""
    response = client.get("/api/v1/analyses")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(a["analysis_id"] == "anl_demo123456" for a in data)


def test_get_analysis_by_id(client):
    """Test GET /api/v1/analyses/{analysis_id} returns detailed ATS report."""
    response = client.get("/api/v1/analyses/anl_demo123456")
    assert response.status_code == 200
    data = response.json()
    assert data["analysis_id"] == "anl_demo123456"
    assert data["overall_score"] == 84.0
    assert data["ats_score"] == 88.0
    assert "matched_keywords" in data
    assert "missing_keywords" in data
    assert "bullet_improvements" in data
    assert data["is_mock"] is True


def test_create_analysis_against_job(client):
    """Test POST /api/v1/analyses triggers analysis and calculates metrics."""
    payload = {
        "resume_id": "res_demo123456",
        "job_id": "job_fe_01",
        "user_id": "usr_demo123456",
    }
    response = client.post("/api/v1/analyses", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["resume_id"] == "res_demo123456"
    assert data["job_id"] == "job_fe_01"
    assert data["analysis_id"].startswith("anl_")
    assert data["overall_score"] > 0
    assert len(data["matched_keywords"]) > 0


def test_get_analyses_for_resume(client):
    """Test GET /api/v1/resumes/{resume_id}/analyses returns historical analyses for resume."""
    response = client.get("/api/v1/resumes/res_demo123456/analyses")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
