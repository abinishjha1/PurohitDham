"""
Location models — admin-managed States and Cities.

These drive every place-picker on the platform (pandit onboarding, booking
venue, service-area filters). Nothing about locations is hardcoded in the
frontend; the admin panel is the single source of truth.
"""

import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class State(BaseModel):
    """An Indian state / union territory the platform operates in."""

    __tablename__ = "states"

    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name_hi: Mapped[str | None] = mapped_column(String(100), nullable=True)
    code: Mapped[str | None] = mapped_column(String(10), nullable=True)  # e.g. "MH", "UP"
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    cities: Mapped[list["City"]] = relationship(
        "City",
        back_populates="state",
        cascade="all, delete-orphan",
        order_by="City.display_order",
    )

    def __repr__(self) -> str:
        return f"<State {self.name}>"


class City(BaseModel):
    """A city / town within a State."""

    __tablename__ = "cities"

    state_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("states.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    name_hi: Mapped[str | None] = mapped_column(String(100), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    state: Mapped[State] = relationship("State", back_populates="cities")

    def __repr__(self) -> str:
        return f"<City {self.name}>"
