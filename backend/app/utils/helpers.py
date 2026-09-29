"""Utility helpers for backend application.

Provides common functions for unique ID generation, file validation,
timestamp formatting, and pagination helpers.
"""

import os
import uuid
from datetime import datetime, timezone
from typing import List, Tuple


def generate_uuid(prefix: str = "") -> str:
    """Generates a prefixed UUID string (e.g. 'usr_12345678abcdef')."""
    unique_part = uuid.uuid4().hex[:12]
    if prefix:
        return f"{prefix}_{unique_part}"
    return unique_part


def get_utc_now() -> datetime:
    """Returns current UTC datetime timezone-aware."""
    return datetime.now(timezone.utc)


def format_iso_timestamp(dt: datetime = None) -> str:
    """Formats datetime as ISO 8601 string."""
    target_dt = dt or get_utc_now()
    return target_dt.isoformat()


def validate_file_extension(filename: str, allowed_extensions: List[str]) -> Tuple[bool, str]:
    """Validates if a filename has an allowed extension.
    
    Returns:
        (is_valid, extension)
    """
    if not filename or "." not in filename:
        return False, ""
    
    ext = os.path.splitext(filename)[1].lower()
    return ext in [e.lower() for e in allowed_extensions], ext


def sanitize_filename(filename: str) -> str:
    """Sanitizes user uploaded filename to prevent directory traversal."""
    base_name = os.path.basename(filename)
    return "".join(c for c in base_name if c.isalnum() or c in "._- ")
