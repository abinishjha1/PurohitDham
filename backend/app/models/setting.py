"""
Platform settings — a typed key/value store the admin fully controls.

Every global, non-tabular piece of the site (name, tagline, contact details,
social links, hero copy, SEO defaults, business rules) lives here instead of
being hardcoded. `is_public` decides whether a setting is exposed to the
unauthenticated frontend, so business-only values never leak.
"""

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class PlatformSetting(BaseModel):
    """A single editable configuration value."""

    __tablename__ = "platform_settings"

    key: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    value: Mapped[str | None] = mapped_column(Text, nullable=True)
    # How the frontend/admin should interpret + edit `value`.
    # string | number | boolean | json | url | color | textarea
    value_type: Mapped[str] = mapped_column(String(20), default="string")
    # Logical grouping for the admin UI: general | contact | social | hero | seo | business
    group: Mapped[str] = mapped_column(String(50), default="general", index=True)
    label: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # If False, this setting is NEVER returned by the public settings endpoint.
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    def __repr__(self) -> str:
        return f"<PlatformSetting {self.key}={self.value!r}>"
