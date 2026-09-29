"""User Pydantic schemas for data validation and response formatting.

Defines schemas for user profile management, creation, updates, and responses.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserProfileSchema(BaseModel):
    """User profile details."""
    headline: Optional[str] = Field(None, max_length=150, description="Professional headline/title")
    bio: Optional[str] = Field(None, max_length=1000, description="Short professional bio")
    target_role: Optional[str] = Field(None, max_length=100, description="Target career role")
    target_industry: Optional[str] = Field(None, max_length=100, description="Target industry")
    years_of_experience: Optional[float] = Field(None, ge=0, le=60, description="Years of professional experience")
    phone: Optional[str] = Field(None, max_length=30, description="Contact phone number")
    location: Optional[str] = Field(None, max_length=100, description="City, Country")
    linkedin_url: Optional[str] = Field(None, max_length=255, description="LinkedIn profile link")
    github_url: Optional[str] = Field(None, max_length=255, description="GitHub profile link")
    portfolio_url: Optional[str] = Field(None, max_length=255, description="Portfolio website link")


class UserBase(BaseModel):
    """Base user attributes."""
    name: str = Field(..., min_length=2, max_length=100, description="Full name of user")
    email: EmailStr = Field(..., description="Unique email address")
    avatar_url: Optional[str] = Field(None, description="User avatar image URL")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    profile: Optional[UserProfileSchema] = None


class UserUpdate(BaseModel):
    """Schema for updating user details."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    profile: Optional[UserProfileSchema] = None


class UserResponse(UserBase):
    """Response schema for user data."""
    user_id: str = Field(..., description="Unique identifier for the user")
    profile: Optional[UserProfileSchema] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserProfileResponse(BaseModel):
    """Response schema for user profile view."""
    user_id: str
    name: str
    email: str
    avatar_url: Optional[str] = None
    profile: Optional[UserProfileSchema] = None
    resumes_count: int = 0
    analyses_count: int = 0
    created_at: datetime
