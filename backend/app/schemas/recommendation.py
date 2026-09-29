"""Recommendation Pydantic schemas.

Defines schemas for role recommendations, skill paths, courses,
and learning resource suggestions.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class RoleRecommendationSchema(BaseModel):
    """Recommended job role schema."""
    role_id: str
    title: str
    category: str
    match_percentage: float = Field(..., ge=0, le=100)
    salary_range: Optional[str] = None
    demand_level: Optional[str] = "High"
    why_fit: str = Field(..., description="Explanation why this role suits the candidate")
    skills_to_learn: List[str] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)


class SkillRecommendationSchema(BaseModel):
    """Recommended skill schema."""
    skill_name: str
    category: str = "Technical"
    importance: str = "High"  # High, Medium, Low
    reason: str
    estimated_time_to_learn: Optional[str] = None


class CourseRecommendationSchema(BaseModel):
    """Recommended course / learning resource schema."""
    course_id: str
    title: str
    platform: str  # Coursera, Udemy, edX, etc.
    instructor: Optional[str] = None
    url: Optional[str] = None
    duration: Optional[str] = None
    difficulty: Optional[str] = "Beginner to Intermediate"
    rating: Optional[float] = 4.8
    skills_covered: List[str] = Field(default_factory=list)


class RecommendationCreateRequest(BaseModel):
    """Request to generate recommendations for a user or resume."""
    user_id: Optional[str] = None
    resume_id: Optional[str] = None
    target_role: Optional[str] = None
    skills: List[str] = Field(default_factory=list)


class RecommendationResponse(BaseModel):
    """Complete recommendation response."""
    recommendation_id: str
    user_id: Optional[str] = None
    resume_id: Optional[str] = None
    target_role: Optional[str] = None
    recommended_roles: List[RoleRecommendationSchema] = Field(default_factory=list)
    recommended_skills: List[SkillRecommendationSchema] = Field(default_factory=list)
    recommended_courses: List[CourseRecommendationSchema] = Field(default_factory=list)
    created_at: datetime
    is_mock: bool = Field(True, description="Foundation placeholder data pending Phase 4 AI service integration")

    model_config = {"from_attributes": True}


class RecommendationListResponse(BaseModel):
    """Response schema for listing recommendations."""
    total: int
    items: List[RecommendationResponse]
