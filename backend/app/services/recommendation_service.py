"""Recommendation Service layer.

Coordinates job role recommendations, skill gap roadmaps, and course suggestions.
NOTE: In Phase 1, this service provides structured foundation responses
with `is_mock=True` to facilitate frontend and API contract testing.
Real AI/ML recommendation logic will be integrated in Phase 4.
"""

from typing import Dict, List, Optional
from app.core.exceptions import NotFoundError
from app.schemas.recommendation import (
    CourseRecommendationSchema,
    RecommendationCreateRequest,
    RecommendationResponse,
    RoleRecommendationSchema,
    SkillRecommendationSchema,
)
from app.utils.helpers import generate_uuid, get_utc_now


class RecommendationService:
    """Service handling role, skill, and course recommendations."""

    def __init__(self):
        self._recommendations: Dict[str, dict] = {}
        self._seed_default_recommendation()

    def _seed_default_recommendation(self):
        """Seeds a sample recommendation for immediate API inspection."""
        default_id = "rec_demo123456"
        now = get_utc_now()
        self._recommendations[default_id] = {
            "recommendation_id": default_id,
            "user_id": "usr_demo123456",
            "resume_id": "res_demo123456",
            "target_role": "Full Stack Engineer",
            "recommended_roles": [
                {
                    "role_id": "role_fs",
                    "title": "Full Stack Engineer",
                    "category": "Software Engineering",
                    "match_percentage": 88.0,
                    "salary_range": "$90,000 - $135,000",
                    "demand_level": "Very High",
                    "why_fit": "Strong foundation in React and Python/FastAPI backend architectures with API design experience.",
                    "skills_to_learn": ["Docker", "Redis", "CI/CD (GitHub Actions)"],
                    "next_steps": [
                        "Deploy a containerized microservice project with Docker.",
                        "Add asynchronous caching using Redis to your portfolio repository.",
                    ],
                },
                {
                    "role_id": "role_be",
                    "title": "Backend Developer (Python)",
                    "category": "Software Engineering",
                    "match_percentage": 84.0,
                    "salary_range": "$85,000 - $125,000",
                    "demand_level": "High",
                    "why_fit": "Proficiency in REST API development, schema validation, and SQL database interactions.",
                    "skills_to_learn": ["PostgreSQL Optimization", "Message Queues (RabbitMQ/Celery)"],
                    "next_steps": [
                        "Complete an advanced database indexing and query optimization project.",
                    ],
                },
            ],
            "recommended_skills": [
                {
                    "skill_name": "Docker & Containerization",
                    "category": "DevOps / Infrastructure",
                    "importance": "High",
                    "reason": "Essential for containerizing full-stack applications and deploying to modern cloud platforms.",
                    "estimated_time_to_learn": "2-3 weeks",
                },
                {
                    "skill_name": "Redis Caching",
                    "category": "Backend Performance",
                    "importance": "Medium",
                    "reason": "Speeds up data retrieval and handles user session caching in high-concurrency environments.",
                    "estimated_time_to_learn": "1-2 weeks",
                },
            ],
            "recommended_courses": [
                {
                    "course_id": "crs_docker_01",
                    "title": "Docker for Developers & DevOps",
                    "platform": "Coursera",
                    "instructor": "Google Cloud Training",
                    "url": "https://coursera.org",
                    "duration": "12 hours",
                    "difficulty": "Beginner to Intermediate",
                    "rating": 4.8,
                    "skills_covered": ["Docker", "Docker Compose", "Container Security", "CI/CD"],
                },
                {
                    "course_id": "crs_fastapi_02",
                    "title": "Production-Ready FastAPI Microservices",
                    "platform": "Udemy",
                    "instructor": "Senior Tech Lead",
                    "url": "https://udemy.com",
                    "duration": "18 hours",
                    "difficulty": "Intermediate",
                    "rating": 4.9,
                    "skills_covered": ["FastAPI", "Pydantic v2", "SQLAlchemy", "Alembic", "Testing"],
                },
            ],
            "is_mock": True,
            "created_at": now,
        }

    async def get_all_recommendations(
        self, user_id: Optional[str] = None
    ) -> List[RecommendationResponse]:
        """Retrieves all recommendation records."""
        results = list(self._recommendations.values())
        if user_id:
            results = [r for r in results if r.get("user_id") == user_id]
        return [RecommendationResponse(**r) for r in results]

    async def get_recommendation_by_id(self, recommendation_id: str) -> RecommendationResponse:
        """Retrieves a single recommendation record by ID."""
        rec = self._recommendations.get(recommendation_id)
        if not rec:
            raise NotFoundError(resource="Recommendation", identifier=recommendation_id)
        return RecommendationResponse(**rec)

    async def generate_recommendations(
        self, payload: RecommendationCreateRequest
    ) -> RecommendationResponse:
        """Generates role and learning recommendations for a user or target role."""
        rec_id = generate_uuid(prefix="rec")
        now = get_utc_now()
        target = payload.target_role or "Software Engineer"

        rec_record = {
            "recommendation_id": rec_id,
            "user_id": payload.user_id or "usr_demo123456",
            "resume_id": payload.resume_id,
            "target_role": target,
            "recommended_roles": [
                {
                    "role_id": "role_rec_01",
                    "title": target,
                    "category": "Technology",
                    "match_percentage": 82.0,
                    "salary_range": "$80,000 - $120,000",
                    "demand_level": "High",
                    "why_fit": f"Your current profile demonstrates solid alignment with core {target} prerequisites.",
                    "skills_to_learn": ["Advanced System Design", "Automated Testing"],
                    "next_steps": [
                        "Deepen project portfolio with an end-to-end full stack repository.",
                        "Contribute to open source projects in this domain.",
                    ],
                }
            ],
            "recommended_skills": [
                {
                    "skill_name": "Cloud Deployment (AWS/GCP)",
                    "category": "Cloud Computing",
                    "importance": "High",
                    "reason": "Broadly demanded across software engineering teams.",
                    "estimated_time_to_learn": "3-4 weeks",
                }
            ],
            "recommended_courses": [
                {
                    "course_id": "crs_gen_01",
                    "title": f"Mastering {target} in 2026",
                    "platform": "Coursera",
                    "instructor": "Industry Expert",
                    "url": "https://coursera.org",
                    "duration": "15 hours",
                    "difficulty": "Intermediate",
                    "rating": 4.8,
                    "skills_covered": ["Architecture", "Best Practices", "Hands-on Labs"],
                }
            ],
            "is_mock": True,
            "created_at": now,
        }

        self._recommendations[rec_id] = rec_record
        return RecommendationResponse(**rec_record)


# Singleton instance of RecommendationService
recommendation_service = RecommendationService()
