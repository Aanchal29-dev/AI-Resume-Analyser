"""Job Service layer.

Handles CRUD operations and filtering for job descriptions and target career profiles.
In Phase 1, stores data in memory with pre-seeded industry job roles.
"""

from app.database.repository import Repository
from typing import Dict, List, Optional
from app.core.exceptions import NotFoundError
from app.schemas.job import JobCreate, JobResponse, JobUpdate
from app.utils.helpers import generate_uuid, get_utc_now


class JobService:
    """Service handling job description storage, retrieval, and search."""

    def __init__(self):
        self._jobs = {}
        self._seed_default_jobs()
        self._jobs = Repository("jobs", "job_id", self._jobs)

    def _seed_default_jobs(self):
        """Seeds common target job roles used across the platform."""
        now = get_utc_now()
        defaults = [
            {
                "job_id": "job_fe_01",
                "title": "Frontend Developer",
                "company": "Modern Web Solutions",
                "location": "San Francisco, CA (Remote Available)",
                "category": "Software Engineering",
                "description": "Seeking an enthusiastic Frontend Developer proficient in React, modern JavaScript/TypeScript, responsive CSS, and state management. You will build user-friendly interfaces, optimize web performance, and integrate with backend APIs.",
                "required_skills": ["React", "JavaScript", "HTML5", "CSS3", "REST APIs", "Git"],
                "optional_skills": ["TypeScript", "TailwindCSS", "Next.js", "Jest", "Vite"],
                "experience_level": "Entry to Mid-Level",
                "min_salary": 75000,
                "max_salary": 115000,
                "created_at": now,
                "updated_at": now,
            },
            {
                "job_id": "job_fs_02",
                "title": "Full Stack Engineer",
                "company": "Nexus Systems",
                "location": "New York, NY",
                "category": "Software Engineering",
                "description": "Looking for a Full Stack Engineer capable of working across FastAPI/Python backend services and modern React frontends. Experience with relational databases and containerization is highly valued.",
                "required_skills": ["Python", "FastAPI", "React", "SQL", "Git", "REST APIs"],
                "optional_skills": ["Docker", "MySQL", "PostgreSQL", "Redis", "AWS"],
                "experience_level": "Mid-Level",
                "min_salary": 90000,
                "max_salary": 135000,
                "created_at": now,
                "updated_at": now,
            },
            {
                "job_id": "job_da_03",
                "title": "Data Analyst",
                "company": "Insight Data Labs",
                "location": "Austin, TX (Remote)",
                "category": "Data & Analytics",
                "description": "Analyze complex business datasets, construct automated KPI dashboards, and deliver actionable insights using Python, SQL, Tableau, and Excel.",
                "required_skills": ["Python", "SQL", "Pandas", "Excel", "Data Visualization", "Tableau"],
                "optional_skills": ["PowerBI", "R", "Statistics", "Snowflake", "ETL"],
                "experience_level": "Entry-Level",
                "min_salary": 65000,
                "max_salary": 95000,
                "created_at": now,
                "updated_at": now,
            },
        ]

        for job in defaults:
            self._jobs[job["job_id"]] = job

    async def get_all_jobs(self, category: Optional[str] = None) -> List[JobResponse]:
        """Retrieves all jobs, optionally filtered by category."""
        jobs = (await self._jobs.values())
        if category:
            jobs = [j for j in jobs if j.get("category", "").lower() == category.lower()]
        return [JobResponse(**j) for j in jobs]

    async def get_job_by_id(self, job_id: str) -> JobResponse:
        """Retrieves a single job description by ID."""
        job = await self._jobs.get(job_id)
        if not job:
            raise NotFoundError(resource="Job Description", identifier=job_id)
        return JobResponse(**job)

    async def create_job(self, payload: JobCreate) -> JobResponse:
        """Creates a new job description."""
        job_id = generate_uuid(prefix="job")
        now = get_utc_now()
        job_record = {
            "job_id": job_id,
            "title": payload.title,
            "company": payload.company,
            "location": payload.location,
            "category": payload.category or "General",
            "description": payload.description,
            "required_skills": payload.required_skills,
            "optional_skills": payload.optional_skills,
            "experience_level": payload.experience_level,
            "min_salary": payload.min_salary,
            "max_salary": payload.max_salary,
            "created_at": now,
            "updated_at": now,
        }
        await self._jobs.put(job_id, job_record)
        return JobResponse(**job_record)

    async def update_job(self, job_id: str, payload: JobUpdate) -> JobResponse:
        """Updates an existing job description."""
        job = await self._jobs.get(job_id)
        if not job:
            raise NotFoundError(resource="Job Description", identifier=job_id)

        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                job[key] = value

        job["updated_at"] = get_utc_now()
        await self._jobs.put(job_id, job)
        return JobResponse(**job)

    async def delete_job(self, job_id: str) -> None:
        """Deletes a job description."""
        if not await self._jobs.get(job_id):
            raise NotFoundError(resource="Job Description", identifier=job_id)
        await self._jobs.delete(job_id)


# Singleton instance of JobService
job_service = JobService()
