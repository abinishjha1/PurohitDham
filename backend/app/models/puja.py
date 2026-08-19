"""
Puja & Vedic Ritual Category and Service models.
"""

import uuid
from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class PujaCategory(BaseModel):
    """Category of Vedic Pujas (e.g. Griha & Vastu, Sanskar, Hawan, Shanti)."""

    __tablename__ = "puja_categories"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name_hi: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    icon: Mapped[str] = mapped_column(String(50), default="🪔")
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    pujas: Mapped[list["PujaService"]] = relationship(
        "PujaService", back_populates="category", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<PujaCategory {self.name} ({self.slug})>"


class PujaService(BaseModel):
    """Specific Puja service offered (e.g. Griha Pravesh, Satyanarayan Katha)."""

    __tablename__ = "puja_services"

    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("puja_categories.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    name_hi: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    sub_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sub_title_hi: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    description_hi: Mapped[str] = mapped_column(Text, nullable=False)

    duration_minutes: Mapped[int] = mapped_column(Integer, default=120)
    base_dakshina: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    has_samagri_included: Mapped[bool] = mapped_column(Boolean, default=True)

    # JSON lists
    samagri_list: Mapped[list[dict]] = mapped_column(JSONB, default=list)
    vidhi_steps: Mapped[list[dict]] = mapped_column(JSONB, default=list)
    benefits: Mapped[list[str]] = mapped_column(JSONB, default=list)
    packages: Mapped[list[dict]] = mapped_column(JSONB, default=list)

    icon: Mapped[str] = mapped_column(String(50), default="🪔")
    badge: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    category: Mapped[PujaCategory] = relationship("PujaCategory", back_populates="pujas")

    def __repr__(self) -> str:
        return f"<PujaService {self.name} (₹{self.base_dakshina})>"
