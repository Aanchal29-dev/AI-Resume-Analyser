"""Resumes API Router.

Provides endpoints for resume upload validation, manual creation,
retrieval, updates, and deletion.
"""

from typing import List, Optional
from fastapi import APIRouter, File, Form, UploadFile, status
from app.schemas.resume import (
    ResumeCreate,
    ResumeResponse,
    ResumeUpdate,
    ResumeUploadResponse,
)
from app.services.resume_service import resume_service

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post(
    "/upload",
    response_model=ResumeUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Resume Document",
    description="Uploads and validates a resume file (PDF, DOCX, TXT, images). Returns file metadata and queues parsing.",
)
async def upload_resume(
    file: UploadFile = File(..., description="Resume document file"),
    user_id: Optional[str] = Form("usr_demo123456", description="Associated user ID"),
) -> ResumeUploadResponse:
    return await resume_service.validate_and_process_upload(file=file, user_id=user_id)


@router.post(
    "",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Resume Record",
    description="Manually registers structured resume data or text.",
)
async def create_resume(payload: ResumeCreate) -> ResumeResponse:
    return await resume_service.create_resume(payload)


@router.get(
    "",
    response_model=List[ResumeResponse],
    status_code=status.HTTP_200_OK,
    summary="List All Resumes",
    description="Retrieves a list of uploaded resumes, optionally filtered by user_id.",
)
async def get_all_resumes(user_id: Optional[str] = None) -> List[ResumeResponse]:
    return await resume_service.get_all_resumes(user_id=user_id)


@router.get(
    "/{resume_id}",
    response_model=ResumeResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Resume By ID",
    description="Retrieves detailed resume information including parsed sections and preview.",
)
async def get_resume_by_id(resume_id: str) -> ResumeResponse:
    return await resume_service.get_resume_by_id(resume_id)


@router.put(
    "/{resume_id}",
    response_model=ResumeResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Resume",
    description="Updates resume metadata, raw text, or parsed sections.",
)
async def update_resume(resume_id: str, payload: ResumeUpdate) -> ResumeResponse:
    return await resume_service.update_resume(resume_id, payload)


@router.delete(
    "/{resume_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Resume",
    description="Deletes a resume record by ID.",
)
async def delete_resume(resume_id: str) -> dict:
    await resume_service.delete_resume(resume_id)
    return {"success": True, "message": f"Resume '{resume_id}' deleted successfully."}
