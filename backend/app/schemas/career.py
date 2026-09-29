"""Career Discovery Pydantic schemas.

Defines schemas for the career discovery questionnaire flow, matching scores,
recommended pathways, and detailed role profiles.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.recommendation import CourseRecommendationSchema


class CareerQuestionnaireRequest(BaseModel):
    """Answers submitted during career discovery questionnaire."""
    user_id: Optional[str] = None
    interests: List[str] = Field(..., min_length=1, description="List of fields/topics user is interested in")
    work_areas: List[str] = Field(default_factory=list, description="e.g. Frontend, Backend, AI, Data, Design")
    technical_preference: str = Field("balanced", description="heavy-coding, balanced, no-code, managerial")
    existing_skills: List[str] = Field(default_factory=list, description="Skills candidate already possesses")
    experience_level: str = Field("beginner", description="beginner, student, intermediate, experienced")
    preferred_industries: List[str] = Field(default_factory=list, description="e.g. Fintech, Healthcare, Edtech")
    learning_style: Optional[str] = Field("hands-on", description="hands-on, visual, academic, project-based")


class CareerRoleDetailResponse(BaseModel):
    """Detailed role overview for career discovery."""
    role_id: str
    title: str
    category: str
    match_percentage: float = Field(..., ge=0, le=100)
    salary_range: str
    growth_outlook: str = "High Growth"
    summary: str
    required_skills: List[str]
    nice_to_have_skills: List[str] = Field(default_factory=list)
    day_in_the_life: Optional[str] = None
    recommended_courses: List[CourseRecommendationSchema] = Field(default_factory=list)
    action_plan: List[str] = Field(default_factory=list)


class CareerDiscoveryResponse(BaseModel):
    """Response returned upon submitting career questionnaire."""
    discovery_id: str
    user_id: Optional[str] = None
    primary_recommendation: CareerRoleDetailResponse
    alternative_roles: List[CareerRoleDetailResponse] = Field(default_factory=list)
    summary_insight: str
    created_at: datetime
    is_mock: bool = Field(True, description="Foundation placeholder data pending Phase 4 ML recommendation engine")
