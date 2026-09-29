"""Schemas package export for AI Resume Platform."""

from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse,
    UserProfileResponse,
    UserProfileSchema,
)
from app.schemas.resume import (
    ResumeCreate,
    ResumeUpdate,
    ResumeResponse,
    ResumeListResponse,
    ResumeUploadResponse,
    ParsedResumeDataSchema,
)
from app.schemas.job import (
    JobCreate,
    JobUpdate,
    JobResponse,
    JobListResponse,
)
from app.schemas.analysis import (
    AnalysisCreateRequest,
    AnalysisResponse,
    AnalysisListResponse,
    BulletImprovementSchema,
    OriginalityAuditSchema,
)
from app.schemas.recommendation import (
    RecommendationCreateRequest,
    RecommendationResponse,
    RecommendationListResponse,
    RoleRecommendationSchema,
    SkillRecommendationSchema,
    CourseRecommendationSchema,
)
from app.schemas.career import (
    CareerQuestionnaireRequest,
    CareerDiscoveryResponse,
    CareerRoleDetailResponse,
)

__all__ = [
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserProfileResponse",
    "UserProfileSchema",
    "ResumeCreate",
    "ResumeUpdate",
    "ResumeResponse",
    "ResumeListResponse",
    "ResumeUploadResponse",
    "ParsedResumeDataSchema",
    "JobCreate",
    "JobUpdate",
    "JobResponse",
    "JobListResponse",
    "AnalysisCreateRequest",
    "AnalysisResponse",
    "AnalysisListResponse",
    "BulletImprovementSchema",
    "OriginalityAuditSchema",
    "RecommendationCreateRequest",
    "RecommendationResponse",
    "RecommendationListResponse",
    "RoleRecommendationSchema",
    "SkillRecommendationSchema",
    "CourseRecommendationSchema",
    "CareerQuestionnaireRequest",
    "CareerDiscoveryResponse",
    "CareerRoleDetailResponse",
]
