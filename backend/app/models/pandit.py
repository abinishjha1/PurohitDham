"""
Pandit Profile model with Gurukul education, GPS geolocation, and multi-select puja skills.
"""

import uuid
from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class PanditProfile(BaseModel):
    """Detailed profile for a registered Vedic Pandit / Purohit."""

    __tablename__ = "pandit_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(100), default="Acharya")  # e.g. Acharya, Shastri, Veda Murti
    
    # Vedic Education & Lineage
    gurukul_name: Mapped[str] = mapped_column(String(255), nullable=False)
    education_degree: Mapped[str] = mapped_column(String(150), nullable=False)  # e.g. Shastri, Acharya (M.A. Sanskrit), Karmakand
    experience_years: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    vedic_lineage: Mapped[str | None] = mapped_column(String(150), nullable=True)  # e.g. Rigveda / Yajurveda / Samaveda / Atharvaveda
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Multi-select Puja Specializations & Languages
    specializations: Mapped[list[str]] = mapped_column(JSONB, default=list)  # list of puja slugs/names
    languages: Mapped[list[str]] = mapped_column(JSONB, default=list)  # list of languages (Hindi, Sanskrit, etc.)

    # Physical Address
    street_address: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    pincode: Mapped[str] = mapped_column(String(20), nullable=False)

    # Live GPS Geolocation coordinates (for automated nearby radius matching)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    service_radius_km: Mapped[int] = mapped_column(Integer, default=25)  # Service travel radius in KM

    # Identity Verification & Reputation
    id_proof_type: Mapped[str | None] = mapped_column(String(50), nullable=True)  # e.g. AADHAAR, PAN
    id_proof_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)

    rating: Mapped[float] = mapped_column(Float, default=5.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    total_pujas_completed: Mapped[int] = mapped_column(Integer, default=0)

    # Relationship to user
    user = relationship("User", backref="pandit_profile")

    def __repr__(self) -> str:
        return f"<PanditProfile {self.title} user_id={self.user_id} city={self.city}>"
