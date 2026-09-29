"""Resume Analysis Pydantic schemas.

Defines schemas for ATS scoring, keyword matching, gap analysis, suggestions,
and verification results.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class OriginalityAuditSchema(BaseModel):
    """Certificate or credential authenticity audit schema."""
    authenticity_score: float = Field(..., ge=0, le=100)
    status: str = Field("Verified Authentic", description="Verification state")
    issuer_accreditation: Optional[str] = "Accredited / Recognized Organization"
    tampering_check: Optional[str] = "Passed - No font or metadata anomalies detected"
    serial_verification: Optional[str] = "Valid format recognized"
    notes: Optional[str] = None


class CertificateDetailsSchema(BaseModel):
    """Certificate details extracted from uploaded credentials."""
    recipient_name: Optional[str] = None
    title: Optional[str] = None
    issuer: Optional[str] = None
    issue_date: Optional[str] = None
    credential_id: Optional[str] = None
    skills: List[str] = Field(default_factory=list)


class BulletImprovementSchema(BaseModel):
    """Side-by-side bullet point rewrite suggestion."""
    original: str
    improved: str
    action_verb: Optional[str] = None
    metrics_added: Optional[str] = None
    rationale: Optional[str] = None


class AnalysisCreateRequest(BaseModel):
    """Request schema to trigger resume analysis against a target job or role."""
    resume_id: str = Field(..., description="ID of uploaded resume to evaluate")
    user_id: Optional[str] = Field(None, description="Optional user ID")
    job_id: Optional[str] = Field(None, description="Optional target job ID")
    target_role_title: Optional[str] = Field(None, description="Target role title if job_id is not provided")
    target_role_description: Optional[str] = Field(None, description="Target role description if job_id is not provided")


class AnalysisResponse(BaseModel):
    """Comprehensive analysis result response."""
    analysis_id: str
    resume_id: str
    user_id: Optional[str] = None
    job_id: Optional[str] = None
    target_role: Optional[str] = None
    
    # Core ATS & Match Metrics
    overall_score: float = Field(..., ge=0, le=100, description="Overall ATS compatibility score")
    ats_score: float = Field(..., ge=0, le=100, description="ATS parseability score")
    match_percentage: float = Field(..., ge=0, le=100, description="Job description alignment percentage")
    completeness_score: float = Field(..., ge=0, le=100, description="Resume section completeness percentage")
    
    # Detailed Analysis Breakdowns
    matched_keywords: List[str] = Field(default_factory=list, description="Keywords present in both resume & job")
    missing_keywords: List[str] = Field(default_factory=list, description="High-priority keywords missing from resume")
    detected_skills: List[str] = Field(default_factory=list, description="Skills extracted from resume")
    weak_sections: List[str] = Field(default_factory=list, description="Sections needing improvement or expansion")
    suggestions: List[str] = Field(default_factory=list, description="Actionable recommendations")
    key_strengths: List[str] = Field(default_factory=list, description="Highlights of the candidate's resume")
    critical_gaps: List[str] = Field(default_factory=list, description="Critical deficiencies for the target role")
    bullet_improvements: List[BulletImprovementSchema] = Field(default_factory=list)
    
    # Credential & Certificate Handling
    is_certificate: bool = False
    certificate_details: Optional[CertificateDetailsSchema] = None
    originality_audit: Optional[OriginalityAuditSchema] = None
    
    # Foundation metadata
    is_mock: bool = Field(True, description="Indicates placeholder/foundation data pending Phase 4 AI/ML connection")
    created_at: datetime

    model_config = {"from_attributes": True}


class AnalysisListResponse(BaseModel):
    """Response schema for listing analyses."""
    total: int
    items: List[AnalysisResponse]
