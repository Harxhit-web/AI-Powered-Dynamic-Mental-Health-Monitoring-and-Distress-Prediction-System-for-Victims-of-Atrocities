"""Database operations shared by victim, counselor, and admin authentication."""

from typing import Literal
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models import Admin, Counselor, Victim
from app.utils.security import CurrentUser, hash_password, verify_password


AccountRole = Literal["victim", "counselor", "admin"]
AccountModel = type[Victim] | type[Counselor] | type[Admin]


def get_account_model(role: AccountRole) -> AccountModel:
    """Return the database model associated with a supported account role."""
    models: dict[AccountRole, AccountModel] = {
        "victim": Victim,
        "counselor": Counselor,
        "admin": Admin,
    }
    return models[role]


def get_account_by_id(
    db: Session, role: AccountRole, account_id: UUID
) -> CurrentUser | None:
    """Read one account by its role and UUID."""
    return db.get(get_account_model(role), account_id)


def get_account_by_email(
    db: Session, role: AccountRole, email: str
) -> CurrentUser | None:
    """Read one account by email, ignoring email-address case."""
    model = get_account_model(role)
    email_column = Counselor.work_email if role == "counselor" else model.email
    statement = select(model).where(func.lower(email_column) == email.strip().casefold())
    return db.scalars(statement).one_or_none()


def create_account(db: Session, account: CurrentUser) -> CurrentUser:
    """Persist and return a newly constructed account model."""
    try:
        db.add(account)
        db.commit()
        db.refresh(account)
    except SQLAlchemyError:
        db.rollback()
        raise
    return account


def update_account(
    db: Session, account: CurrentUser, updates: dict[str, object]
) -> CurrentUser:
    """Persist permitted field changes for an existing account."""
    protected_fields = {"id", "created_at", "updated_at", "password_hash"}
    valid_fields = set(account.__mapper__.columns.keys()) - protected_fields
    unknown_fields = set(updates) - valid_fields
    if unknown_fields:
        invalid_fields = ", ".join(sorted(unknown_fields))
        raise ValueError(f"Cannot update account field(s): {invalid_fields}")

    try:
        for field, value in updates.items():
            setattr(account, field, value)
        db.commit()
        db.refresh(account)
    except SQLAlchemyError:
        db.rollback()
        raise
    return account


def update_password(db: Session, account: CurrentUser, password: str) -> CurrentUser:
    """Hash and persist an account password without exposing the hash to callers."""
    try:
        account.password_hash = hash_password(password)
        db.commit()
        db.refresh(account)
    except SQLAlchemyError:
        db.rollback()
        raise
    return account


def delete_account(db: Session, account: CurrentUser) -> None:
    """Delete an account and commit the transaction."""
    try:
        db.delete(account)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise


def authenticate_account(
    db: Session, role: AccountRole, email: str, password: str
) -> CurrentUser | None:
    """Return a valid account for matching credentials, otherwise ``None``."""
    account = get_account_by_email(db, role, email)
    if account is None or (isinstance(account, Admin) and not account.is_active):
        return None
    if not verify_password(password, account.password_hash):
        return None
    return account
