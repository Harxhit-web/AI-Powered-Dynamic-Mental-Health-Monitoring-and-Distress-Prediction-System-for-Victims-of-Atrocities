"""Database configuration for the API."""

import os
from collections.abc import Generator
from pathlib import Path
from urllib.parse import quote

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.engine import Engine


APP_DIR = Path(__file__).resolve().parent.parent
load_dotenv(APP_DIR / ".env")


def _normalise_database_uri(uri: str) -> str:
    """Percent-encode reserved characters in the password portion of a URI.

    This accepts a common .env mistake such as a literal @ in a PostgreSQL
    password. The preferred form is still to URL-encode it in DATABASE_URI.
    """
    scheme, separator, rest = uri.partition("://")
    if not separator:
        return uri

    authority, slash, path = rest.partition("/")
    user_info, at, host = authority.rpartition("@")
    username, colon, password = user_info.partition(":")
    if not at or not colon:
        return uri

    return f"{scheme}://{username}:{quote(password, safe='%')}@{host}{slash}{path}"


def get_database_uri() -> str:
    database_uri = os.getenv("DATABASE_URI")
    if not database_uri:
        raise RuntimeError("DATABASE_URI is missing. Add it to backend/app/.env.")
    return _normalise_database_uri(database_uri)


engine: Engine = create_engine(
    get_database_uri(),
    pool_pre_ping=True,
    pool_recycle=1800,
)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    """Base class shared by all database tables."""


def get_db() -> Generator[Session, None, None]:
    """Provide one transaction-scoped database session to each API request."""
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def create_database_tables() -> None:
    """Import registered models and create any tables that do not exist yet."""
    import app.models  # noqa: F401 - registers model classes with Base.metadata

    Base.metadata.create_all(bind=engine)


def check_database_connection() -> None:
    """Open a lightweight connection used by the health endpoint."""
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
