"""
Platform setting schemas.
"""

from pydantic import BaseModel, Field


class SettingResponse(BaseModel):
    """Full setting record — used by the admin panel."""
    id: str
    key: str
    value: str | None = None
    value_type: str
    group: str
    label: str
    description: str | None = None
    is_public: bool
    display_order: int

    model_config = {"from_attributes": True}


class SettingCreate(BaseModel):
    key: str = Field(min_length=1, max_length=100)
    value: str | None = None
    value_type: str = "string"
    group: str = "general"
    label: str = Field(min_length=1, max_length=150)
    description: str | None = None
    is_public: bool = True
    display_order: int = 0


class SettingUpdate(BaseModel):
    """Admin edit — every field optional so PATCH only sends what changed."""
    value: str | None = None
    value_type: str | None = None
    group: str | None = None
    label: str | None = Field(default=None, max_length=150)
    description: str | None = None
    is_public: bool | None = None
    display_order: int | None = None


class SettingBulkUpdateItem(BaseModel):
    """One entry in a bulk save from a settings form."""
    key: str
    value: str | None = None
