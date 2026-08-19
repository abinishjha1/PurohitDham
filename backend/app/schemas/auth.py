"""
Auth request/response schemas.
"""

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Registration request body."""
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=2, max_length=255)
    phone: str | None = Field(default=None, max_length=20)
    role: str = Field(default="CUSTOMER", pattern="^(CUSTOMER|PANDIT)$")


class LoginRequest(BaseModel):
    """Login request body."""
    email: EmailStr
    password: str


class GoogleLoginRequest(BaseModel):
    """Google OAuth login request body."""
    id_token: str
    role: str = Field(default="CUSTOMER", pattern="^(CUSTOMER|PANDIT)$")


class AuthResponse(BaseModel):
    """Auth response with tokens and user info."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class TokenRefreshResponse(BaseModel):
    """Token refresh response."""
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Public user representation."""
    id: str
    email: str
    phone: str | None
    full_name: str
    role: str
    is_active: bool
    is_email_verified: bool
    avatar_url: str | None
    created_at: str

    model_config = {"from_attributes": True}


# Resolve forward reference
AuthResponse.model_rebuild()
