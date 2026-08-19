"""
Booking and Payment models for the Vedic Services Marketplace.
"""

import enum
import uuid
from datetime import datetime
from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    PANDIT_ACCEPTED = "PANDIT_ACCEPTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"


class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class Booking(BaseModel):
    """Customer Puja Booking record."""

    __tablename__ = "bookings"

    booking_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)

    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    puja_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("puja_services.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    pandit_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("pandit_profiles.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Schedule & Location
    booking_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    muhurat_time: Mapped[str | None] = mapped_column(String(50), nullable=True)  # e.g. "09:30 AM - Abhijit Muhurat"
    
    venue_address: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    pincode: Mapped[str] = mapped_column(String(20), nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Package & Pricing
    package_name: Mapped[str] = mapped_column(String(100), default="Standard Vidhi")
    dakshina_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    samagri_included: Mapped[bool] = mapped_column(Boolean, default=True)

    # Yajman Sankalp details
    yajman_name: Mapped[str] = mapped_column(String(150), nullable=False)
    gotra: Mapped[str | None] = mapped_column(String(100), nullable=True)
    special_requests: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Status tracking
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status"), default=BookingStatus.PENDING, nullable=False, index=True
    )
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    customer = relationship("User", foreign_keys=[customer_id], backref="customer_bookings")
    puja = relationship("PujaService", backref="puja_bookings")
    pandit = relationship("PanditProfile", backref="assigned_bookings")

    def __repr__(self) -> str:
        return f"<Booking {self.booking_number} status={self.status}>"
