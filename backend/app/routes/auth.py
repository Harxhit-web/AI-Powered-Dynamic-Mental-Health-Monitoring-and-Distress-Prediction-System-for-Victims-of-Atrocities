"""HTTP endpoints for cookie-based account authentication."""

import os
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.db import get_db
from app.models import Admin, Counselor, Victim
from app.services.auth_service import AccountRole, authenticate_account
from app.utils.security import (
    ACCESS_TOKEN_COOKIE,
    CurrentUser,
    create_access_token,
    get_access_token_lifetime,
    get_current_user,
)


router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    role: AccountRole
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8, max_length=256)


class AuthenticatedAccount(BaseModel):
    id: UUID
    full_name: str
    email: str
    role: AccountRole


class LoginResponse(BaseModel):
    message: str
    account: AuthenticatedAccount


class LogoutResponse(BaseModel):
    message: str


def _cookie_secure() -> bool:
    """Use secure cookies in deployed environments; keep local HTTP development usable."""
    return os.getenv("COOKIE_SECURE", "false").strip().lower() in {"1", "true", "yes"}


def _serialize_account(account: CurrentUser, role: AccountRole) -> AuthenticatedAccount:
    email = account.work_email if isinstance(account, Counselor) else account.email
    return AuthenticatedAccount(
        id=account.id,
        full_name=account.full_name,
        email=email,
        role=role,
    )


def _set_access_token_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE,
        value=token,
        max_age=int(get_access_token_lifetime().total_seconds()),
        httponly=True,
        secure=_cookie_secure(),
        samesite="lax",
        path="/",
    )


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """Authenticate a role-specific account and set its JWT as an HTTP-only cookie."""
    account = authenticate_account(db, payload.role, payload.email, payload.password)
    if account is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email, password, or account type.",
        )

    token = create_access_token({"sub": str(account.id), "role": payload.role})
    _set_access_token_cookie(response, token)
    return {
        "message": "Signed in successfully.",
        "account": _serialize_account(account, payload.role),
    }


@router.post("/logout", response_model=LogoutResponse)
def logout(response: Response):
    """Clear the browser's access-token cookie."""
    response.delete_cookie(
        key=ACCESS_TOKEN_COOKIE,
        path="/",
        httponly=True,
        secure=_cookie_secure(),
        samesite="lax",
    )
    return {"message": "Signed out successfully."}


@router.get("/me", response_model=AuthenticatedAccount)
def read_current_account(current_user: CurrentUser = Depends(get_current_user)):
    """Return the account represented by the verified access-token cookie."""
    role: AccountRole
    if isinstance(current_user, Victim):
        role = "victim"
    elif isinstance(current_user, Counselor):
        role = "counselor"
    elif isinstance(current_user, Admin):
        role = "admin"
    else:  # Defensive guard for future account model additions.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )
    return _serialize_account(current_user, role)


@router.get("/profile")
def read_current_profile(current_user: CurrentUser = Depends(get_current_user)):
    """Return the signed-in account's role-specific profile without credentials."""
    if isinstance(current_user, Victim):
        return {
            "id": current_user.id,
            "role": "victim",
            "full_name": current_user.full_name,
            "date_of_birth": current_user.date_of_birth,
            "gender": current_user.gender,
            "primary_language": current_user.primary_language,
            "phone": current_user.phone,
            "email": current_user.email,
            "contact_preference": current_user.contact_preference,
            "safe_contact_hours": current_user.safe_contact_hours,
            "address": current_user.address,
            "city": current_user.city,
            "state": current_user.state,
            "postal_code": current_user.postal_code,
            "country": current_user.country,
            "emergency_name": current_user.emergency_name,
            "emergency_relation": current_user.emergency_relation,
            "emergency_phone": current_user.emergency_phone,
            "emergency_email": current_user.emergency_email,
        }
    if isinstance(current_user, Counselor):
        return {
            "id": current_user.id,
            "role": "counselor",
            "full_name": current_user.full_name,
            "professional_title": current_user.professional_title,
            "work_email": current_user.work_email,
            "work_phone": current_user.work_phone,
            "license_number": current_user.license_number,
            "issuing_body": current_user.issuing_body,
            "specialization": current_user.specialization,
            "years_of_experience": current_user.years_of_experience,
            "organization": current_user.organization,
            "work_address": current_user.work_address,
            "city": current_user.city,
            "state": current_user.state,
            "service_mode": current_user.service_mode,
            "availability": current_user.availability,
            "verification_status": current_user.verification_status,
        }
    if isinstance(current_user, Admin):
        return {
            "id": current_user.id,
            "role": "admin",
            "full_name": current_user.full_name,
            "email": current_user.email,
            "is_superadmin": current_user.is_superadmin,
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication token.",
    )
