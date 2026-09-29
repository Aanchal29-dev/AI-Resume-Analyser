"""Services package export for AI Resume Platform."""

from app.services.user_service import UserService, user_service
from app.services.resume_service import ResumeService, resume_service
from app.services.job_service import JobService, job_service
from app.services.analysis_service import AnalysisService, analysis_service
from app.services.recommendation_service import RecommendationService, recommendation_service
from app.services.career_service import CareerService, career_service

__all__ = [
    "UserService",
    "user_service",
    "ResumeService",
    "resume_service",
    "JobService",
    "job_service",
    "AnalysisService",
    "analysis_service",
    "RecommendationService",
    "recommendation_service",
    "CareerService",
    "career_service",
]
