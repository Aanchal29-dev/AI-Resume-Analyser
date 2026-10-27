"""User Service layer.

Handles business logic for user profile management, creation, updates,
and retrieval. In-memory temporary storage is used for Phase 1 foundation
and will be replaced by MySQL Repository in Phase 2.
"""

from app.database.repository import Repository
from typing import Dict, List, Optional
from app.core.exceptions import ConflictError, NotFoundError
from app.schemas.user import UserCreate, UserProfileResponse, UserResponse, UserUpdate
from app.utils.helpers import generate_uuid, get_utc_now


class UserService:
    """Service handling User business logic and persistence coordination."""

    def __init__(self):
        self._users = {}
        self._seed_default_user()
        self._users = Repository("users", "user_id", self._users)

    def _seed_default_user(self):
        """Pre-populates a sample user for immediate API and Swagger testing."""
        default_id = "usr_demo123456"
        now = get_utc_now()
        self._users[default_id] = {
            "user_id": default_id,
            "name": "Alex Morgan",
            "email": "alex.morgan@example.com",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            "profile": {
                "headline": "Aspiring Full Stack Engineer & Computer Science Student",
                "bio": "Passionate about building modern web applications, distributed systems, and AI-assisted developer tools.",
                "target_role": "Full Stack Developer",
                "target_industry": "Software & Technology",
                "years_of_experience": 1.5,
                "phone": "+1 (555) 019-2834",
                "location": "San Francisco, CA",
                "linkedin_url": "https://linkedin.com/in/alex-morgan-dev",
                "github_url": "https://github.com/alex-morgan",
                "portfolio_url": "https://alexmorgan.dev",
            },
            "created_at": now,
            "updated_at": now,
        }

    async def get_all_users(self) -> List[UserResponse]:
        """Retrieves all registered users."""
        return [UserResponse(**user_data) for user_data in (await self._users.values())]

    async def get_user_by_id(self, user_id: str) -> UserResponse:
        """Retrieves a single user by their unique user_id."""
        user = await self._users.get(user_id)
        if not user:
            raise NotFoundError(resource="User", identifier=user_id)
        return UserResponse(**user)

    async def get_user_profile(self, user_id: str) -> UserProfileResponse:
        """Retrieves complete profile summary for a given user."""
        user = await self._users.get(user_id)
        if not user:
            raise NotFoundError(resource="User", identifier=user_id)
        return UserProfileResponse(
            user_id=user["user_id"],
            name=user["name"],
            email=user["email"],
            avatar_url=user.get("avatar_url"),
            profile=user.get("profile"),
            resumes_count=await Repository("resumes", "resume_id").count({"user_id": user_id}),
            analyses_count=await Repository("analyses", "analysis_id").count({"user_id": user_id}),
            created_at=user["created_at"],
        )

    async def create_user(self, payload: UserCreate) -> UserResponse:
        """Creates a new user profile."""
        # Check if email is already taken
        for existing in (await self._users.values()):
            if existing["email"].lower() == payload.email.lower():
                raise ConflictError(message=f"A user with email '{payload.email}' already exists.")

        user_id = generate_uuid(prefix="usr")
        now = get_utc_now()
        user_record = {
            "user_id": user_id,
            "name": payload.name,
            "email": payload.email,
            "avatar_url": payload.avatar_url,
            "profile": payload.profile.model_dump() if payload.profile else None,
            "created_at": now,
            "updated_at": now,
        }
        await self._users.put(user_id, user_record)
        return UserResponse(**user_record)

    async def update_user(self, user_id: str, payload: UserUpdate) -> UserResponse:
        """Updates an existing user record."""
        user = await self._users.get(user_id)
        if not user:
            raise NotFoundError(resource="User", identifier=user_id)

        # If email changed, check conflict
        if payload.email and payload.email.lower() != user["email"].lower():
            for other_id, existing in (await self._users.items()):
                if other_id != user_id and existing["email"].lower() == payload.email.lower():
                    raise ConflictError(message=f"Email '{payload.email}' is already in use by another account.")
            user["email"] = payload.email

        if payload.name is not None:
            user["name"] = payload.name
        if payload.avatar_url is not None:
            user["avatar_url"] = payload.avatar_url
        if payload.profile is not None:
            user["profile"] = payload.profile.model_dump()

        user["updated_at"] = get_utc_now()
        await self._users.put(user_id, user)
        return UserResponse(**user)

    async def delete_user(self, user_id: str) -> None:
        """Deletes a user account."""
        if not await self._users.get(user_id):
            raise NotFoundError(resource="User", identifier=user_id)
        await self._users.delete(user_id)


# Singleton instance of UserService
user_service = UserService()
