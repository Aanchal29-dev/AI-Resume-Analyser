"""Resume Pydantic schemas for data validation and response formatting.

Defines schemas for resume upload validation, parsed resume components,
and resume metadata management.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ContactInfoSchema(BaseModel):
    """Parsed contact information."""
    full_name: Optional[str] = Field(None, description="Candidate full name")
    email: Optional[str] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    location: Optional[str] = Field(None, description="Location / Address")
    linkedin: Optional[str] = Field(None, description="LinkedIn URL")
    github: Optional[str] = Field(None, description="GitHub URL")
    portfolio: Optional[str] = Field(None, description="Portfolio website")


class EducationSchema(BaseModel):
    """Education entry schema."""
    institution: str = Field(..., description="University or college name")
    degree: str = Field(..., description="Degree / Major")
    location: Optional[str] = None
    graduation_year: Optional[str] = None
    gpa: Optional[str] = None
    coursework: Optional[str] = None


class ExperienceSchema(BaseModel):
    """Experience / Internship entry schema."""
    id: Optional[str] = None
    title: str = Field(..., description="Job or internship title")
    company: str = Field(..., description="Company or organization name")
    location: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None
    improved_bullet: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)


class ProjectSchema(BaseModel):
    """Project entry schema."""
    id: Optional[str] = None
    name: str = Field(..., description="Project name")
    tech: Optional[str] = Field(None, description="Technologies used")
    period: Optional[str] = None
    description: Optional[str] = None
    improved_bullet: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)


class SkillCategorySchema(BaseModel):
    """Categorized skills schema."""
    technical: List[str] = Field(default_factory=list)
    soft: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)


class CertificationSchema(BaseModel):
    """Certification entry schema."""
    name: str
    issuer: Optional[str] = None
    year: Optional[str] = None
    credential_id: Optional[str] = None


class ParsedResumeDataSchema(BaseModel):
    """Full structured parsed resume data."""
    contact: Optional[ContactInfoSchema] = None
    summary: Optional[str] = None
    education: List[EducationSchema] = Field(default_factory=list)
    experience: List[ExperienceSchema] = Field(default_factory=list)
    projects: List[ProjectSchema] = Field(default_factory=list)
    skills: SkillCategorySchema = Field(default_factory=SkillCategorySchema)
    certifications: List[CertificationSchema] = Field(default_factory=list)


class ResumeCreate(BaseModel):
    """Manual resume creation or metadata registration."""
    user_id: str = Field(..., description="User ID who owns this resume")
    title: str = Field("Main Resume", max_length=150, description="Resume label/title")
    file_name: Optional[str] = Field(None, description="Original uploaded filename")
    file_type: Optional[str] = Field(None, description="MIME type or file extension")
    raw_text: Optional[str] = Field(None, description="Extracted raw text content")
    parsed_data: Optional[ParsedResumeDataSchema] = None


class ResumeUpdate(BaseModel):
    """Schema for updating resume metadata or contents."""
    title: Optional[str] = None
    raw_text: Optional[str] = None
    parsed_data: Optional[ParsedResumeDataSchema] = None


class ResumeUploadResponse(BaseModel):
    """Response returned upon successful resume file upload."""
    resume_id: str
    file_name: str
    file_type: str
    file_size_bytes: int
    message: str
    uploaded_at: datetime
    status: str = "uploaded_successfully"


class ResumeResponse(BaseModel):
    """Full resume detail response."""
    resume_id: str
    user_id: str
    title: str
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_size_bytes: Optional[int] = None
    storage_path: Optional[str] = None
    version: int = 1
    raw_text_preview: Optional[str] = None
    is_parsed: bool = False
    parsed_data: Optional[ParsedResumeDataSchema] = None
    uploaded_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResumeListResponse(BaseModel):
    """List of user resumes response."""
    total: int
    items: List[ResumeResponse]
