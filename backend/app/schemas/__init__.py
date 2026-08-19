"""Schemas package."""
from app.schemas.auth import (
    AuthResponse,
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    TokenRefreshResponse,
    UserResponse,
)
from app.schemas.user import PasswordChange, UserUpdate
from app.schemas.puja import (
    PujaCategoryResponse,
    PujaListResponse,
    PujaServiceDetail,
    PujaServiceSummary,
)
from app.schemas.pandit import (
    PanditListResponse,
    PanditOnboardRequest,
    PanditProfileResponse,
)

__all__ = [
    "AuthResponse",
    "GoogleLoginRequest",
    "LoginRequest",
    "RegisterRequest",
    "TokenRefreshResponse",
    "UserResponse",
    "PasswordChange",
    "UserUpdate",
    "PujaCategoryResponse",
    "PujaListResponse",
    "PujaServiceDetail",
    "PujaServiceSummary",
    "PanditListResponse",
    "PanditOnboardRequest",
    "PanditProfileResponse",
]
