"""Main FastAPI Application Entry Point.

Configures CORS, middleware, global error handling, routers, and root endpoints
for the AI Resume Analysis & Career Assistance Platform Backend.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.routes import api_v1_router, health_router

# Setup standardized logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s | %(levelname)-8s | %(name)s : %(message)s",
)
logger = logging.getLogger("app.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup and shutdown hooks."""
    logger.info("==================================================")
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)
    logger.info("Environment: %s | Debug: %s", settings.APP_ENV, settings.DEBUG)
    logger.info("CORS Allowed Origins: %s", settings.ALLOWED_ORIGINS)
    logger.info("API v1 Base Prefix: %s", settings.API_V1_PREFIX)
    logger.info("Documentation available at: /docs and /redoc")
    logger.info("==================================================")
    yield
    logger.info("Shutting down %s...", settings.APP_NAME)


# Initialize FastAPI Application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Production-style backend foundation for AI Resume Analysis, ATS optimization, "
        "job description matching, and personalized career discovery."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Register Centralized Error Handlers
register_exception_handlers(app)

# Configure Cross-Origin Resource Sharing (CORS)
origins = (
    settings.ALLOWED_ORIGINS
    if isinstance(settings.ALLOWED_ORIGINS, list)
    else [settings.ALLOWED_ORIGINS]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Health Endpoints (Accessible both at /api/health and /health)
app.include_router(health_router, prefix="/api")
app.include_router(health_router)

# Register Versioned Resource Routes (/api/v1/...)
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)


@app.get(
    "/",
    status_code=status.HTTP_200_OK,
    tags=["Root"],
    summary="Root Welcome Endpoint",
    description="Returns backend status, application name, version, and API documentation links.",
)
async def root_endpoint() -> dict:
    """Root endpoint welcoming clients and confirming operational status."""
    return {
        "message": "AI Resume Platform Backend is running",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "active",
        "docs_url": "/docs",
        "api_v1_prefix": settings.API_V1_PREFIX,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
