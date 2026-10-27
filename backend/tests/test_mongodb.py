"""Isolated persistence regression tests. No Atlas credentials needed."""
import mongomock
from fastapi.testclient import TestClient
from app.database import repository
from app.main import app
from app.core.config import settings


def test_database_persistence(monkeypatch, tmp_path):
    db_client = mongomock.MongoClient()
    monkeypatch.setattr(repository, 'MongoClient', lambda *a, **k: db_client)
    monkeypatch.setattr(settings, 'MONGODB_URI', 'mongodb://test-only')
    monkeypatch.setattr(settings, 'MONGODB_DATABASE', 'isolated_test')
    monkeypatch.setattr(settings, 'SEED_DEMO_DATA', True)
    monkeypatch.setattr(settings, 'UPLOAD_DIRECTORY', str(tmp_path))
    with TestClient(app) as client:
        response = client.post('/api/v1/users', json={'name':'Persistence Test','email':'persist@example.com'})
        assert response.status_code == 201, response.text
        user_id = response.json()['user_id']
        response = client.post('/api/v1/resumes', json={'user_id':user_id,'title':'Persistent resume','raw_text':'Python skills'})
        assert response.status_code == 201, response.text
        resume_id = response.json()['resume_id']
        response = client.post('/api/v1/analyses', json={'resume_id':resume_id,'user_id':user_id})
        assert response.status_code == 201, response.text
        analysis_id = response.json()['analysis_id']
        assert client.post('/api/v1/users', json={'name':'Duplicate','email':'PERSIST@example.com'}).status_code == 409
        upload = client.post('/api/v1/resumes/upload', files={'file':('resume.txt',b'Actual file contents','text/plain')})
        assert upload.status_code in (200,201), upload.text
        assert any(p.read_bytes() == b'Actual file contents' for p in tmp_path.iterdir())
    with TestClient(app) as client:
        assert client.get(f'/api/v1/users/{user_id}').status_code == 200
        assert client.get(f'/api/v1/resumes/{resume_id}').status_code == 200
        assert client.get(f'/api/v1/analyses/{analysis_id}').status_code == 200
        profile = client.get(f'/api/v1/users/{user_id}/profile').json()
        assert profile['resumes_count'] == 1
        assert profile['analyses_count'] == 1
        assert client.delete(f'/api/v1/resumes/{resume_id}').status_code == 200
        assert client.get(f'/api/v1/resumes/{resume_id}').status_code == 404
