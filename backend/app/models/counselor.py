"""SQLAlchemy model for counselor professional profiles."""

from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Uuid

from app.db.db import Base


class Counselor(Base):
    __tablename__ = "counselors"
    __table_args__ = (
        CheckConstraint("years_of_experience >= 0", name="ck_counselors_experience_positive"),
    )

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)

    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    professional_title: Mapped[str] = mapped_column(String(150), nullable=False)
    work_email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    work_phone: Mapped[str] = mapped_column(String(30), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    license_number: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    issuing_body: Mapped[str] = mapped_column(String(150), nullable=False)
    specialization: Mapped[str] = mapped_column(String(200), nullable=False)
    years_of_experience: Mapped[int] = mapped_column(Integer, nullable=False)
    organization: Mapped[str] = mapped_column(String(200), nullable=False)

    work_address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    service_mode: Mapped[str] = mapped_column(String(30), nullable=False)
    availability: Mapped[str] = mapped_column(String(200), nullable=False)

    verification_status: Mapped[str] = mapped_column(
        String(30), nullable=False, default="pending"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=lambda: datetime.now(timezone.utc),
    )
