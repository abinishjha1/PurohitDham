"""
User repository — data access layer for the users table.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, Role


class UserRepository:
    """Handles all database operations for the User model."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        """Fetch user by primary key."""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        """Fetch user by email address."""
        result = await self.db.execute(
            select(User).where(User.email == email.lower())
        )
        return result.scalar_one_or_none()

    async def get_by_google_id(self, google_id: str) -> User | None:
        """Fetch user by Google OAuth ID."""
        result = await self.db.execute(
            select(User).where(User.google_id == google_id)
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        email: str,
        full_name: str,
        role: Role = Role.CUSTOMER,
        password_hash: str | None = None,
        phone: str | None = None,
        google_id: str | None = None,
        avatar_url: str | None = None,
        is_email_verified: bool = False,
    ) -> User:
        """Create a new user."""
        user = User(
            email=email.lower(),
            full_name=full_name,
            role=role,
            password_hash=password_hash,
            phone=phone,
            google_id=google_id,
            avatar_url=avatar_url,
            is_email_verified=is_email_verified,
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def update_last_login(self, user_id: uuid.UUID) -> None:
        """Update the last_login_at timestamp."""
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(last_login_at=datetime.now(timezone.utc))
        )

    async def email_exists(self, email: str) -> bool:
        """Check if an email is already registered."""
        result = await self.db.execute(
            select(User.id).where(User.email == email.lower())
        )
        return result.scalar_one_or_none() is not None
