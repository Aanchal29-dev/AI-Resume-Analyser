"""Users API Router.

Provides endpoints for user registration, profile retrieval, updates,
and account management.
"""

from typing import List
from fastapi import APIRouter, status
from app.schemas.user import UserCreate, UserProfileResponse, UserResponse, UserUpdate
from app.services.user_service import user_service

router = APIRouter(prefix="/users", tags=["Users & Profiles"])


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register / Create User",
    description="Registers a new candidate or user account.",
)
async def create_user(payload: UserCreate) -> UserResponse:
    return await user_service.create_user(payload)


@router.get(
    "",
    response_model=List[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="List All Users",
    description="Retrieves a list of all registered users.",
)
async def get_all_users() -> List[UserResponse]:
    return await user_service.get_all_users()


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User By ID",
    description="Retrieves user account details by their user_id.",
)
async def get_user_by_id(user_id: str) -> UserResponse:
    return await user_service.get_user_by_id(user_id)


@router.get(
    "/{user_id}/profile",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User Profile Summary",
    description="Retrieves full profile summary including resume & analysis counts.",
)
async def get_user_profile(user_id: str) -> UserProfileResponse:
    return await user_service.get_user_profile(user_id)


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update User Profile",
    description="Updates personal details, target role, or headline.",
)
async def update_user(user_id: str, payload: UserUpdate) -> UserResponse:
    return await user_service.update_user(user_id, payload)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete User Account",
    description="Deletes a user account by user_id.",
)
async def delete_user(user_id: str) -> dict:
    await user_service.delete_user(user_id)
    return {"success": True, "message": f"User '{user_id}' deleted successfully."}
