"""
Public settings endpoint — the frontend hydrates global site config from here.

Returns ONLY settings flagged `is_public`, as a flat {key: value} map.
Business-only settings are never exposed. Admin editing lives in
admin_content.py.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.setting_service import get_public_settings_map

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/public")
async def get_public_settings(db: AsyncSession = Depends(get_db)) -> dict[str, str | None]:
    """Flat {key: value} map of all public platform settings."""
    return await get_public_settings_map(db)
