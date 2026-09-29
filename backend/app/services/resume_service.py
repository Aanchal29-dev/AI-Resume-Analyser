"""Resume Service layer.

Handles file validation, upload processing, resume metadata management,
and structured resume retrieval.
"""

from typing import Dict, List, Optional
from fastapi import UploadFile
from app.core.config import settings
from app.core.exceptions import BadRequestError, NotFoundError
from app.schemas.resume import (
    ContactInfoSchema,
    EducationSchema,
    ExperienceSchema,
    ParsedResumeDataSchema,
    ProjectSchema,
    ResumeCreate,
    ResumeResponse,
    ResumeUpdate,
    ResumeUploadResponse,
    SkillCategorySchema,
)
from app.utils.helpers import (
    generate_uuid,
    get_utc_now,
    sanitize_filename,
    validate_file_extension,
)


class ResumeService:
    """Service handling Resume lifecycle, upload validation, and metadata."""

    def __init__(self):
        # In-memory storage for Phase 1 backend foundation
        self._resumes: Dict[str, dict] = {}
        self._seed_default_resume()

    def _seed_default_resume(self):
        """Seeds a sample parsed resume for testing."""
        default_id = "res_demo123456"
        now = get_utc_now()
        self._resumes[default_id] = {
            "resume_id": default_id,
            "user_id": "usr_demo123456",
            "title": "Software Engineering Resume - 2026",
            "file_name": "alex_morgan_resume.pdf",
            "file_type": "application/pdf",
            "file_size_bytes": 142580,
            "storage_path": "uploads/resumes/res_demo123456.pdf",
            "version": 1,
            "raw_text_preview": "Alex Morgan | Full Stack Developer | React, Python, FastAPI, Node.js, PostgreSQL",
            "is_parsed": True,
            "parsed_data": {
                "contact": {
                    "full_name": "Alex Morgan",
                    "email": "alex.morgan@example.com",
                    "phone": "+1 (555) 019-2834",
                    "location": "San Francisco, CA",
                    "linkedin": "https://linkedin.com/in/alex-morgan-dev",
                    "github": "https://github.com/alex-morgan",
                    "portfolio": "https://alexmorgan.dev",
                },
                "summary": "Results-driven Software Engineer with strong foundation in full-stack web development and RESTful APIs.",
                "education": [
                    {
                        "institution": "University of California, Berkeley",
                        "degree": "B.S. in Computer Science",
                        "location": "Berkeley, CA",
                        "graduation_year": "2025",
                        "gpa": "3.85",
                        "coursework": "Data Structures, Algorithms, Database Systems, Web Development",
                    }
                ],
                "experience": [
                    {
                        "id": "exp-1",
                        "title": "Software Engineering Intern",
                        "company": "TechCorp Innovations",
                        "location": "San Francisco, CA",
                        "period": "Jun 2024 - Sep 2024",
                        "description": "Developed backend microservices and optimized frontend dashboards.",
                        "improved_bullet": "Engineered asynchronous REST APIs using FastAPI and Redis caching, slashing p99 latency by 38%.",
                        "bullets": [
                            "Built high-performance API endpoints for customer analytics dashboard.",
                            "Collaborated with senior engineers on database schema migration.",
                        ],
                    }
                ],
                "projects": [
                    {
                        "id": "proj-1",
                        "name": "AI Resume & Career Navigator",
                        "tech": "FastAPI, React, Vite, Pydantic, TailwindCSS",
                        "period": "2025 - 2026",
                        "description": "Full-stack career assistance platform for ATS optimization and personalized role discovery.",
                        "improved_bullet": "Architected modular FastAPI backend handling file uploads, ATS scoring heuristics, and career matching.",
                        "bullets": [
                            "Implemented dynamic ATS scoring and missing keyword detection.",
                            "Created responsive React UI with dark mode support.",
                        ],
                    }
                ],
                "skills": {
                    "technical": ["Python", "FastAPI", "JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs"],
                    "soft": ["Problem Solving", "Team Collaboration", "Communication", "Agile Methodologies"],
                    "tools": ["Docker", "Postman", "VS Code", "Vite", "Linux"],
                },
                "certifications": [
                    {
                        "name": "Meta Front-End Developer Certificate",
                        "issuer": "Coursera / Meta",
                        "year": "2024",
                        "credential_id": "META-FE-99824",
                    }
                ],
            },
            "uploaded_at": now,
            "updated_at": now,
        }

    async def get_all_resumes(self, user_id: Optional[str] = None) -> List[ResumeResponse]:
        """Retrieves all resumes, optionally filtered by user_id."""
        if user_id:
            return [
                ResumeResponse(**r)
                for r in self._resumes.values()
                if r.get("user_id") == user_id
            ]
        return [ResumeResponse(**r) for r in self._resumes.values()]

    async def get_resume_by_id(self, resume_id: str) -> ResumeResponse:
        """Retrieves a single resume by resume_id."""
        resume = self._resumes.get(resume_id)
        if not resume:
            raise NotFoundError(resource="Resume", identifier=resume_id)
        return ResumeResponse(**resume)

    async def validate_and_process_upload(
        self, file: UploadFile, user_id: Optional[str] = "usr_demo123456"
    ) -> ResumeUploadResponse:
        """Validates incoming resume file and creates an initial resume metadata entry."""
        if not file or not file.filename:
            raise BadRequestError(message="No file was uploaded or filename is missing.")

        clean_filename = sanitize_filename(file.filename)
        is_valid_ext, ext = validate_file_extension(
            clean_filename, settings.ALLOWED_RESUME_EXTENSIONS
        )

        if not is_valid_ext:
            allowed = ", ".join(settings.ALLOWED_RESUME_EXTENSIONS)
            raise BadRequestError(
                message=f"Unsupported file format '{ext}'. Allowed formats: {allowed}."
            )

        # Read file contents to inspect size
        contents = await file.read()
        file_size = len(contents)

        if file_size == 0:
            raise BadRequestError(message="The uploaded file is empty.")

        if file_size > settings.MAX_FILE_SIZE_BYTES:
            max_mb = settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)
            raise BadRequestError(
                message=f"File exceeds maximum allowed size of {max_mb}MB."
            )

        resume_id = generate_uuid(prefix="res")
        now = get_utc_now()

        # Phase 1: Store metadata in memory (text extraction will be connected in Phase 4)
        resume_record = {
            "resume_id": resume_id,
            "user_id": user_id or "usr_demo123456",
            "title": clean_filename,
            "file_name": clean_filename,
            "file_type": file.content_type or ext,
            "file_size_bytes": file_size,
            "storage_path": f"uploads/resumes/{resume_id}_{clean_filename}",
            "version": 1,
            "raw_text_preview": f"Uploaded file: {clean_filename} ({file_size} bytes)",
            "is_parsed": False,
            "parsed_data": None,
            "uploaded_at": now,
            "updated_at": now,
        }
        self._resumes[resume_id] = resume_record

        return ResumeUploadResponse(
            resume_id=resume_id,
            file_name=clean_filename,
            file_type=file.content_type or ext,
            file_size_bytes=file_size,
            message="Resume uploaded successfully and queued for analysis.",
            uploaded_at=now,
        )

    async def create_resume(self, payload: ResumeCreate) -> ResumeResponse:
        """Manually creates a resume record."""
        resume_id = generate_uuid(prefix="res")
        now = get_utc_now()
        resume_record = {
            "resume_id": resume_id,
            "user_id": payload.user_id,
            "title": payload.title,
            "file_name": payload.file_name or f"{payload.title}.pdf",
            "file_type": payload.file_type or "application/pdf",
            "file_size_bytes": len(payload.raw_text.encode("utf-8")) if payload.raw_text else 0,
            "storage_path": None,
            "version": 1,
            "raw_text_preview": (payload.raw_text[:200] + "...") if payload.raw_text and len(payload.raw_text) > 200 else payload.raw_text,
            "is_parsed": payload.parsed_data is not None,
            "parsed_data": payload.parsed_data.model_dump() if payload.parsed_data else None,
            "uploaded_at": now,
            "updated_at": now,
        }
        self._resumes[resume_id] = resume_record
        return ResumeResponse(**resume_record)

    async def update_resume(self, resume_id: str, payload: ResumeUpdate) -> ResumeResponse:
        """Updates resume title, text, or parsed information."""
        resume = self._resumes.get(resume_id)
        if not resume:
            raise NotFoundError(resource="Resume", identifier=resume_id)

        if payload.title is not None:
            resume["title"] = payload.title
        if payload.raw_text is not None:
            resume["raw_text_preview"] = payload.raw_text[:200]
        if payload.parsed_data is not None:
            resume["parsed_data"] = payload.parsed_data.model_dump()
            resume["is_parsed"] = True

        resume["updated_at"] = get_utc_now()
        self._resumes[resume_id] = resume
        return ResumeResponse(**resume)

    async def delete_resume(self, resume_id: str) -> None:
        """Deletes a resume record."""
        if resume_id not in self._resumes:
            raise NotFoundError(resource="Resume", identifier=resume_id)
        del self._resumes[resume_id]


# Singleton instance of ResumeService
resume_service = ResumeService()
