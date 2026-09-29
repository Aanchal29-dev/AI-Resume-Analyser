"""Routes package export for AI Resume Platform."""

from fastapi import APIRouter
from app.routes.ai import router as ai_router
from app.routes.analyses import router as analyses_router
from app.routes.career import router as career_router
from app.routes.health import router as health_router
from app.routes.jobs import router as jobs_router
from app.routes.recommendations import router as recommendations_router
from app.routes.resumes import router as resumes_router
from app.routes.users import router as users_router

# Central API v1 Router aggregating all resource endpoints
api_v1_router = APIRouter()
api_v1_router.include_router(users_router)
api_v1_router.include_router(resumes_router)
api_v1_router.include_router(jobs_router)
api_v1_router.include_router(analyses_router)
api_v1_router.include_router(recommendations_router)
api_v1_router.include_router(career_router)
api_v1_router.include_router(ai_router)

__all__ = [
    "api_v1_router",
    "health_router",
    "users_router",
    "resumes_router",
    "jobs_router",
    "analyses_router",
    "recommendations_router",
    "career_router",
    "ai_router",
]
