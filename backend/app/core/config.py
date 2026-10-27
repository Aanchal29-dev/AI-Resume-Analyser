"""Application Configuration & Environment Settings.

Reads environment variables using Pydantic Settings and provides structured
configuration for CORS, logging, API versioning, and future service integrations.
"""

from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application settings loaded from environment or defaults."""

    # Application Metadata
    APP_NAME: str = "AI Resume Analysis & Career Assistance Platform"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Server Host & Port
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # CORS Allowed Origins
    ALLOWED_ORIGINS: Union[List[str], str] = Field(
        default=[
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
        ]
    )

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value: Union[List[str], str]) -> List[str]:
        """Parses comma-separated strings or returns list of allowed origins."""
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    # File Upload Constraints
    ALLOWED_RESUME_EXTENSIONS: List[str] = [
        ".pdf",
        ".docx",
        ".doc",
        ".txt",
        ".png",
        ".jpg",
        ".jpeg",
    ]
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB limit

    # =========================================================================
    # FUTURE PLACEHOLDERS - To be configured in subsequent development phases
    # =========================================================================

    # MongoDB credentials belong in the local .env, never in Git.
    MONGODB_URI: str = ""
    MONGODB_DATABASE: str = "resume_analyser"
    SEED_DEMO_DATA: bool = False
    UPLOAD_DIRECTORY: str = "uploads/resumes"

    # Future Google OAuth
    GOOGLE_CLIENT_ID: str = Field(
        default="",
        description="Placeholder: Will be configured for Google OAuth in Phase 3",
    )
    GOOGLE_CLIENT_SECRET: str = Field(
        default="",
        description="Placeholder: Will be configured for Google OAuth in Phase 3",
    )
    JWT_SECRET_KEY: str = Field(
        default="temporary-development-secret-key-change-in-production",
        description="Placeholder: Will be used for JWT session signing",
    )

    # Future AI Integration (Gemini API & ML Model)
    GEMINI_API_KEY: str = Field(
        default="",
        description="Placeholder: Will be integrated with Gemini API in Phase 4",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Instantiate singleton settings object
settings = Settings()
