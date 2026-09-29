"""Tests for Job Descriptions API endpoints."""

def test_list_jobs(client):
    """Test GET /api/v1/jobs returns pre-seeded job benchmarks."""
    response = client.get("/api/v1/jobs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    assert any(j["job_id"] == "job_fe_01" for j in data)


def test_get_job_by_id(client):
    """Test GET /api/v1/jobs/{job_id} returns single job details."""
    response = client.get("/api/v1/jobs/job_fe_01")
    assert response.status_code == 200
    data = response.json()
    assert data["job_id"] == "job_fe_01"
    assert data["title"] == "Frontend Developer"
    assert "React" in data["required_skills"]


def test_create_job(client):
    """Test POST /api/v1/jobs creates a new job benchmark."""
    payload = {
        "title": "Cloud DevOps Engineer",
        "company": "CloudScape",
        "location": "Remote",
        "category": "Infrastructure",
        "description": "Looking for a DevOps Engineer to manage Kubernetes clusters and Terraform pipelines.",
        "required_skills": ["Docker", "Kubernetes", "AWS", "Terraform", "Linux"],
        "optional_skills": ["Go", "Prometheus", "Helm"],
        "experience_level": "Mid-Level",
        "min_salary": 95000,
        "max_salary": 140000,
    }
    response = client.post("/api/v1/jobs", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Cloud DevOps Engineer"
    assert data["job_id"].startswith("job_")
    assert "Terraform" in data["required_skills"]


def test_update_job(client):
    """Test PUT /api/v1/jobs/{job_id} updates job attributes."""
    payload = {
        "min_salary": 80000,
        "max_salary": 120000,
    }
    response = client.put("/api/v1/jobs/job_fe_01", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["min_salary"] == 80000
    assert data["max_salary"] == 120000


def test_get_nonexistent_job(client):
    """Test GET /api/v1/jobs/{job_id} returns 404 for missing ID."""
    response = client.get("/api/v1/jobs/job_missing_999")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
