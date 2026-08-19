"""
Pandit Onboarding & Directory API Endpoints.
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.pandit import (
    PanditListResponse,
    PanditOnboardRequest,
    PanditProfileResponse,
)
from app.services.pandit_service import (
    get_pandit_profile_by_id,
    onboard_pandit_service,
    search_pandits_service,
)

router = APIRouter(prefix="/pandits", tags=["Pandits & Acharyas"])


@router.post("/onboard", response_model=PanditProfileResponse, status_code=status.HTTP_201_CREATED)
async def onboard_pandit(
    data: PanditOnboardRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Onboard a registered user as a verified Vedic Pandit.
    Accepts Gurukul education, GPS geolocation, address, multi-select pujas, and languages.
    """
    return await onboard_pandit_service(db, current_user, data)


@router.get("", response_model=PanditListResponse)
async def list_pandits(
    city: str | None = Query(default=None, description="City filter"),
    specialization: str | None = Query(default=None, description="Puja specialization filter"),
    language: str | None = Query(default=None, description="Language filter"),
    limit: int = Query(default=30, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Search and browse verified Gurukul Pandits across India."""
    return await search_pandits_service(
        db,
        city=city,
        specialization=specialization,
        language=language,
        limit=limit,
        offset=offset,
    )


@router.get("/{profile_id}", response_model=PanditProfileResponse)
async def get_pandit_profile(
    profile_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get public profile details of a specific Pandit."""
    return await get_pandit_profile_by_id(db, profile_id)
