"""Career Discovery API Router.

Provides endpoints for the career discovery questionnaire workflow and
career path exploration.
"""

from typing import List, Optional
from fastapi import APIRouter, Query, status
from app.schemas.career import (
    CareerDiscoveryResponse,
    CareerQuestionnaireRequest,
    CareerRoleDetailResponse,
)
from app.services.career_service import career_service

router = APIRouter(prefix="/career", tags=["Career Discovery"])


@router.post(
    "/questionnaire",
    response_model=CareerDiscoveryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Career Discovery Questionnaire",
    description="Processes user preferences, interests, and existing skills to suggest matching career paths.",
)
async def submit_career_questionnaire(
    payload: CareerQuestionnaireRequest,
) -> CareerDiscoveryResponse:
    return await career_service.process_questionnaire(payload)


@router.get(
    "/recommendations",
    response_model=List[CareerDiscoveryResponse],
    status_code=status.HTTP_200_OK,
    summary="List Career Discovery Results",
    description="Retrieves previous career questionnaire discovery results, optionally filtered by user_id.",
)
async def get_career_discoveries(
    user_id: Optional[str] = Query(None, description="Filter by user ID")
) -> List[CareerDiscoveryResponse]:
    return await career_service.get_all_discoveries(user_id=user_id)


@router.get(
    "/roles",
    response_model=List[CareerRoleDetailResponse],
    status_code=status.HTTP_200_OK,
    summary="List Career Roles Catalog",
    description="Retrieves detailed catalog of supported career pathways and demand outlooks.",
)
async def get_all_roles() -> List[CareerRoleDetailResponse]:
    return await career_service.get_all_roles()


@router.get(
    "/roles/{role_id}",
    response_model=CareerRoleDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Career Role Details",
    description="Retrieves comprehensive overview, required skills, and course recommendations for a specific role.",
)
async def get_role_by_id(role_id: str) -> CareerRoleDetailResponse:
    return await career_service.get_role_by_id(role_id)
