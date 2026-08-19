"""
Puja Repository — database operations for Puja categories and services.
"""

import uuid
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.puja import PujaCategory, PujaService


class PujaRepository:
    """Handles database queries for PujaCategory and PujaService."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_categories(self) -> list[PujaCategory]:
        """Fetch all categories ordered by display_order."""
        result = await self.db.execute(
            select(PujaCategory)
            .options(selectinload(PujaCategory.pujas))
            .order_by(PujaCategory.display_order.asc())
        )
        return list(result.scalars().all())

    async def get_category_by_slug(self, slug: str) -> PujaCategory | None:
        """Fetch category by slug."""
        result = await self.db.execute(
            select(PujaCategory).where(PujaCategory.slug == slug)
        )
        return result.scalar_one_or_none()

    async def get_pujas(
        self,
        category_slug: str | None = None,
        search_query: str | None = None,
        is_popular_only: bool = False,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[PujaService], int]:
        """Query pujas with optional category, search, and popularity filters."""
        query = select(PujaService).options(selectinload(PujaService.category)).where(PujaService.is_active.is_(True))

        if category_slug:
            query = query.join(PujaCategory).where(PujaCategory.slug == category_slug)

        if search_query:
            term = f"%{search_query.lower()}%"
            query = query.where(
                (func.lower(PujaService.name).like(term))
                | (func.lower(PujaService.name_hi).like(term))
                | (func.lower(PujaService.description).like(term))
            )

        if is_popular_only:
            query = query.where(PujaService.is_popular.is_(True))

        # Count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        # Paginate
        query = query.order_by(PujaService.created_at.desc()).limit(limit).offset(offset)
        result = await self.db.execute(query)
        pujas = list(result.scalars().all())

        return pujas, total

    async def get_puja_by_slug(self, slug: str) -> PujaService | None:
        """Fetch a specific puja service by slug with its category."""
        result = await self.db.execute(
            select(PujaService)
            .options(selectinload(PujaService.category))
            .where(PujaService.slug == slug, PujaService.is_active.is_(True))
        )
        return result.scalar_one_or_none()

    async def get_puja_by_id(self, puja_id: uuid.UUID) -> PujaService | None:
        """Fetch puja by UUID."""
        result = await self.db.execute(
            select(PujaService)
            .options(selectinload(PujaService.category))
            .where(PujaService.id == puja_id)
        )
        return result.scalar_one_or_none()

    async def count_all(self) -> int:
        """Count total pujas."""
        result = await self.db.execute(select(func.count(PujaService.id)))
        return result.scalar_one()
