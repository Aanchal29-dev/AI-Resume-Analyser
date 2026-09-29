"""Recommendations API Router.

Provides endpoints for fetching and generating role, skill, and learning
recommendations.
"""

from typing import List, Optional
from fastapi import APIRouter, Query, status
from app.schemas.recommendation import (
    RecommendationCreateRequest,
    RecommendationResponse,
)
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Recommendations & Learning Paths"])


@router.post(
    "",
    response_model=RecommendationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate Recommendations",
    description="Generates tailored role suggestions, missing skill roadmaps, and course recommendations.",
)
async def create_recommendation(payload: RecommendationCreateRequest) -> RecommendationResponse:
    return await recommendation_service.generate_recommendations(payload)


@router.get(
    "",
    response_model=List[RecommendationResponse],
    status_code=status.HTTP_200_OK,
    summary="List Recommendations",
    description="Retrieves recommendation batches, optionally filtered by user_id.",
)
async def get_all_recommendations(
    user_id: Optional[str] = Query(None, description="Filter by user ID")
) -> List[RecommendationResponse]:
    return await recommendation_service.get_all_recommendations(user_id=user_id)


@router.get(
    "/{recommendation_id}",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Recommendation By ID",
    description="Retrieves a specific recommendation report with roles, skills, and courses.",
)
async def get_recommendation_by_id(recommendation_id: str) -> RecommendationResponse:
    return await recommendation_service.get_recommendation_by_id(recommendation_id)
