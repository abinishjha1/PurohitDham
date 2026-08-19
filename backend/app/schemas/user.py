"""
User profile schemas.
"""

from pydantic import BaseModel, EmailStr, Field


class UserUpdate(BaseModel):
    """User profile update request."""
    full_name: str | None = Field(default=None, min_length=2, max_length=255)
    phone: str | None = Field(default=None, max_length=20)
    avatar_url: str | None = Field(default=None, max_length=500)


class PasswordChange(BaseModel):
    """Password change request."""
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)
