"""Resume Analysis Service layer.

Coordinates ATS analysis, keyword matching, and section feedback.
NOTE: In Phase 1, this service provides structured foundation responses
with `is_mock=True` to facilitate frontend and API contract testing.
Real NLP/ML scoring and Gemini API integration will replace this in Phase 4.
"""

from typing import Dict, List, Optional
from app.core.exceptions import NotFoundError
from app.schemas.analysis import (
    AnalysisCreateRequest,
    AnalysisResponse,
    BulletImprovementSchema,
    CertificateDetailsSchema,
    OriginalityAuditSchema,
)
from app.services.job_service import job_service
from app.services.resume_service import resume_service
from app.utils.helpers import generate_uuid, get_utc_now


class AnalysisService:
    """Service orchestrating ATS analysis and resume evaluation."""

    def __init__(self):
        self._analyses: Dict[str, dict] = {}
        self._seed_default_analysis()

    def _seed_default_analysis(self):
        """Seeds a sample analysis result for immediate Swagger & API inspection."""
        default_id = "anl_demo123456"
        now = get_utc_now()
        self._analyses[default_id] = {
            "analysis_id": default_id,
            "resume_id": "res_demo123456",
            "user_id": "usr_demo123456",
            "job_id": "job_fs_02",
            "target_role": "Full Stack Engineer",
            "overall_score": 84.0,
            "ats_score": 88.0,
            "match_percentage": 82.0,
            "completeness_score": 90.0,
            "matched_keywords": ["Python", "FastAPI", "React", "SQL", "Git", "REST APIs", "REST"],
            "missing_keywords": ["Docker", "Redis", "CI/CD", "Unit Testing", "AWS"],
            "detected_skills": ["Python", "FastAPI", "JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs"],
            "weak_sections": [
                "Certifications: Consider adding cloud or backend accreditations (AWS/GCP).",
                "Work Experience: Quantify impact with additional numerical business metrics.",
            ],
            "suggestions": [
                "Incorporate containerization experience (Docker) in the project tech stack.",
                "Include unit testing / pytest methodologies in the skills section.",
                "Utilize the Google X-Y-Z formula in bullet points: 'Accomplished [X] as measured by [Y] by doing [Z]'.",
            ],
            "key_strengths": [
                "Strong full-stack foundation spanning modern Python/FastAPI backend and React frontend.",
                "Clear project descriptions highlighting relevant web architecture tools.",
                "Standard single-column format with high ATS parseability.",
            ],
            "critical_gaps": [
                "No mention of CI/CD pipelines (GitHub Actions, Jenkins).",
                "Missing asynchronous caching tools like Redis or Celery.",
            ],
            "bullet_improvements": [
                {
                    "original": "Built API endpoints for customer analytics dashboard.",
                    "improved": "Engineered 12+ asynchronous REST API endpoints using FastAPI and Pydantic, reducing backend latency by 35%.",
                    "action_verb": "Engineered",
                    "metrics_added": "12+ endpoints, 35% latency reduction",
                    "rationale": "Replaced generic 'Built' with strong technical action verb and quantified outcome.",
                }
            ],
            "is_certificate": False,
            "certificate_details": None,
            "originality_audit": None,
            "is_mock": True,
            "created_at": now,
        }

    async def get_all_analyses(
        self, user_id: Optional[str] = None, resume_id: Optional[str] = None
    ) -> List[AnalysisResponse]:
        """Retrieves all analyses with optional filtering."""
        results = list(self._analyses.values())
        if user_id:
            results = [a for a in results if a.get("user_id") == user_id]
        if resume_id:
            results = [a for a in results if a.get("resume_id") == resume_id]
        return [AnalysisResponse(**a) for a in results]

    async def get_analysis_by_id(self, analysis_id: str) -> AnalysisResponse:
        """Retrieves a single analysis by its ID."""
        analysis = self._analyses.get(analysis_id)
        if not analysis:
            raise NotFoundError(resource="Resume Analysis", identifier=analysis_id)
        return AnalysisResponse(**analysis)

    async def get_analyses_for_resume(self, resume_id: str) -> List[AnalysisResponse]:
        """Retrieves all analyses created for a specific resume."""
        # Verify resume exists
        await resume_service.get_resume_by_id(resume_id)
        return await self.get_all_analyses(resume_id=resume_id)

    async def create_analysis(self, payload: AnalysisCreateRequest) -> AnalysisResponse:
        """Triggers an ATS analysis for a resume against a target role or job."""
        # Verify resume exists
        resume = await resume_service.get_resume_by_id(payload.resume_id)

        target_title = payload.target_role_title
        if payload.job_id:
            job = await job_service.get_job_by_id(payload.job_id)
            target_title = job.title

        analysis_id = generate_uuid(prefix="anl")
        now = get_utc_now()

        # Foundation placeholder response structure
        # (Phase 4 will connect actual NLP model and Gemini API)
        analysis_record = {
            "analysis_id": analysis_id,
            "resume_id": payload.resume_id,
            "user_id": payload.user_id or resume.user_id,
            "job_id": payload.job_id,
            "target_role": target_title or "Target Role",
            "overall_score": 80.0,
            "ats_score": 85.0,
            "match_percentage": 78.0,
            "completeness_score": 88.0,
            "matched_keywords": ["FastAPI", "React", "Python", "SQL", "Git"],
            "missing_keywords": ["Docker", "Kubernetes", "Redis", "CI/CD"],
            "detected_skills": ["Python", "FastAPI", "JavaScript", "React", "SQL", "Git"],
            "weak_sections": [
                "Quantified Metrics: Add specific business numbers or percentage gains to experience bullets.",
            ],
            "suggestions": [
                "Tailor resume summary to highlight relevant keywords for the target role.",
                "Add projects showcasing cloud deployment or microservices.",
            ],
            "key_strengths": [
                "Clear education and clean typography.",
                "Direct match with primary core stack technologies.",
            ],
            "critical_gaps": [
                "Missing DevOps / Containerization tools from technical skills list.",
            ],
            "bullet_improvements": [
                {
                    "original": "Worked on web app frontend and backend.",
                    "improved": "Architected full-stack features utilizing FastAPI and React, boosting user engagement by 25%.",
                    "action_verb": "Architected",
                    "metrics_added": "25% engagement boost",
                    "rationale": "High-impact phrasing with clear measurable result.",
                }
            ],
            "is_certificate": False,
            "certificate_details": None,
            "originality_audit": None,
            "is_mock": True,
            "created_at": now,
        }

        self._analyses[analysis_id] = analysis_record
        return AnalysisResponse(**analysis_record)


# Singleton instance of AnalysisService
analysis_service = AnalysisService()
