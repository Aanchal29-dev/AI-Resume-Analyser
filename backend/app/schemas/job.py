"""Job Description Pydantic schemas for data validation and response formatting.

Defines schemas for creating, managing, and retrieving target job descriptions
used for ATS resume matching and gap analysis.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class JobBase(BaseModel):
    """Base attributes for a job description."""
    title: str = Field(..., min_length=2, max_length=150, description="Job title (e.g., Frontend Developer)")
    company: Optional[str] = Field(None, max_length=150, description="Hiring company name")
    location: Optional[str] = Field(None, max_length=100, description="Job location or Remote")
    category: Optional[str] = Field(None, max_length=100, description="Job domain or industry category")
    description: str = Field(..., min_length=10, description="Full job description text")
    required_skills: List[str] = Field(default_factory=list, description="List of required technical and soft skills")
    optional_skills: List[str] = Field(default_factory=list, description="List of preferred or bonus skills")
    experience_level: Optional[str] = Field("Entry-Level", description="Entry-Level, Mid-Level, Senior, Internship")
    min_salary: Optional[float] = Field(None, ge=0, description="Minimum salary range")
    max_salary: Optional[float] = Field(None, ge=0, description="Maximum salary range")


class JobCreate(JobBase):
    """Schema for creating a new job description."""
    pass


class JobUpdate(BaseModel):
    """Schema for updating an existing job description."""
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    company: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = Field(None, min_length=10)
    required_skills: Optional[List[str]] = None
    optional_skills: Optional[List[str]] = None
    experience_level: Optional[str] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None


class JobResponse(JobBase):
    """Response schema for a single job description."""
    job_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class JobListResponse(BaseModel):
    """Response schema for listing multiple job descriptions."""
    total: int
    items: List[JobResponse]
