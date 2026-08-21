"""
Public location endpoints — States & Cities for place-pickers.

Read-only and unauthenticated. Admin create/update/delete lives in
admin_content.py.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.location import CityResponse, StateResponse, StateWithCities
from app.services.location_service import (
    get_cities_service,
    get_state_with_cities_service,
    get_states_service,
)

router = APIRouter(prefix="/locations", tags=["Locations"])


def _parse_uuid(value: str, label: str = "id") -> uuid.UUID:
    try:
        return uuid.UUID(value)
    except (ValueError, AttributeError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid {label}")


@router.get("/states", response_model=list[StateResponse])
async def list_states(db: AsyncSession = Depends(get_db)):
    """All active states with a count of their active cities."""
    return await get_states_service(db)


@router.get("/states/{state_id}", response_model=StateWithCities)
async def get_state(state_id: str, db: AsyncSession = Depends(get_db)):
    """A single state together with its active cities."""
    state = await get_state_with_cities_service(db, _parse_uuid(state_id, "state id"))
    if not state:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="State not found")
    return state


@router.get("/cities", response_model=list[CityResponse])
async def list_cities(
    state_id: str | None = Query(default=None, description="Filter cities by state id"),
    db: AsyncSession = Depends(get_db),
):
    """List active cities, optionally filtered to one state."""
    parsed = _parse_uuid(state_id, "state id") if state_id else None
    return await get_cities_service(db, state_id=parsed)
