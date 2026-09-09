"""Victim/survivor registration routes."""

from datetime import date, datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.db import get_db
from app.models import Victim


router = APIRouter(prefix="/victims", tags=["Victims"])


class VictimCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=150)
    date_of_birth: date
    gender: str = Field(min_length=1, max_length=30)
    primary_language: str = Field(min_length=1, max_length=80)
    phone: str = Field(min_length=5, max_length=30)
    email: str = Field(min_length=3, max_length=255)
    contact_preference: str = Field(min_length=1, max_length=30)
    safe_contact_hours: str | None = Field(default=None, max_length=150)
    address: str = Field(min_length=1)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    postal_code: str = Field(min_length=1, max_length=20)
    country: str = Field(min_length=1, max_length=100)
    emergency_name: str = Field(min_length=1, max_length=150)
    emergency_relation: str = Field(min_length=1, max_length=80)
    emergency_phone: str = Field(min_length=5, max_length=30)
    emergency_email: str | None = Field(default=None, max_length=255)
    consent_given: bool


class CreatedVictim(BaseModel):
    id: UUID
    message: str


@router.post("", response_model=CreatedVictim, status_code=status.HTTP_201_CREATED)
def create_victim(payload: VictimCreate, db: Session = Depends(get_db)):
    if not payload.consent_given:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Consent is required to create a care profile.",
        )

    victim = Victim(
        **payload.model_dump(),
        consented_at=datetime.now(timezone.utc),
    )
    try:
        db.add(victim)
        db.commit()
        db.refresh(victim)
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A victim account with this email or phone already exists.",
        ) from error

    return {"id": victim.id, "message": "Victim profile created successfully."}
