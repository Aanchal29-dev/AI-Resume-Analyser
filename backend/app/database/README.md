# Database Architecture & MySQL Integration Guide

## Current Status (Phase 1)
Database integration will be implemented in the next development phase using **MySQL**.

During this foundation phase:
- In-memory service state is utilized for development, unit testing, and API contract exploration.
- Service interfaces are completely decoupled from persistence details so swapping to a database repository requires zero changes to the HTTP routes or Pydantic schemas.

---

## Planned Architecture for Phase 2 (MySQL Connection)

```
backend/app/database/
├── __init__.py
├── session.py       # SQLAlchemy engine, sessionmaker, and get_db dependency
├── base.py          # Base Declarative class and model metadata imports
└── repositories/    # Clean Repository pattern for database CRUD operations
    ├── user_repo.py
    ├── resume_repo.py
    ├── job_repo.py
    └── analysis_repo.py
```

### 1. Database Connection (`database/session.py`)
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 2. Environment Configuration
The database connection string in `.env`:
```env
DATABASE_URL=mysql+pymysql://<user>:<password>@<host>:3306/<database_name>
```

### 3. Migrations
- Schema migrations will be managed using `alembic init alembic`.
- Auto-generation commands: `alembic revision --autogenerate -m "Initial schema"` -> `alembic upgrade head`.
