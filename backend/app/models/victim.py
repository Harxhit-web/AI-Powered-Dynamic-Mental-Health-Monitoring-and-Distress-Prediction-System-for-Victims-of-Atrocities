"""SQLAlchemy model for victim/survivor care profiles."""

from datetime import date, datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import Boolean, Date, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Uuid

from app.db.db import Base


class Victim(Base):
    __tablename__ = "victims"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)

    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=False)
    gender: Mapped[str] = mapped_column(String(30), nullable=False)
    primary_language: Mapped[str] = mapped_column(String(80), nullable=False)

    phone: Mapped[str] = mapped_column(String(30), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_preference: Mapped[str] = mapped_column(String(30), nullable=False)
    safe_contact_hours: Mapped[str | None] = mapped_column(String(150))

    address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)

    emergency_name: Mapped[str] = mapped_column(String(150), nullable=False)
    emergency_relation: Mapped[str] = mapped_column(String(80), nullable=False)
    emergency_phone: Mapped[str] = mapped_column(String(30), nullable=False)
    emergency_email: Mapped[str | None] = mapped_column(String(255))

    consent_given: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    consented_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
    )
