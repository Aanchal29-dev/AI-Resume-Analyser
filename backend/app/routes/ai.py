"""AI Assistance & Gemini API Router.

Provides endpoints for interactive AI Chat coaching, bullet point optimization,
and real-time Gemini AI queries.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, status
from pydantic import BaseModel, Field
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/ai", tags=["AI & Gemini Services"])


class AIChatRequest(BaseModel):
    """Chat message request."""
    message: str = Field(..., min_length=1)
    chat_history: List[Dict[str, str]] = Field(default_factory=list)
    candidate_name: Optional[str] = "Candidate"
    target_role: Optional[str] = "Software Engineer"


class AIChatResponse(BaseModel):
    """Chat message response."""
    response: str
    model: str = "Google Gemini"


class BulletOptimizeRequest(BaseModel):
    """Bullet optimization request."""
    bullet: str = Field(..., min_length=5)
    role_title: Optional[str] = "Software Developer"


class BulletOptimizeResponse(BaseModel):
    """Bullet optimization response."""
    improved_bullet: str
    action_verb: Optional[str] = None
    metrics_added: Optional[str] = None
    rationale: Optional[str] = None


class ResumeTextAnalysisRequest(BaseModel):
    """Direct resume text analysis request."""
    resume_text: str = Field(..., min_length=20)
    target_role: Optional[str] = None
    job_description: Optional[str] = None


@router.post(
    "/chat",
    response_model=AIChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Interactive AI Career Coach Chat",
    description="Generates conversational career mentoring and resume advice powered by Google Gemini.",
)
async def chat_with_gemini(payload: AIChatRequest) -> AIChatResponse:
    reply = await gemini_service.chat_assistant(
        message=payload.message,
        chat_history=payload.chat_history,
        candidate_name=payload.candidate_name or "Candidate",
        target_role=payload.target_role or "Software Engineer",
    )
    return AIChatResponse(response=reply)


@router.post(
    "/optimize-bullet",
    response_model=BulletOptimizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Optimize Resume Bullet Point",
    description="Rewrites weak resume bullets into strong, metric-driven statements using the Google X-Y-Z formula via Gemini.",
)
async def optimize_bullet(payload: BulletOptimizeRequest) -> BulletOptimizeResponse:
    result = await gemini_service.optimize_bullet(
        original_bullet=payload.bullet,
        role_title=payload.role_title or "Software Developer",
    )
    return BulletOptimizeResponse(
        improved_bullet=result.get("improvedBullet", ""),
        action_verb=result.get("actionVerb"),
        metrics_added=result.get("metricsAdded"),
        rationale=result.get("rationale"),
    )


@router.post(
    "/analyze-text",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Direct Gemini Resume Text Analysis",
    description="Performs instant ATS and keyword evaluation on raw resume text using Google Gemini.",
)
async def analyze_resume_text(payload: ResumeTextAnalysisRequest) -> Dict[str, Any]:
    return await gemini_service.analyze_resume(
        resume_text=payload.resume_text,
        target_role=payload.target_role,
        job_description=payload.job_description,
    )
