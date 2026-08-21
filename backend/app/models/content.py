"""
Homepage / marketing content models — each an admin-managed content type.

Everything the visitor sees on the homepage that isn't a puja or a pandit is
modelled here so the admin can add / edit / reorder / hide it without a code
change: the "why choose us" features, testimonials, FAQs, hero & promo
banners, and the trust stat counters.

All text fields carry an optional `_hi` Hindi counterpart (the site is
bilingual); the frontend falls back to English when a translation is blank.
"""

from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class HomeFeature(BaseModel):
    """A "Why choose us" / trust point shown on the homepage."""

    __tablename__ = "home_features"

    icon: Mapped[str] = mapped_column(String(50), default="✨")
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    title_hi: Mapped[str | None] = mapped_column(String(150), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    description_hi: Mapped[str | None] = mapped_column(Text, nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def __repr__(self) -> str:
        return f"<HomeFeature {self.title}>"


class Testimonial(BaseModel):
    """A customer testimonial / review card."""

    __tablename__ = "testimonials"

    author_name: Mapped[str] = mapped_column(String(120), nullable=False)
    author_location: Mapped[str | None] = mapped_column(String(120), nullable=True)
    author_role: Mapped[str | None] = mapped_column(String(120), nullable=True)  # e.g. "Griha Pravesh"
    content: Mapped[str] = mapped_column(Text, nullable=False)
    content_hi: Mapped[str | None] = mapped_column(Text, nullable=True)
    rating: Mapped[int] = mapped_column(Integer, default=5)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def __repr__(self) -> str:
        return f"<Testimonial {self.author_name}>"


class FaqItem(BaseModel):
    """A frequently-asked-question entry."""

    __tablename__ = "faq_items"

    question: Mapped[str] = mapped_column(String(300), nullable=False)
    question_hi: Mapped[str | None] = mapped_column(String(300), nullable=True)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    answer_hi: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str | None] = mapped_column(String(60), nullable=True)  # Booking | Payment | Pandit | ...
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def __repr__(self) -> str:
        return f"<FaqItem {self.question[:40]!r}>"


class Banner(BaseModel):
    """A hero slide, top strip, or promotional banner."""

    __tablename__ = "banners"

    title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    title_hi: Mapped[str | None] = mapped_column(String(200), nullable=True)
    subtitle: Mapped[str | None] = mapped_column(Text, nullable=True)
    subtitle_hi: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    cta_label: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_label_hi: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # Where it renders: hero | top_strip | promo
    placement: Mapped[str] = mapped_column(String(40), default="hero", index=True)
    bg_color: Mapped[str | None] = mapped_column(String(30), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def __repr__(self) -> str:
        return f"<Banner {self.placement} {self.title!r}>"


class StatCounter(BaseModel):
    """A trust statistic (e.g. "500+ Verified Pandits")."""

    __tablename__ = "stat_counters"

    label: Mapped[str] = mapped_column(String(80), nullable=False)
    label_hi: Mapped[str | None] = mapped_column(String(80), nullable=True)
    value: Mapped[str] = mapped_column(String(40), nullable=False)  # "500+", "10,000+"
    icon: Mapped[str] = mapped_column(String(50), default="🕉️")
    display_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def __repr__(self) -> str:
        return f"<StatCounter {self.label}={self.value}>"
