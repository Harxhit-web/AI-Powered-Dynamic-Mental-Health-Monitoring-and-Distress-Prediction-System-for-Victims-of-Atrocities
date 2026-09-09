"""Database table models grouped by application role."""

from app.schema.admin import Admin
from app.schema.counselor import Counselor
from app.schema.victim import Victim

__all__ = ["Admin", "Counselor", "Victim"]
