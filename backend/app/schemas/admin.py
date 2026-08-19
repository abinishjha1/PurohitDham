"""
Admin Management Schemas for Pujas, Pandits, Bookings, and Analytics.
"""

import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from app.models.booking import BookingStatus


class AdminStatsResponse(BaseModel):
    """Platform metrics for the Admin Dashboard."""
    total_revenue: float
    total_bookings: int
    active_pujas: int
    verified_pandits: int
    pending_bookings: int
    completed_bookings: int


class AdminCreatePujaRequest(BaseModel):
    """Payload to create a new Puja directly from Admin Panel."""
    category_id: str
    name: str = Field(min_length=2, max_length=200)
    name_hi: str = Field(min_length=2, max_length=200)
    slug: str = Field(min_length=2, max_length=200)
    sub_title: str | None = None
    sub_title_hi: str | None = None
    description: str
    description_hi: str
    duration_minutes: int = Field(default=120, ge=15)
    base_dakshina: float = Field(ge=0)
    icon: str = "🪔"
    badge: str | None = None
    is_popular: bool = False
    benefits: list[str] = Field(default_factory=list)
    samagri_list: list[dict] = Field(default_factory=list)
    vidhi_steps: list[dict] = Field(default_factory=list)
    packages: list[dict] = Field(default_factory=list)


class AdminUpdatePujaRequest(BaseModel):
    """Payload to update an existing Puja."""
    name: str | None = None
    name_hi: str | None = None
    sub_title: str | None = None
    sub_title_hi: str | None = None
    description: str | None = None
    description_hi: str | None = None
    duration_minutes: int | None = None
    base_dakshina: float | None = None
    icon: str | None = None
    badge: str | None = None
    is_popular: bool | None = None
    is_active: bool | None = None
    benefits: list[str] | None = None
    samagri_list: list[dict] | None = None
    vidhi_steps: list[dict] | None = None
    packages: list[dict] | None = None


class AdminUpdateBookingStatusRequest(BaseModel):
    """Payload to update booking status and notes."""
    status: BookingStatus
    admin_notes: str | None = None


class AdminAssignPanditRequest(BaseModel):
    """Payload to assign a Pandit to a booking."""
    pandit_id: str


class AdminBookingResponse(BaseModel):
    """Detailed booking record for Admin view."""
    id: str
    booking_number: str
    customer_id: str
    customer_name: str
    customer_phone: str
    customer_email: str
    puja_id: str
    puja_name: str
    pandit_id: str | None = None
    pandit_name: str | None = None
    booking_date: datetime
    muhurat_time: str | None = None
    venue_address: str
    city: str
    state: str
    pincode: str
    package_name: str
    dakshina_amount: float
    samagri_included: bool
    yajman_name: str
    gotra: str | None = None
    status: BookingStatus
    admin_notes: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminUserResponse(BaseModel):
    """User summary for Admin User Manager."""
    id: str
    email: str
    full_name: str
    phone: str | None = None
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
