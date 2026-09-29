# Data Models Directory (SQLAlchemy / ORM)

## Overview
This directory is reserved for database entity models (such as SQLAlchemy ORM Declarative Models).

> **Important Note:**
> Database integration will be implemented in the next development phase using **MySQL**.

---

## Planned Model Architecture for Phase 2

When MySQL is connected in Phase 2, the following ORM models will be created here:

1. **`User` (`models/user.py`)**
   - `id` (VARCHAR / UUID, Primary Key)
   - `email` (VARCHAR, Unique, Indexed)
   - `name` (VARCHAR)
   - `avatar_url` (TEXT, Nullable)
   - `google_id` (VARCHAR, Nullable, Indexed for OAuth)
   - `created_at`, `updated_at` (DATETIME)
   - *Relationships:* `resumes`, `analyses`, `discoveries`

2. **`UserProfile` (`models/profile.py`)**
   - `id`, `user_id` (Foreign Key -> `User.id`)
   - `headline`, `bio`, `target_role`, `target_industry`, `years_of_experience`
   - `phone`, `location`, `linkedin_url`, `github_url`, `portfolio_url`

3. **`Resume` (`models/resume.py`)**
   - `id` (VARCHAR / UUID, Primary Key)
   - `user_id` (Foreign Key -> `User.id`)
   - `title`, `file_name`, `file_type`, `file_size_bytes`, `storage_path`
   - `raw_text` (LONGTEXT), `parsed_json` (JSON)
   - `version` (INT)
   - `created_at`, `updated_at`

4. **`JobDescription` (`models/job.py`)**
   - `id` (VARCHAR / UUID, Primary Key)
   - `title`, `company`, `location`, `category`
   - `description` (LONGTEXT)
   - `required_skills` (JSON), `optional_skills` (JSON)
   - `min_salary`, `max_salary`, `experience_level`
   - `created_at`

5. **`Analysis` (`models/analysis.py`)**
   - `id` (VARCHAR / UUID, Primary Key)
   - `resume_id` (Foreign Key -> `Resume.id`)
   - `user_id` (Foreign Key -> `User.id`, Nullable)
   - `job_id` (Foreign Key -> `JobDescription.id`, Nullable)
   - `overall_score`, `ats_score`, `match_percentage`, `completeness_score`
   - `matched_keywords` (JSON), `missing_keywords` (JSON), `detected_skills` (JSON)
   - `weak_sections` (JSON), `suggestions` (JSON), `bullet_improvements` (JSON)
   - `is_certificate` (BOOLEAN), `certificate_audit` (JSON)
   - `created_at`

6. **`CareerDiscovery` (`models/career.py`)**
   - `id` (VARCHAR / UUID, Primary Key)
   - `user_id` (Foreign Key -> `User.id`, Nullable)
   - `questionnaire_answers` (JSON)
   - `primary_recommendation` (JSON)
   - `alternative_roles` (JSON)
   - `created_at`

---

## Migration Strategy
- **Alembic** will be used to generate and run database migrations against the MySQL database instance configured via `DATABASE_URL` in `.env`.
