"""
Puja & Category API Endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.puja import (
    PujaCategoryResponse,
    PujaListResponse,
    PujaServiceDetail,
)
from app.services.puja_service import (
    get_all_categories_service,
    get_puja_by_slug_service,
    get_pujas_service,
)

router = APIRouter(tags=["Pujas & Rituals"])


@router.get("/categories", response_model=list[PujaCategoryResponse])
async def list_categories(db: AsyncSession = Depends(get_db)):
    """Get all Puja Categories with ritual counts."""
    return await get_all_categories_service(db)


@router.get("/pujas", response_model=PujaListResponse)
async def list_pujas(
    category: str | None = Query(default=None, description="Category slug filter"),
    search: str | None = Query(default=None, description="Search term in name/description"),
    popular: bool = Query(default=False, description="Filter popular pujas only"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """List and search Vedic Puja services."""
    return await get_pujas_service(
        db,
        category=category,
        search=search,
        is_popular=popular,
        limit=limit,
        offset=offset,
    )


@router.get("/pujas/{slug}", response_model=PujaServiceDetail)
async def get_puja_detail(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    """Get full details of a specific Puja including Vidhi steps and Samagri list."""
    puja = await get_puja_by_slug_service(db, slug)
    if not puja:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Puja ritual not found",
        )
    return puja
