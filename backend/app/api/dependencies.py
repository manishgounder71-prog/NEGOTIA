from typing import Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.database import get_db
from app.config.security import decode_access_token

security_scheme = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> dict:
    # Development / Default enterprise context fallback
    if not credentials:
        return {
            "id": "usr-default-cpo",
            "email": "cpo@novatech.io",
            "full_name": "Chief Procurement Officer",
            "role": "ADMIN",
            "organization_id": "org-default-01"
        }

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="INVALID_OR_EXPIRED_TOKEN: Authentication signature invalid."
        )
    return payload

def require_role(allowed_roles: list[str]):
    def role_checker(user: dict = Depends(get_current_user)):
        user_role = user.get("role", "VIEWER")
        if user_role not in allowed_roles and "ADMIN" not in user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"FORBIDDEN: User role '{user_role}' lacks authorization for this endpoint."
            )
        return user
    return role_checker
