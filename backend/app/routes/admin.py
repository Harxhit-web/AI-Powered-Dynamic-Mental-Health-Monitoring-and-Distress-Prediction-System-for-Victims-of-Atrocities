"""Restricted admin-account bootstrap route."""

import hashlib
import os
import secrets
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.db import get_db
from app.models import Admin


router = APIRouter(prefix="/admins", tags=["Admins"])


class AdminCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=150)
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=12, max_length=256)
    is_superadmin: bool = False


class CreatedAdmin(BaseModel):
    id: UUID
    message: str


def _hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    password_hash = hashlib.scrypt(
        password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1
    )
    return f"{salt.hex()}${password_hash.hex()}"


def _verify_setup_key(x_admin_setup_key: str | None = Header(default=None)) -> None:
    expected_key = os.getenv("ADMIN_SETUP_KEY")
    if not expected_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ADMIN_SETUP_KEY must be configured before creating admin accounts.",
        )
    if not x_admin_setup_key or not secrets.compare_digest(x_admin_setup_key, expected_key):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="A valid X-Admin-Setup-Key header is required.",
        )


@router.post("", response_model=CreatedAdmin, status_code=status.HTTP_201_CREATED)
def create_admin(
    payload: AdminCreate,
    db: Session = Depends(get_db),
    _: None = Depends(_verify_setup_key),
):
    admin = Admin(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=_hash_password(payload.password),
        is_superadmin=payload.is_superadmin,
    )
    try:
        db.add(admin)
        db.commit()
        db.refresh(admin)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An admin account with this email already exists.",
        ) from error

    return {"id": admin.id, "message": "Admin account created successfully."}
