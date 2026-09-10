"""Password and cookie-based JWT authentication helpers."""

from datetime import datetime, timedelta, timezone
import hashlib
import os
from pathlib import Path
import secrets
from typing import Annotated, Any
from uuid import UUID

import jwt
from dotenv import load_dotenv
from fastapi import Cookie, Depends, HTTPException, status
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from sqlalchemy.orm import Session

from app.db.db import get_db
from app.models import Admin, Counselor, Victim


load_dotenv(Path(__file__).resolve().parents[1] / ".env")

ACCESS_TOKEN_COOKIE = "access_token"
DEFAULT_JWT_ALGORITHM = "HS256"
DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES = 60

CurrentUser = Victim | Counselor | Admin


def hash_password(password: str) -> str:
    """Return a salted scrypt hash; never persist the plaintext password."""
    salt = secrets.token_bytes(16)
    password_hash = hashlib.scrypt(
        password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1
    )
    return f"{salt.hex()}${password_hash.hex()}"


def verify_password(plain_password: str, stored_password_hash: str) -> bool:
    """Safely compare a plaintext password against a hash created above."""
    try:
        salt_hex, expected_hash_hex = stored_password_hash.split("$", maxsplit=1)
        if len(salt_hex) != 32 or len(expected_hash_hex) != 128:
            return False
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(expected_hash_hex)
        calculated_hash = hashlib.scrypt(
            plain_password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1
        )
    except (TypeError, ValueError):
        return False

    return secrets.compare_digest(calculated_hash, expected_hash)


def _get_jwt_secret() -> str:
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret or len(secret) < 32:
        raise RuntimeError(
            "JWT_SECRET_KEY must be configured with at least 32 random characters."
        )
    return secret


def get_jwt_algorithm() -> str:
    """Return the configured HMAC JWT algorithm used for signing and verification."""
    algorithm = os.getenv("JWT_ALGORITHM", DEFAULT_JWT_ALGORITHM).upper()
    allowed_algorithms = {"HS256", "HS384", "HS512"}
    if algorithm not in allowed_algorithms:
        raise RuntimeError(
            "JWT_ALGORITHM must be one of: HS256, HS384, or HS512."
        )
    return algorithm


def get_access_token_lifetime() -> timedelta:
    try:
        minutes = int(
            os.getenv(
                "JWT_ACCESS_TOKEN_EXPIRE_MINUTES",
                str(DEFAULT_ACCESS_TOKEN_EXPIRE_MINUTES),
            )
        )
    except ValueError as error:
        raise RuntimeError("JWT_ACCESS_TOKEN_EXPIRE_MINUTES must be an integer.") from error
    if minutes <= 0:
        raise RuntimeError("JWT_ACCESS_TOKEN_EXPIRE_MINUTES must be greater than zero.")
    return timedelta(minutes=minutes)


def create_access_token(
    data: dict[str, Any], expires_delta: timedelta | None = None
) -> str:
    """Create a signed JWT containing a subject and role claim."""
    if not data.get("sub") or not data.get("role"):
        raise ValueError("JWT data must include non-empty 'sub' and 'role' claims.")

    now = datetime.now(timezone.utc)
    payload = data.copy()
    payload.update(
        {
            "iat": now,
            "exp": now + (expires_delta or get_access_token_lifetime()),
        }
    )
    return jwt.encode(payload, _get_jwt_secret(), algorithm=get_jwt_algorithm())


def decode_access_token(token: str) -> dict[str, Any]:
    """Verify a JWT's signature and required claims, returning its payload."""
    try:
        return jwt.decode(
            token,
            _get_jwt_secret(),
            algorithms=[get_jwt_algorithm()],
            options={"require": ["exp", "iat", "sub", "role"]},
        )
    except ExpiredSignatureError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session has expired. Please sign in again.",
        ) from error
    except InvalidTokenError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        ) from error


def get_current_user(
    access_token: Annotated[str | None, Cookie(alias=ACCESS_TOKEN_COOKIE)] = None,
    db: Session = Depends(get_db),
) -> CurrentUser:
    """Load the authenticated account identified by the JWT in the access cookie."""
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication is required.",
        )

    payload = decode_access_token(access_token)
    try:
        user_id = UUID(str(payload["sub"]))
    except (KeyError, TypeError, ValueError) as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        ) from error

    user_models: dict[str, type[CurrentUser]] = {
        "victim": Victim,
        "counselor": Counselor,
        "admin": Admin,
    }
    user_model = user_models.get(payload.get("role"))
    if user_model is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    user = db.get(user_model, user_id)
    if user is None or (isinstance(user, Admin) and not user.is_active):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account is unavailable.",
        )
    return user
