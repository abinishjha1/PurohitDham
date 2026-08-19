"""
Auth API routes — register, login, Google OAuth, refresh, logout, me.
"""

from fastapi import APIRouter, Cookie, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    TokenRefreshResponse,
    UserResponse,
)
from app.services.auth_service import (
    get_current_user_from_token,
    google_login,
    login_user,
    refresh_access_token,
    register_user,
    _user_to_response,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    """Set the refresh token as an httpOnly secure cookie."""
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,  # Set to True in production (HTTPS)
        samesite="lax",
        max_age=7 * 24 * 60 * 60,  # 7 days
        path="/api/v1/auth",
    )


def _clear_refresh_cookie(response: Response) -> None:
    """Delete the refresh token cookie."""
    response.delete_cookie(
        key="refresh_token",
        path="/api/v1/auth",
    )


# ─── Dependencies ──────────────────────────────────────────────────────────────

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    authorization: str | None = Cookie(None, alias="Authorization"),
) -> User:
    """FastAPI dependency to get the current authenticated user from Bearer token."""
    # This will be overridden by the header-based approach below
    pass


from fastapi import Header

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    authorization: str = Header(..., alias="Authorization"),
) -> User:
    """Extract user from the Authorization: Bearer <token> header."""
    if not authorization.startswith("Bearer "):
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format.",
        )
    token = authorization[7:]  # Strip "Bearer "
    return await get_current_user_from_token(db, token)


# ─── Routes ────────────────────────────────────────────────────────────────────

@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(
    data: RegisterRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Register a new customer or pandit account."""
    result = await register_user(db, data)
    _set_refresh_cookie(response, result.refresh_token)
    return result


@router.post("/login", response_model=AuthResponse)
async def login(
    data: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Login with email and password."""
    result = await login_user(db, data)
    _set_refresh_cookie(response, result.refresh_token)
    return result


@router.post("/google", response_model=AuthResponse)
async def google_auth(
    data: GoogleLoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """Login or register via Google OAuth ID token."""
    result = await google_login(db, data)
    _set_refresh_cookie(response, result.refresh_token)
    return result


@router.post("/refresh", response_model=TokenRefreshResponse)
async def refresh(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
):
    """Refresh the access token using the refresh token cookie."""
    if not refresh_token:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token provided.",
        )
    result = await refresh_access_token(refresh_token)
    return result


@router.post("/logout")
async def logout(response: Response):
    """Logout — clears the refresh token cookie."""
    _clear_refresh_cookie(response)
    return {"detail": "Logged out successfully."}


@router.get("/me", response_model=UserResponse)
async def me(
    current_user: User = Depends(get_current_user),
):
    """Get the currently authenticated user's profile."""
    return _user_to_response(current_user)
