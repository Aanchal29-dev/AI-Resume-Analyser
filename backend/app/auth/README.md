# Authentication & Security Architecture

## Current Status (Phase 1)
Authentication is intentionally not implemented in this initial foundation phase to keep the core API straightforward and decoupled.

> **Important Note:**
> Authentication will be implemented in **Phase 3** using **Google OAuth 2.0** and **JWT Bearer Tokens**.

---

## Planned Architecture for Phase 3

```
backend/app/auth/
├── __init__.py
├── google.py        # Google OAuth token verification and callback handling
├── jwt.py           # JWT token generation, signature validation, and claims parsing
└── dependencies.py  # FastAPI Depends(get_current_user) for route protection
```

### 1. Google OAuth Flow
1. **Frontend**: The user logs in via Google Identity Services (GIS) / `@react-oauth/google` and receives an `id_token` or authorization code.
2. **Backend**: Frontend sends `id_token` to `POST /api/v1/auth/google`.
3. **Verification**: Backend verifies token validity with Google's public keys via `google-auth` library:
   ```python
   from google.oauth2 import id_token
   from google.auth.transport import requests
   
   id_info = id_token.verify_oauth2_token(
       token, requests.Request(), settings.GOOGLE_CLIENT_ID
   )
   user_email = id_info['email']
   user_name = id_info.get('name')
   ```
4. **Session / JWT**: Backend provisions or retrieves user in database and returns an application JWT `access_token`.

### 2. FastAPI Route Protection Dependency (`auth/dependencies.py`)
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt import verify_jwt_token
from app.services.user_service import user_service

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_jwt_token(token)
    user_id = payload.get("sub")
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user
```
