"""
Public homepage-content endpoints.

Read-only and unauthenticated. `/content/homepage` returns everything the
homepage needs in one call; the individual endpoints exist for pages that only
need one content type (e.g. a dedicated FAQ page). Admin editing lives in
admin_content.py.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.content import (
    BannerResponse,
    FaqResponse,
    FeatureResponse,
    HomepageContent,
    StatResponse,
    TestimonialResponse,
)
from app.services.content_service import (
    get_banners_service,
    get_faqs_service,
    get_features_service,
    get_homepage_content_service,
    get_stats_service,
    get_testimonials_service,
)

router = APIRouter(prefix="/content", tags=["Site Content"])


@router.get("/homepage", response_model=HomepageContent)
async def get_homepage(db: AsyncSession = Depends(get_db)):
    """All active homepage content (features, testimonials, FAQs, banners, stats) in one payload."""
    return await get_homepage_content_service(db)


@router.get("/features", response_model=list[FeatureResponse])
async def list_features(db: AsyncSession = Depends(get_db)):
    return await get_features_service(db)


@router.get("/testimonials", response_model=list[TestimonialResponse])
async def list_testimonials(db: AsyncSession = Depends(get_db)):
    return await get_testimonials_service(db)


@router.get("/faqs", response_model=list[FaqResponse])
async def list_faqs(db: AsyncSession = Depends(get_db)):
    return await get_faqs_service(db)


@router.get("/banners", response_model=list[BannerResponse])
async def list_banners(
    placement: str | None = Query(default=None, description="hero | top_strip | promo"),
    db: AsyncSession = Depends(get_db),
):
    return await get_banners_service(db, placement=placement)


@router.get("/stats", response_model=list[StatResponse])
async def list_stats(db: AsyncSession = Depends(get_db)):
    return await get_stats_service(db)
