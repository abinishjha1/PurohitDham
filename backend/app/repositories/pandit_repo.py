"""
Pandit Repository — database operations for Pandit profiles.
"""

import uuid
from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.pandit import PanditProfile
from app.models.user import User


class PanditRepository:
    """Handles database queries for PanditProfile."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: uuid.UUID) -> PanditProfile | None:
        """Fetch pandit profile by user ID."""
        result = await self.db.execute(
            select(PanditProfile)
            .options(selectinload(PanditProfile.user))
            .where(PanditProfile.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_id(self, profile_id: uuid.UUID) -> PanditProfile | None:
        """Fetch pandit profile by ID."""
        result = await self.db.execute(
            select(PanditProfile)
            .options(selectinload(PanditProfile.user))
            .where(PanditProfile.id == profile_id)
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        user_id: uuid.UUID,
        title: str,
        gurukul_name: str,
        education_degree: str,
        experience_years: int,
        specializations: list[str],
        languages: list[str],
        street_address: str,
        city: str,
        state: str,
        pincode: str,
        latitude: float | None = None,
        longitude: float | None = None,
        service_radius_km: int = 25,
        vedic_lineage: str | None = None,
        bio: str | None = None,
    ) -> PanditProfile:
        """Create a new pandit profile."""
        profile = PanditProfile(
            user_id=user_id,
            title=title,
            gurukul_name=gurukul_name,
            education_degree=education_degree,
            experience_years=experience_years,
            specializations=specializations,
            languages=languages,
            street_address=street_address,
            city=city,
            state=state,
            pincode=pincode,
            latitude=latitude,
            longitude=longitude,
            service_radius_km=service_radius_km,
            vedic_lineage=vedic_lineage,
            bio=bio,
            is_verified=True,  # Auto-verify in development
        )
        self.db.add(profile)
        await self.db.flush()
        await self.db.refresh(profile)
        return profile

    async def search_pandits(
        self,
        city: str | None = None,
        specialization: str | None = None,
        language: str | None = None,
        limit: int = 30,
        offset: int = 0,
    ) -> tuple[list[PanditProfile], int]:
        """Search pandits by city, puja specialization, or language."""
        query = (
            select(PanditProfile)
            .options(selectinload(PanditProfile.user))
            .where(PanditProfile.is_available.is_(True))
        )

        if city:
            query = query.where(func.lower(PanditProfile.city) == city.strip().lower())

        # Count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        # Paginate
        query = query.order_by(PanditProfile.rating.desc(), PanditProfile.experience_years.desc()).limit(limit).offset(offset)
        result = await self.db.execute(query)
        pandits = list(result.scalars().all())

        # In-memory filter for JSON arrays if queried
        if specialization:
            pandits = [p for p in pandits if any(specialization.lower() in s.lower() for s in (p.specializations or []))]
        if language:
            pandits = [p for p in pandits if any(language.lower() in l.lower() for l in (p.languages or []))]

        return pandits, total
