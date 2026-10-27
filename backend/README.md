## MongoDB integration

See [database setup](app/database/README.md). MongoDB replaces the original MySQL plan; older roadmap notes below describe the original scaffold.

# AI Resume Analysis & Career Assistance Platform - Backend Foundation

Welcome to the FastAPI backend foundation for the **AI Resume Analysis & Career Assistance Platform**.

This backend is designed with a clean, modular, and production-style architecture tailored for student and academic presentation. It separates routing, schema validation, business logic services, and persistence layers so that MySQL database integration, Google OAuth authentication, and AI/ML services can be plugged in step-by-step in future development phases.

---

## 🚀 Technologies Used

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous, high-performance Python web framework)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/) (Lightning-fast ASGI server)
- **Data Validation & Settings**: [Pydantic v2](https://docs.pydantic.dev/) & [Pydantic-Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- **File Upload Handling**: `python-multipart`
- **Testing**: `pytest` & `httpx` (FastAPI TestClient)
- **Environment Management**: `python-dotenv`

---

## 📁 Backend Folder Structure

```
backend/
│
├── app/
│   ├── main.py                     # FastAPI application setup, CORS, and router registration
│   │
│   ├── core/                       # Core application configurations & error handling
│   │   ├── config.py               # Pydantic environment configuration (Settings)
│   │   └── exceptions.py           # Custom exception classes and global error handlers
│   │
│   ├── routes/                     # API Route Handlers (Separation of HTTP endpoints)
│   │   ├── __init__.py             # Central api_v1_router aggregator
│   │   ├── health.py               # /api/health and /health diagnostic routes
│   │   ├── users.py                # /api/v1/users (CRUD, profile summary)
│   │   ├── resumes.py              # /api/v1/resumes (file upload validation, CRUD)
│   │   ├── jobs.py                 # /api/v1/jobs (target job descriptions & skills)
│   │   ├── analyses.py             # /api/v1/analyses (ATS scoring & report runs)
│   │   ├── recommendations.py      # /api/v1/recommendations (roles, skills, courses)
│   │   └── career.py               # /api/v1/career (discovery questionnaire & role catalog)
│   │
│   ├── schemas/                    # Pydantic Schemas (Request/Response validation contracts)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── resume.py
│   │   ├── job.py
│   │   ├── analysis.py
│   │   ├── recommendation.py
│   │   └── career.py
│   │
│   ├── services/                   # Business Logic Layer (Decoupled from route definitions)
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   ├── resume_service.py
│   │   ├── job_service.py
│   │   ├── analysis_service.py
│   │   ├── recommendation_service.py
│   │   └── career_service.py
│   │
│   ├── utils/                      # Helper utilities
│   │   └── helpers.py              # UUID generation, timestamp helpers, extension validation
│   │
│   ├── models/                     # Database Models (Reserved for Phase 2)
│   │   └── README.md
│   │
│   ├── database/                   # Database Connection & Repositories (Reserved for Phase 2)
│   │   └── README.md
│   │
│   └── auth/                       # Google OAuth & JWT Protection (Reserved for Phase 3)
│       └── README.md
│
├── tests/                          # Automated Pytest Suite
│   ├── conftest.py
│   ├── test_health.py
│   ├── test_users.py
│   ├── test_resumes.py
│   ├── test_jobs.py
│   ├── test_analyses.py
│   ├── test_recommendations.py
│   └── test_career.py
│
├── .env.example                    # Environment variable template
├── .gitignore                      # Python & virtual environment ignore rules
├── requirements.txt                # Lean dependencies list
└── README.md                       # Backend documentation & setup guide
```

---

## 🛠️ Step-by-Step Setup Guide (Windows)

Follow these steps in your PowerShell / Command Prompt terminal inside the `backend` folder:

### 1. Open Terminal and Navigate to Backend Folder
```powershell
cd "c:\Users\Aanchal Sharma\OneDrive\Desktop\AI Resume Analyser\backend"
```

### 2. Create Python Virtual Environment
```powershell
python -m venv venv
```

### 3. Activate Virtual Environment
- **On Windows (PowerShell)**:
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- **On Windows (Command Prompt)**:
  ```cmd
  venv\Scripts\activate.bat
  ```

*(If PowerShell blocks script execution, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` once).*

### 4. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 5. Configure Environment Variables (Optional for Foundation)
Copy the template file to create a local `.env`:
```powershell
copy .env.example .env
```

### 6. Run the FastAPI Development Server
```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The server will start at: **`http://127.0.0.1:8000`**

---

## 📖 Interactive API Documentation (Swagger & ReDoc)

FastAPI automatically generates interactive Swagger UI and ReDoc documentation:

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc UI**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Raw OpenAPI JSON**: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

You can test every endpoint directly from your browser in Swagger UI without needing Postman.

---

## 🔌 Available API Endpoints Summary

### System & Diagnostics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root status message & docs info |
| `GET` | `/api/health` | Health check & uptime status |
| `GET` | `/health` | Standalone health diagnostic |

### Users & Profiles (`/api/v1/users`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users` | Register a new user account |
| `GET` | `/api/v1/users` | List all users |
| `GET` | `/api/v1/users/{user_id}` | Retrieve user by ID |
| `GET` | `/api/v1/users/{user_id}/profile` | Retrieve user profile summary and counts |
| `PUT` | `/api/v1/users/{user_id}` | Update user information |
| `DELETE` | `/api/v1/users/{user_id}` | Delete user account |

### Resumes (`/api/v1/resumes`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/resumes/upload` | Upload & validate resume file (`.pdf`, `.docx`, `.txt`, `.png`, `.jpg`) |
| `POST` | `/api/v1/resumes` | Create structured resume record |
| `GET` | `/api/v1/resumes` | List resumes (supports `?user_id=`) |
| `GET` | `/api/v1/resumes/{resume_id}` | Get detailed resume with parsed sections |
| `PUT` | `/api/v1/resumes/{resume_id}` | Update resume details |
| `DELETE` | `/api/v1/resumes/{resume_id}` | Delete resume record |

### Job Descriptions (`/api/v1/jobs`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/jobs` | Create new target job description |
| `GET` | `/api/v1/jobs` | List jobs (supports `?category=`) |
| `GET` | `/api/v1/jobs/{job_id}` | Get job details & required skills |
| `PUT` | `/api/v1/jobs/{job_id}` | Update job description |
| `DELETE` | `/api/v1/jobs/{job_id}` | Delete job description |

### Resume Analyses & ATS Scoring (`/api/v1/analyses`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/analyses` | Trigger ATS analysis for resume against target job |
| `GET` | `/api/v1/analyses` | List analyses (supports `?user_id=`, `?resume_id=`) |
| `GET` | `/api/v1/analyses/{analysis_id}` | Get detailed ATS report with keyword gaps and suggestions |
| `GET` | `/api/v1/resumes/{resume_id}/analyses` | Get all analysis runs for a specific resume |

### Recommendations (`/api/v1/recommendations`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/recommendations` | Generate role, skill, and course recommendations |
| `GET` | `/api/v1/recommendations` | List recommendations (supports `?user_id=`) |
| `GET` | `/api/v1/recommendations/{recommendation_id}` | Get detailed recommendation report |

### Career Discovery (`/api/v1/career`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/career/questionnaire` | Submit career discovery questionnaire |
| `GET` | `/api/v1/career/recommendations` | List previous questionnaire discovery runs |
| `GET` | `/api/v1/career/roles` | List catalog of supported career pathways |
| `GET` | `/api/v1/career/roles/{role_id}` | Get deep profile, salary, and course roadmap for a role |

---

## 🧪 Running Pytest Tests

To run the automated test suite:

```powershell
pytest
```

To run with verbose test output:
```powershell
pytest -v
```

---

## 🔒 Security & Architecture Decisions in Phase 1

1. **No Hardcoded Secrets**: All configuration values and future credentials reside in `app/core/config.py` backed by environment variables with fallback defaults for local development.
2. **Decoupled Service Layer**: Routes do not touch data stores directly; they delegate all processing to classes in `app/services/`.
3. **Decoupled Persistence**: In-memory state is clearly isolated so it can be swapped with MySQL repositories in Phase 2 with zero changes to route contracts.
4. **Structured Error Handling**: Global error handlers intercept exceptions and return consistent JSON responses with HTTP status codes (200, 201, 400, 404, 409, 422, 500) without leaking stack traces.
5. **CORS Configured**: Allows requests from local React development ports (`http://localhost:5173`, `http://localhost:5174`).

---

## 📌 What is Intentionally NOT Implemented Yet (By Design)

To maintain a clean foundation without fake or prematurely complex code:
- **MySQL Connection**: In-memory storage is used for now; MySQL models and migrations will be implemented in Phase 2.
- **Google OAuth 2.0**: Authentication tokens and verification will be plugged into `app/auth/` in Phase 3.
- **Gemini AI / ML Extraction**: Foundation responses are labeled with `"is_mock": true`; real Gemini API integration, resume PDF OCR/parsing, and ML scoring will be added in Phase 4.

---

## 🎯 Next Development Phases Roadmap

1. **Phase 2 — MySQL Database & SQLAlchemy ORM Integration**:
   - Create SQLAlchemy declarative models in `app/models/`.
   - Setup session management and repository pattern in `app/database/`.
   - Configure Alembic migrations.
2. **Phase 3 — Google OAuth 2.0 & JWT Authentication**:
   - Implement token verification with Google's public keys.
   - Implement `get_current_user` FastAPI dependency for protected routes.
3. **Phase 4 — Gemini API & ML/NLP Resume Engine**:
   - Integrate `pdfplumber` / OCR for resume text extraction.
   - Integrate Google Gemini API for semantic ATS scoring and bullet improvements.
   - Connect Frontend React application with Backend APIs.
