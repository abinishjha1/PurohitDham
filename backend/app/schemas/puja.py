"""
Puja & Vedic Ritual Schemas.
"""

import uuid
from pydantic import BaseModel, Field


class PujaCategoryResponse(BaseModel):
    """Puja Category schema."""
    id: str
    name: str
    name_hi: str
    slug: str
    icon: str
    description: str | None = None
    display_order: int
    puja_count: int = 0

    model_config = {"from_attributes": True}


class PujaServiceSummary(BaseModel):
    """Summary representation of a Puja for listings & cards."""
    id: str
    category_id: str
    name: str
    name_hi: str
    slug: str
    sub_title: str | None = None
    sub_title_hi: str | None = None
    duration_minutes: int
    base_dakshina: float
    icon: str
    badge: str | None = None
    is_popular: bool
    category_name: str | None = None
    benefits: list[str] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class PujaServiceDetail(PujaServiceSummary):
    """Complete representation of a Puja with Vidhi & Samagri."""
    description: str
    description_hi: str
    has_samagri_included: bool
    samagri_list: list[dict] = Field(default_factory=list)
    vidhi_steps: list[dict] = Field(default_factory=list)
    packages: list[dict] = Field(default_factory=list)


class PujaListResponse(BaseModel):
    """Paginated or grouped list of pujas."""
    items: list[PujaServiceSummary]
    total: int
