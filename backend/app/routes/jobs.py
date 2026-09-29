"""Job Descriptions API Router.

Provides endpoints for creating, retrieving, updating, and filtering
target job descriptions and benchmarks.
"""

from typing import List, Optional
from fastapi import APIRouter, Query, status
from app.schemas.job import JobCreate, JobResponse, JobUpdate
from app.services.job_service import job_service

router = APIRouter(prefix="/jobs", tags=["Job Descriptions & Target Roles"])


@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Target Job Description",
    description="Creates a new job description used for ATS benchmarking and keyword matching.",
)
async def create_job(payload: JobCreate) -> JobResponse:
    return await job_service.create_job(payload)


@router.get(
    "",
    response_model=List[JobResponse],
    status_code=status.HTTP_200_OK,
    summary="List All Job Descriptions",
    description="Retrieves a list of available job descriptions, optionally filtered by category.",
)
async def get_all_jobs(
    category: Optional[str] = Query(None, description="Filter by job category (e.g. Software Engineering)")
) -> List[JobResponse]:
    return await job_service.get_all_jobs(category=category)


@router.get(
    "/{job_id}",
    response_model=JobResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Job Description By ID",
    description="Retrieves details and required skills for a specific job description.",
)
async def get_job_by_id(job_id: str) -> JobResponse:
    return await job_service.get_job_by_id(job_id)


@router.put(
    "/{job_id}",
    response_model=JobResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Job Description",
    description="Updates job requirements, skills, or title.",
)
async def update_job(job_id: str, payload: JobUpdate) -> JobResponse:
    return await job_service.update_job(job_id, payload)


@router.delete(
    "/{job_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Job Description",
    description="Deletes a target job description.",
)
async def delete_job(job_id: str) -> dict:
    await job_service.delete_job(job_id)
    return {"success": True, "message": f"Job '{job_id}' deleted successfully."}
