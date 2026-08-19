"""
Pandit Service — onboarding, GPS coordinates capture, and directory search.
"""

import uuid
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.pandit import PanditProfile
from app.models.user import Role, User
from app.repositories.pandit_repo import PanditRepository
from app.repositories.user_repo import UserRepository
from app.schemas.pandit import (
    PanditListResponse,
    PanditOnboardRequest,
    PanditProfileResponse,
)


def _pandit_to_response(p: PanditProfile) -> PanditProfileResponse:
    user_name = p.user.full_name if p.user else "Vedic Acharya"
    avatar = p.user.avatar_url if p.user else None
    return PanditProfileResponse(
        id=str(p.id),
        user_id=str(p.user_id),
        full_name=user_name,
        title=p.title,
        gurukul_name=p.gurukul_name,
        education_degree=p.education_degree,
        experience_years=p.experience_years,
        vedic_lineage=p.vedic_lineage,
        bio=p.bio,
        specializations=p.specializations or [],
        languages=p.languages or [],
        city=p.city,
        state=p.state,
        latitude=p.latitude,
        longitude=p.longitude,
        service_radius_km=p.service_radius_km,
        is_verified=p.is_verified,
        is_available=p.is_available,
        rating=float(p.rating),
        review_count=p.review_count,
        total_pujas_completed=p.total_pujas_completed,
        avatar_url=avatar,
    )


async def onboard_pandit_service(
    db: AsyncSession,
    current_user: User,
    data: PanditOnboardRequest,
) -> PanditProfileResponse:
    """Create or update Pandit profile for the current user."""
    repo = PanditRepository(db)

    # Check if profile already exists
    existing = await repo.get_by_user_id(current_user.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Pandit profile already exists for this account.",
        )

    # Update user role to PANDIT if not already
    if current_user.role != Role.PANDIT:
        from sqlalchemy import update
        await db.execute(
            update(User).where(User.id == current_user.id).values(role=Role.PANDIT)
        )
        await db.flush()
        await db.refresh(current_user)

    profile = await repo.create(
        user_id=current_user.id,
        title=data.title,
        gurukul_name=data.gurukul_name,
        education_degree=data.education_degree,
        experience_years=data.experience_years,
        specializations=data.specializations,
        languages=data.languages,
        street_address=data.street_address,
        city=data.city,
        state=data.state,
        pincode=data.pincode,
        latitude=data.latitude,
        longitude=data.longitude,
        service_radius_km=data.service_radius_km,
        vedic_lineage=data.vedic_lineage,
        bio=data.bio,
    )

    # Re-fetch with user loaded
    profile = await repo.get_by_id(profile.id)
    return _pandit_to_response(profile)


async def get_pandit_profile_by_id(db: AsyncSession, profile_id_str: str) -> PanditProfileResponse:
    """Fetch public pandit profile by ID."""
    repo = PanditRepository(db)
    try:
        pid = uuid.UUID(profile_id_str)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid profile ID")

    profile = await repo.get_by_id(pid)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pandit profile not found")

    return _pandit_to_response(profile)


async def search_pandits_service(
    db: AsyncSession,
    city: str | None = None,
    specialization: str | None = None,
    language: str | None = None,
    limit: int = 30,
    offset: int = 0,
) -> PanditListResponse:
    """Search available pandits."""
    repo = PanditRepository(db)
    items, total = await repo.search_pandits(
        city=city,
        specialization=specialization,
        language=language,
        limit=limit,
        offset=offset,
    )
    return PanditListResponse(items=[_pandit_to_response(p) for p in items], total=total)
