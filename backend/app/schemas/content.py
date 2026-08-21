"""
Homepage / marketing content schemas.

One Response / Create / Update trio per content type, plus a single
`HomepageContent` aggregate so the public site can hydrate the whole homepage
in one request.
"""

from pydantic import BaseModel, Field


# ─── HomeFeature ("Why choose us") ──────────────────────────────────────────────

class FeatureResponse(BaseModel):
    id: str
    icon: str
    title: str
    title_hi: str | None = None
    description: str | None = None
    description_hi: str | None = None
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class FeatureCreate(BaseModel):
    icon: str = "✨"
    title: str = Field(min_length=1, max_length=150)
    title_hi: str | None = Field(default=None, max_length=150)
    description: str | None = None
    description_hi: str | None = None
    display_order: int = 0
    is_active: bool = True


class FeatureUpdate(BaseModel):
    icon: str | None = None
    title: str | None = Field(default=None, min_length=1, max_length=150)
    title_hi: str | None = Field(default=None, max_length=150)
    description: str | None = None
    description_hi: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


# ─── Testimonial ────────────────────────────────────────────────────────────────

class TestimonialResponse(BaseModel):
    id: str
    author_name: str
    author_location: str | None = None
    author_role: str | None = None
    content: str
    content_hi: str | None = None
    rating: int
    avatar_url: str | None = None
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class TestimonialCreate(BaseModel):
    author_name: str = Field(min_length=1, max_length=120)
    author_location: str | None = Field(default=None, max_length=120)
    author_role: str | None = Field(default=None, max_length=120)
    content: str = Field(min_length=1)
    content_hi: str | None = None
    rating: int = Field(default=5, ge=1, le=5)
    avatar_url: str | None = Field(default=None, max_length=500)
    display_order: int = 0
    is_active: bool = True


class TestimonialUpdate(BaseModel):
    author_name: str | None = Field(default=None, min_length=1, max_length=120)
    author_location: str | None = Field(default=None, max_length=120)
    author_role: str | None = Field(default=None, max_length=120)
    content: str | None = Field(default=None, min_length=1)
    content_hi: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    avatar_url: str | None = Field(default=None, max_length=500)
    display_order: int | None = None
    is_active: bool | None = None


# ─── FAQ ─────────────────────────────────────────────────────────────────────────

class FaqResponse(BaseModel):
    id: str
    question: str
    question_hi: str | None = None
    answer: str
    answer_hi: str | None = None
    category: str | None = None
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class FaqCreate(BaseModel):
    question: str = Field(min_length=1, max_length=300)
    question_hi: str | None = Field(default=None, max_length=300)
    answer: str = Field(min_length=1)
    answer_hi: str | None = None
    category: str | None = Field(default=None, max_length=60)
    display_order: int = 0
    is_active: bool = True


class FaqUpdate(BaseModel):
    question: str | None = Field(default=None, min_length=1, max_length=300)
    question_hi: str | None = Field(default=None, max_length=300)
    answer: str | None = Field(default=None, min_length=1)
    answer_hi: str | None = None
    category: str | None = Field(default=None, max_length=60)
    display_order: int | None = None
    is_active: bool | None = None


# ─── Banner ─────────────────────────────────────────────────────────────────────

class BannerResponse(BaseModel):
    id: str
    title: str | None = None
    title_hi: str | None = None
    subtitle: str | None = None
    subtitle_hi: str | None = None
    image_url: str | None = None
    cta_label: str | None = None
    cta_label_hi: str | None = None
    cta_url: str | None = None
    placement: str
    bg_color: str | None = None
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class BannerCreate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    title_hi: str | None = Field(default=None, max_length=200)
    subtitle: str | None = None
    subtitle_hi: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    cta_label: str | None = Field(default=None, max_length=80)
    cta_label_hi: str | None = Field(default=None, max_length=80)
    cta_url: str | None = Field(default=None, max_length=500)
    placement: str = "hero"
    bg_color: str | None = Field(default=None, max_length=30)
    display_order: int = 0
    is_active: bool = True


class BannerUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    title_hi: str | None = Field(default=None, max_length=200)
    subtitle: str | None = None
    subtitle_hi: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    cta_label: str | None = Field(default=None, max_length=80)
    cta_label_hi: str | None = Field(default=None, max_length=80)
    cta_url: str | None = Field(default=None, max_length=500)
    placement: str | None = None
    bg_color: str | None = Field(default=None, max_length=30)
    display_order: int | None = None
    is_active: bool | None = None


# ─── StatCounter ─────────────────────────────────────────────────────────────────

class StatResponse(BaseModel):
    id: str
    label: str
    label_hi: str | None = None
    value: str
    icon: str
    display_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class StatCreate(BaseModel):
    label: str = Field(min_length=1, max_length=80)
    label_hi: str | None = Field(default=None, max_length=80)
    value: str = Field(min_length=1, max_length=40)
    icon: str = "🕉️"
    display_order: int = 0
    is_active: bool = True


class StatUpdate(BaseModel):
    label: str | None = Field(default=None, min_length=1, max_length=80)
    label_hi: str | None = Field(default=None, max_length=80)
    value: str | None = Field(default=None, min_length=1, max_length=40)
    icon: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


# ─── Aggregate ───────────────────────────────────────────────────────────────────

class HomepageContent(BaseModel):
    """Everything the public homepage needs, in one payload."""
    features: list[FeatureResponse] = Field(default_factory=list)
    testimonials: list[TestimonialResponse] = Field(default_factory=list)
    faqs: list[FaqResponse] = Field(default_factory=list)
    banners: list[BannerResponse] = Field(default_factory=list)
    stats: list[StatResponse] = Field(default_factory=list)
