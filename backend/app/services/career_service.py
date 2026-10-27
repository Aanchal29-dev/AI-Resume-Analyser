"""Career Discovery Service layer.

Handles the career questionnaire submission flow, matching algorithms,
and career role exploration.
NOTE: In Phase 1, this service provides structured foundation responses
with `is_mock=True` to facilitate frontend integration testing.
ML-driven career matching will be implemented in Phase 4.
"""

from app.database.repository import Repository
from typing import Dict, List, Optional
from app.core.exceptions import NotFoundError
from app.schemas.career import (
    CareerDiscoveryResponse,
    CareerQuestionnaireRequest,
    CareerRoleDetailResponse,
)
from app.utils.helpers import generate_uuid, get_utc_now


class CareerService:
    """Service handling Career Discovery questionnaire processing and role discovery."""

    def __init__(self):
        self._discoveries = {}
        self._roles = {}
        self._seed_default_career_data()
        self._discoveries = Repository("discoveries", "discovery_id", self._discoveries)
        self._roles = Repository("roles", "role_id", self._roles)

    def _seed_default_career_data(self):
        """Seeds standard career pathways and sample discovery results."""
        now = get_utc_now()

        # Seed catalog roles
        role_fe = {
            "role_id": "role_frontend_eng",
            "title": "Frontend Engineer",
            "category": "Web Development & UI/UX",
            "match_percentage": 92.0,
            "salary_range": "$75,000 - $120,000 / year",
            "growth_outlook": "22% projected 10-year growth (Faster than average)",
            "summary": "Builds high-performance, interactive, and responsive web user interfaces using modern client frameworks.",
            "required_skills": ["JavaScript / ES6+", "React", "HTML5 & Modern CSS", "RESTful API Integration", "Git & GitHub"],
            "nice_to_have_skills": ["TypeScript", "TailwindCSS", "Next.js", "Jest / Testing Library", "Web Performance Optimization"],
            "day_in_the_life": "Collaborating with designers to turn Figma mockups into reusable React components, optimizing rendering performance, and consuming REST APIs.",
            "recommended_courses": [
                {
                    "course_id": "crs_fe_meta",
                    "title": "Meta Front-End Developer Professional Certificate",
                    "platform": "Coursera",
                    "instructor": "Meta Staff",
                    "url": "https://coursera.org",
                    "duration": "6 months (at 6 hrs/week)",
                    "difficulty": "Beginner",
                    "rating": 4.8,
                    "skills_covered": ["React", "JavaScript", "HTML/CSS", "UI Design"],
                }
            ],
            "action_plan": [
                "Master React hooks, component lifecycle, and state management.",
                "Build 3 full-stack portfolio projects with responsive mobile layouts.",
                "Practice frontend algorithm challenges and CSS layout quizzes.",
            ],
        }

        role_fs = {
            "role_id": "role_fullstack_eng",
            "title": "Full Stack Engineer",
            "category": "Software Engineering",
            "match_percentage": 88.0,
            "salary_range": "$90,000 - $140,000 / year",
            "growth_outlook": "25% projected 10-year growth (Very High)",
            "summary": "Develops both client-facing interfaces and scalable backend server APIs and databases.",
            "required_skills": ["Python / FastAPI or Node.js", "React", "SQL / Relational Databases", "REST APIs", "Git"],
            "nice_to_have_skills": ["Docker", "Redis", "Cloud Services (AWS/GCP)", "CI/CD Pipelines", "TypeScript"],
            "day_in_the_life": "Designing database schemas, writing backend API endpoints, and building React dashboards with end-to-end integration.",
            "recommended_courses": [
                {
                    "course_id": "crs_fs_bootcamp",
                    "title": "Full Stack Python & React Specialization",
                    "platform": "Coursera",
                    "instructor": "University of Michigan",
                    "url": "https://coursera.org",
                    "duration": "4 months",
                    "difficulty": "Intermediate",
                    "rating": 4.9,
                    "skills_covered": ["Python", "FastAPI", "React", "SQL", "Deployment"],
                }
            ],
            "action_plan": [
                "Build and deploy a full-stack CRUD application with authentication.",
                "Learn Docker basics to containerize both frontend and backend.",
                "Create a compelling resume showcasing end-to-end system architecture.",
            ],
        }

        role_da = {
            "role_id": "role_data_analyst",
            "title": "Data Analyst",
            "category": "Data & Business Intelligence",
            "match_percentage": 78.0,
            "salary_range": "$65,000 - $100,000 / year",
            "growth_outlook": "23% projected 10-year growth",
            "summary": "Translates complex datasets into clear dashboards, KPI reports, and data-driven business decisions.",
            "required_skills": ["SQL", "Python / Pandas", "Tableau / PowerBI", "Excel", "Data Cleaning"],
            "nice_to_have_skills": ["Statistical Analysis", "R", "Snowflake", "A/B Testing"],
            "day_in_the_life": "Writing complex SQL queries to extract data, cleaning datasets in Python Pandas, and presenting KPI dashboards to stakeholders.",
            "recommended_courses": [
                {
                    "course_id": "crs_google_da",
                    "title": "Google Data Analytics Professional Certificate",
                    "platform": "Coursera",
                    "instructor": "Google Career Certificates",
                    "url": "https://coursera.org",
                    "duration": "6 months",
                    "difficulty": "Beginner",
                    "rating": 4.8,
                    "skills_covered": ["SQL", "Spreadsheets", "Tableau", "R Programming"],
                }
            ],
            "action_plan": [
                "Master SQL joins, aggregations, and window functions.",
                "Build an interactive Tableau/PowerBI dashboard using public datasets.",
                "Publish a data exploration case study on GitHub.",
            ],
        }

        self._roles[role_fe["role_id"]] = role_fe
        self._roles[role_fs["role_id"]] = role_fs
        self._roles[role_da["role_id"]] = role_da

        # Seed discovery response
        default_disc_id = "dsc_demo123456"
        self._discoveries[default_disc_id] = {
            "discovery_id": default_disc_id,
            "user_id": "usr_demo123456",
            "primary_recommendation": role_fe,
            "alternative_roles": [role_fs, role_da],
            "summary_insight": "Based on your interest in interactive user experiences and modern coding tools, Frontend Engineering and Full Stack development offer your highest immediate trajectory.",
            "created_at": now,
            "is_mock": True,
        }

    async def get_role_by_id(self, role_id: str) -> CareerRoleDetailResponse:
        """Retrieves detailed profile for a specific career role."""
        role = await self._roles.get(role_id)
        if not role:
            raise NotFoundError(resource="Career Role", identifier=role_id)
        return CareerRoleDetailResponse(**role)

    async def get_all_roles(self) -> List[CareerRoleDetailResponse]:
        """Retrieves all explored career roles in the catalog."""
        return [CareerRoleDetailResponse(**r) for r in (await self._roles.values())]

    async def get_all_discoveries(self, user_id: Optional[str] = None) -> List[CareerDiscoveryResponse]:
        """Retrieves all questionnaire discovery results."""
        results = (await self._discoveries.values())
        if user_id:
            results = [d for d in results if d.get("user_id") == user_id]
        return [CareerDiscoveryResponse(**d) for d in results]

    async def process_questionnaire(
        self, payload: CareerQuestionnaireRequest
    ) -> CareerDiscoveryResponse:
        """Evaluates questionnaire answers and returns matched career roles."""
        disc_id = generate_uuid(prefix="dsc")
        now = get_utc_now()

        # Retrieve default roles
        roles_list = (await self._roles.values())
        primary_role = roles_list[0] if roles_list else None
        alternatives = roles_list[1:] if len(roles_list) > 1 else []

        if not primary_role:
            raise NotFoundError(resource="Career Roles", identifier="Catalog empty")

        summary_text = (
            f"Based on your interest in {', '.join(payload.interests[:3])} "
            f"and your {payload.technical_preference} preference, "
            f"{primary_role['title']} is your top matching pathway."
        )

        discovery_record = {
            "discovery_id": disc_id,
            "user_id": payload.user_id or "usr_demo123456",
            "primary_recommendation": primary_role,
            "alternative_roles": alternatives,
            "summary_insight": summary_text,
            "created_at": now,
            "is_mock": True,
        }

        await self._discoveries.put(disc_id, discovery_record)
        return CareerDiscoveryResponse(**discovery_record)


# Singleton instance of CareerService
career_service = CareerService()
