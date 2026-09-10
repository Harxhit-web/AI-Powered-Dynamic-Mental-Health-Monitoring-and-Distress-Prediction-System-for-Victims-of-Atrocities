"""Counselor registration routes."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.db import get_db
from app.models import Counselor
from app.utils.security import hash_password


router = APIRouter(prefix="/counselors", tags=["Counselors"])


class CounselorCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=150)
    professional_title: str = Field(min_length=1, max_length=150)
    work_email: str = Field(min_length=3, max_length=255)
    work_phone: str = Field(min_length=5, max_length=30)
    password: str = Field(min_length=8, max_length=256)
    license_number: str = Field(min_length=1, max_length=120)
    issuing_body: str = Field(min_length=1, max_length=150)
    specialization: str = Field(min_length=1, max_length=200)
    years_of_experience: int = Field(ge=0)
    organization: str = Field(min_length=1, max_length=200)
    work_address: str = Field(min_length=1)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    service_mode: str = Field(min_length=1, max_length=30)
    availability: str = Field(min_length=1, max_length=200)


class CreatedCounselor(BaseModel):
    id: UUID
    verification_status: str
    message: str


@router.post("", response_model=CreatedCounselor, status_code=status.HTTP_201_CREATED)
def create_counselor(payload: CounselorCreate, db: Session = Depends(get_db)):
    counselor = Counselor(
        **payload.model_dump(exclude={"password"}),
        password_hash=hash_password(payload.password),
    )
    try:
        db.add(counselor)
        db.commit()
        db.refresh(counselor)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A counselor with this work email or license number already exists.",
        ) from error

    return {
        "id": counselor.id,
        "verification_status": counselor.verification_status,
        "message": "Counselor profile created and queued for verification.",
    }
