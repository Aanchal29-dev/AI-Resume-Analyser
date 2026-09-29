"""Health Check API Router.

Provides server liveness and readiness diagnostic endpoints.
"""

from typing import Dict
from fastapi import APIRouter, status
from app.core.config import settings

router = APIRouter(tags=["Health & System Diagnostics"])


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="System Health Check",
    description="Returns current operational status of the FastAPI backend server.",
    response_model=Dict[str, str],
)
async def health_check() -> Dict[str, str]:
    """Returns 200 OK if service is alive and functioning."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
    }
