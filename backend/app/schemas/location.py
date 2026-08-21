"""
Location schemas — States & Cities.
"""

from pydantic import BaseModel, Field


# ─── City ─────────────────────────────────────────────────────────────────────

class CityResponse(BaseModel):
    id: str
    state_id: str
    name: str
    name_hi: str | None = None
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class CityCreate(BaseModel):
    state_id: str
    name: str = Field(min_length=1, max_length=100)
    name_hi: str | None = Field(default=None, max_length=100)
    display_order: int = 0
    is_active: bool = True


class CityUpdate(BaseModel):
    state_id: str | None = None
    name: str | None = Field(default=None, min_length=1, max_length=100)
    name_hi: str | None = Field(default=None, max_length=100)
    display_order: int | None = None
    is_active: bool | None = None


# ─── State ────────────────────────────────────────────────────────────────────

class StateResponse(BaseModel):
    id: str
    name: str
    name_hi: str | None = None
    code: str | None = None
    display_order: int
    is_active: bool
    city_count: int = 0

    model_config = {"from_attributes": True}


class StateWithCities(StateResponse):
    cities: list[CityResponse] = Field(default_factory=list)


class StateCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    name_hi: str | None = Field(default=None, max_length=100)
    code: str | None = Field(default=None, max_length=10)
    display_order: int = 0
    is_active: bool = True


class StateUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    name_hi: str | None = Field(default=None, max_length=100)
    code: str | None = Field(default=None, max_length=10)
    display_order: int | None = None
    is_active: bool | None = None
