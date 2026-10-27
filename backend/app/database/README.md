# MongoDB database setup

MongoDB replaces the original MySQL plan. One MongoClient is reused per backend
process and closed at shutdown. Blocking driver calls run in threads. Driver pool
defaults are retained; monitor Atlas connection counts and request latency before tuning.
Startup pings the database and creates unique identifier indexes and a unique
normalized email index. Unavailable MongoDB or duplicate existing keys stops startup.

## Collections in resume_analyser

- users: user_id, user profiles and unique normalized email.
- resumes: resume_id, metadata, full submitted text and parsed information.
- analyses: analysis_id, scores, suggestions and analysis history.
- jobs: job_id, job descriptions.
- recommendations: recommendation_id, learning recommendations.
- discoveries: discovery_id, career questionnaire results.
- roles: role_id, career catalogue.

Additional collections support features already in the backend and are created
on startup. All belong to the same database. IDs and API contracts are unchanged.
Uploads are saved on disk under UPLOAD_DIRECTORY; MongoDB stores their path.
A deployed server needs persistent disk storage for those files.

## Setup on Windows

1. Atlas: ResumeAnalyser > Connect > Drivers > Python. Copy the connection URI.
2. Use database user resume_backend and its password. Reset it in Database Access
   if unknown. URL-encode special password characters in the URI.
3. Network Access must allow the public outbound IP of the backend computer/server.
4. From the backend directory, run:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
```

5. Edit .env locally: set MONGODB_URI to your private Atlas URI and
MONGODB_DATABASE=resume_analyser. Do not commit passwords or .env.
Set SEED_DEMO_DATA=True for the existing frontend demo user/resume and job/role
catalogue. Seed inserts do not overwrite existing records. False starts empty;
the frontend hardcoded demo IDs must then be replaced with real IDs.
6. Run `python -m uvicorn app.main:app --reload` and open
http://127.0.0.1:8000/docs.
7. Create a user, resume and analysis through POST endpoints. Restart the backend,
GET the same IDs, and verify the documents in Atlas Browse Collections.

## Validation and limits

Run `python -m pytest -q`. Tests use mongomock, not real Atlas credentials.
35 tests pass, including reconnect persistence, duplicate emails, real profile
counts, upload contents and deletion. Live Atlas verification still requires a
private URI and permitted network. Database access must permit index creation.

Existing mock analysis and unfinished authentication are unchanged. Keep the API
local until authentication and ownership checks are implemented. Deletions do not
cascade into analysis history or remove uploaded files; production retention
cleanup is separate work.

## GitHub handoff

Local branch: database-integration. Push to your fork and open a PR into
Aanchal29-dev/AI-Resume-Analyser main. Configure GitHub repository access before pushing this branch.
The ZIP includes a patch for a clean clone: `git apply database-integration.patch`.
