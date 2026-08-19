"""
Pandit Profile and Onboarding Schemas.
"""

from pydantic import BaseModel, Field


class PanditOnboardRequest(BaseModel):
    """Payload submitted when a Pandit registers/onboards."""
    title: str = Field(default="Acharya", max_length=100)
    gurukul_name: str = Field(min_length=2, max_length=255)
    education_degree: str = Field(min_length=2, max_length=150)
    experience_years: int = Field(ge=1, le=60)
    vedic_lineage: str | None = Field(default=None, max_length=150)
    bio: str | None = Field(default=None, max_length=2000)

    # Multi-select lists
    specializations: list[str] = Field(min_length=1)  # Puja slugs/names
    languages: list[str] = Field(min_length=1)  # Languages spoken

    # Address
    street_address: str = Field(min_length=3, max_length=255)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    pincode: str = Field(min_length=4, max_length=20)

    # GPS coordinates
    latitude: float | None = None
    longitude: float | None = None
    service_radius_km: int = Field(default=25, ge=1, le=500)


class PanditProfileResponse(BaseModel):
    """Public & authenticated view of a Pandit's profile."""
    id: str
    user_id: str
    full_name: str
    title: str
    gurukul_name: str
    education_degree: str
    experience_years: int
    vedic_lineage: str | None = None
    bio: str | None = None
    specializations: list[str]
    languages: list[str]
    city: str
    state: str
    latitude: float | None = None
    longitude: float | None = None
    service_radius_km: int
    is_verified: bool
    is_available: bool
    rating: float
    review_count: int
    total_pujas_completed: int
    avatar_url: str | None = None

    model_config = {"from_attributes": True}


class PanditListResponse(BaseModel):
    """List of pandits."""
    items: list[PanditProfileResponse]
    total: int
