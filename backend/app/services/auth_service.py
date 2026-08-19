"""
Auth service — business logic for registration, login, Google OAuth, and tokens.
"""

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import Role, User
from app.repositories.user_repo import UserRepository
from app.schemas.auth import (
    AuthResponse,
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    TokenRefreshResponse,
    UserResponse,
)


def _user_to_response(user: User) -> UserResponse:
    """Convert a User ORM object to a UserResponse schema."""
    return UserResponse(
        id=str(user.id),
        email=user.email,
        phone=user.phone,
        full_name=user.full_name,
        role=user.role.value,
        is_active=user.is_active,
        is_email_verified=user.is_email_verified,
        avatar_url=user.avatar_url,
        created_at=user.created_at.isoformat() if user.created_at else "",
    )


def _generate_tokens(user: User) -> tuple[str, str]:
    """Generate access and refresh JWT tokens for a user."""
    token_data = {"sub": str(user.id), "role": user.role.value}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    return access_token, refresh_token


async def register_user(
    db: AsyncSession,
    data: RegisterRequest,
) -> AuthResponse:
    """Register a new user with email and password."""
    repo = UserRepository(db)

    # Check for existing email
    if await repo.email_exists(data.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Validate role
    try:
        role = Role(data.role)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be CUSTOMER or PANDIT.",
        )

    # Create user
    user = await repo.create(
        email=data.email,
        full_name=data.full_name,
        role=role,
        password_hash=hash_password(data.password),
        phone=data.phone,
    )

    access_token, refresh_token = _generate_tokens(user)

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=_user_to_response(user),
    )


async def login_user(
    db: AsyncSession,
    data: LoginRequest,
) -> AuthResponse:
    """Authenticate user with email and password."""
    repo = UserRepository(db)

    user = await repo.get_by_email(data.email)
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Contact support.",
        )

    await repo.update_last_login(user.id)

    access_token, refresh_token = _generate_tokens(user)

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=_user_to_response(user),
    )


async def google_login(
    db: AsyncSession,
    data: GoogleLoginRequest,
) -> AuthResponse:
    """Authenticate or register user via Google OAuth ID token."""
    # Verify the Google ID token
    try:
        from google.oauth2 import id_token as google_id_token
        from google.auth.transport import requests as google_requests

        idinfo = google_id_token.verify_oauth2_token(
            data.id_token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token.",
        )

    google_sub = idinfo.get("sub")
    email = idinfo.get("email", "")
    name = idinfo.get("name", "")
    picture = idinfo.get("picture")

    if not google_sub or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account missing required information.",
        )

    repo = UserRepository(db)

    # Check if user already exists by Google ID
    user = await repo.get_by_google_id(google_sub)

    if not user:
        # Check if email is already registered (link accounts)
        user = await repo.get_by_email(email)
        if user:
            # Link Google account to existing user — but don't change password
            from sqlalchemy import update
            from app.models.user import User as UserModel

            await db.execute(
                update(UserModel)
                .where(UserModel.id == user.id)
                .values(
                    google_id=google_sub,
                    is_email_verified=True,
                    avatar_url=user.avatar_url or picture,
                )
            )
            await db.flush()
            await db.refresh(user)
        else:
            # Create new user
            try:
                role = Role(data.role)
            except ValueError:
                role = Role.CUSTOMER

            user = await repo.create(
                email=email,
                full_name=name,
                role=role,
                google_id=google_sub,
                avatar_url=picture,
                is_email_verified=True,
            )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Contact support.",
        )

    await repo.update_last_login(user.id)

    access_token, refresh_token = _generate_tokens(user)

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=_user_to_response(user),
    )


async def refresh_access_token(refresh_token_str: str) -> TokenRefreshResponse:
    """Validate a refresh token and issue a new access token."""
    from jose import JWTError

    try:
        payload = decode_token(refresh_token_str)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token.",
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type.",
        )

    token_data = {"sub": payload["sub"], "role": payload["role"]}
    new_access = create_access_token(token_data)

    return TokenRefreshResponse(access_token=new_access)


async def get_current_user_from_token(
    db: AsyncSession,
    token: str,
) -> User:
    """Decode access token and fetch the user from DB."""
    from jose import JWTError

    try:
        payload = decode_token(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type.",
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload.",
        )

    repo = UserRepository(db)
    try:
        user = await repo.get_by_id(uuid.UUID(user_id_str))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token.",
        )

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or deactivated.",
        )

    return user
