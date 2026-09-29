"""Tests for Resume API endpoints and file upload validation."""

import io


def test_list_resumes(client):
    """Test GET /api/v1/resumes returns list with demo resume."""
    response = client.get("/api/v1/resumes")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(r["resume_id"] == "res_demo123456" for r in data)


def test_get_resume_by_id(client):
    """Test GET /api/v1/resumes/{resume_id} returns resume details and parsed sections."""
    response = client.get("/api/v1/resumes/res_demo123456")
    assert response.status_code == 200
    data = response.json()
    assert data["resume_id"] == "res_demo123456"
    assert data["is_parsed"] is True
    assert "skills" in data["parsed_data"]


def test_upload_valid_pdf_resume(client):
    """Test POST /api/v1/resumes/upload accepts valid PDF document."""
    fake_pdf_content = b"%PDF-1.5 fake resume document content for test"
    files = {"file": ("test_resume.pdf", io.BytesIO(fake_pdf_content), "application/pdf")}
    data = {"user_id": "usr_demo123456"}

    response = client.post("/api/v1/resumes/upload", files=files, data=data)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["file_name"] == "test_resume.pdf"
    assert res_data["resume_id"].startswith("res_")
    assert res_data["file_size_bytes"] == len(fake_pdf_content)


def test_upload_invalid_extension(client):
    """Test POST /api/v1/resumes/upload rejects forbidden file extension with 400."""
    fake_exe_content = b"Binary executable content"
    files = {"file": ("malicious.exe", io.BytesIO(fake_exe_content), "application/octet-stream")}

    response = client.post("/api/v1/resumes/upload", files=files)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert "Unsupported file format" in data["error"]["message"]


def test_upload_empty_file(client):
    """Test POST /api/v1/resumes/upload rejects 0-byte file."""
    files = {"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")}
    response = client.post("/api/v1/resumes/upload", files=files)
    assert response.status_code == 400
    data = response.json()
    assert "empty" in data["error"]["message"].lower()


def test_create_resume_manually(client):
    """Test POST /api/v1/resumes creates manual resume text entry."""
    payload = {
        "user_id": "usr_demo123456",
        "title": "Backend Engineering Resume",
        "raw_text": "Experienced Python developer with FastAPI and PostgreSQL background.",
    }
    response = client.post("/api/v1/resumes", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Backend Engineering Resume"
    assert data["resume_id"].startswith("res_")
