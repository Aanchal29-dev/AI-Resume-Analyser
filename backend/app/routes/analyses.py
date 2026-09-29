"""Resume Analyses API Router.

Provides endpoints for triggering ATS analyses, fetching score reports,
and reviewing keyword gap metrics.
"""

from typing import List, Optional
from fastapi import APIRouter, Query, status
from app.schemas.analysis import AnalysisCreateRequest, AnalysisResponse
from app.services.analysis_service import analysis_service

router = APIRouter(tags=["Resume Analyses & ATS Scoring"])


@router.post(
    "/analyses",
    response_model=AnalysisResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Analyze Resume",
    description="Evaluates an uploaded resume against a target job or role to calculate ATS score, keyword match, and bullet improvements.",
)
async def create_analysis(payload: AnalysisCreateRequest) -> AnalysisResponse:
    return await analysis_service.create_analysis(payload)


@router.get(
    "/analyses",
    response_model=List[AnalysisResponse],
    status_code=status.HTTP_200_OK,
    summary="List All Analyses",
    description="Retrieves list of analyses, optionally filtered by user_id or resume_id.",
)
async def get_all_analyses(
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    resume_id: Optional[str] = Query(None, description="Filter by resume ID"),
) -> List[AnalysisResponse]:
    return await analysis_service.get_all_analyses(user_id=user_id, resume_id=resume_id)


@router.get(
    "/analyses/{analysis_id}",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Analysis Report By ID",
    description="Retrieves a complete analysis report by its unique ID.",
)
async def get_analysis_by_id(analysis_id: str) -> AnalysisResponse:
    return await analysis_service.get_analysis_by_id(analysis_id)


@router.get(
    "/resumes/{resume_id}/analyses",
    response_model=List[AnalysisResponse],
    status_code=status.HTTP_200_OK,
    summary="Get All Analyses for a Specific Resume",
    description="Retrieves historical analysis runs for a given resume.",
)
async def get_analyses_for_resume(resume_id: str) -> List[AnalysisResponse]:
    return await analysis_service.get_analyses_for_resume(resume_id)
