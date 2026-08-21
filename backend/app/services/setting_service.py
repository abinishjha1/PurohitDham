"""
Platform-settings service — read helpers + first-run seed.

The public endpoint returns only `is_public` settings as a flat {key: value}
map (cheap for the frontend to consume); the admin endpoint returns the full
records with grouping + edit metadata.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.setting import PlatformSetting
from app.schemas.setting import SettingResponse


# ─── SEED DATA ────────────────────────────────────────────────────────────────
# Order matters only for the admin UI. `is_public=False` values never reach the
# unauthenticated site. Business/commission rules are intentionally NOT seeded
# here — that pricing model is still an open decision for the owner.

SEED_SETTINGS: list[dict] = [
    # general
    {"key": "site.name", "value": "Purohitdham", "group": "general", "label": "Site Name",
     "value_type": "string", "is_public": True},
    {"key": "site.tagline", "value": "Book Verified Pandit Ji for Authentic Vedic Pujas",
     "group": "general", "label": "Tagline (English)", "value_type": "string", "is_public": True},
    {"key": "site.tagline_hi", "value": "प्रामाणिक वैदिक पूजा हेतु सत्यापित पंडित जी बुक करें",
     "group": "general", "label": "Tagline (Hindi)", "value_type": "string", "is_public": True},
    {"key": "site.logo_url", "value": "", "group": "general", "label": "Logo URL",
     "value_type": "url", "is_public": True},

    # contact
    {"key": "contact.phone", "value": "+91 98765 43210", "group": "contact", "label": "Support Phone",
     "value_type": "string", "is_public": True},
    {"key": "contact.whatsapp", "value": "+91 98765 43210", "group": "contact", "label": "WhatsApp Number",
     "value_type": "string", "is_public": True},
    {"key": "contact.email", "value": "care@purohitdham.com", "group": "contact", "label": "Support Email",
     "value_type": "string", "is_public": True},
    {"key": "contact.address", "value": "Varanasi, Uttar Pradesh, India", "group": "contact",
     "label": "Office Address", "value_type": "textarea", "is_public": True},

    # social
    {"key": "social.facebook", "value": "", "group": "social", "label": "Facebook URL",
     "value_type": "url", "is_public": True},
    {"key": "social.instagram", "value": "", "group": "social", "label": "Instagram URL",
     "value_type": "url", "is_public": True},
    {"key": "social.youtube", "value": "", "group": "social", "label": "YouTube URL",
     "value_type": "url", "is_public": True},

    # hero (homepage headline block)
    {"key": "hero.title", "value": "Sacred Vedic Rituals, Performed with Devotion",
     "group": "hero", "label": "Hero Title (English)", "value_type": "string", "is_public": True},
    {"key": "hero.title_hi", "value": "श्रद्धा एवं विधि-विधान से संपन्न पवित्र वैदिक अनुष्ठान",
     "group": "hero", "label": "Hero Title (Hindi)", "value_type": "string", "is_public": True},
    {"key": "hero.subtitle",
     "value": "Connect with verified, learned Pandit Ji across India for authentic pujas performed strictly as per the Shastras.",
     "group": "hero", "label": "Hero Subtitle (English)", "value_type": "textarea", "is_public": True},
    {"key": "hero.subtitle_hi",
     "value": "शास्त्रोक्त विधि से पूजा संपन्न कराने हेतु पूरे भारत के सत्यापित एवं विद्वान पंडित जी से जुड़ें।",
     "group": "hero", "label": "Hero Subtitle (Hindi)", "value_type": "textarea", "is_public": True},
    {"key": "hero.cta_label", "value": "Explore Pujas", "group": "hero", "label": "Hero Button Label",
     "value_type": "string", "is_public": True},
    {"key": "hero.cta_url", "value": "/pujas", "group": "hero", "label": "Hero Button Link",
     "value_type": "string", "is_public": True},

    # seo
    {"key": "seo.meta_title", "value": "Purohitdham — Book Verified Pandit Ji Online",
     "group": "seo", "label": "Default Meta Title", "value_type": "string", "is_public": True},
    {"key": "seo.meta_description",
     "value": "Book verified, experienced Pandit Ji for Griha Pravesh, Satyanarayan Katha, Rudrabhishek, weddings and all Vedic pujas. Authentic rituals, transparent pricing.",
     "group": "seo", "label": "Default Meta Description", "value_type": "textarea", "is_public": True},

    # business (public presentation bits only; pricing/commission left undecided)
    {"key": "business.currency_symbol", "value": "₹", "group": "business", "label": "Currency Symbol",
     "value_type": "string", "is_public": True},
    {"key": "business.currency_code", "value": "INR", "group": "business", "label": "Currency Code",
     "value_type": "string", "is_public": True},
]


async def seed_settings_if_empty(db: AsyncSession) -> None:
    """Populate settings on a fresh database."""
    existing = await db.execute(select(PlatformSetting.id).limit(1))
    if existing.first() is not None:
        return

    for order, s in enumerate(SEED_SETTINGS):
        db.add(PlatformSetting(
            key=s["key"],
            value=s.get("value"),
            value_type=s.get("value_type", "string"),
            group=s.get("group", "general"),
            label=s["label"],
            description=s.get("description"),
            is_public=s.get("is_public", True),
            display_order=order,
        ))
    await db.commit()


# ─── READ HELPERS ──────────────────────────────────────────────────────────────

def _to_response(s: PlatformSetting) -> SettingResponse:
    return SettingResponse(
        id=str(s.id),
        key=s.key,
        value=s.value,
        value_type=s.value_type,
        group=s.group,
        label=s.label,
        description=s.description,
        is_public=s.is_public,
        display_order=s.display_order,
    )


async def get_public_settings_map(db: AsyncSession) -> dict[str, str | None]:
    """Flat {key: value} of public settings — for the unauthenticated frontend."""
    result = await db.execute(
        select(PlatformSetting).where(PlatformSetting.is_public.is_(True))
    )
    return {s.key: s.value for s in result.scalars().all()}


async def get_all_settings_service(db: AsyncSession) -> list[SettingResponse]:
    """Full settings list for the admin panel, ordered by group then position."""
    result = await db.execute(
        select(PlatformSetting).order_by(PlatformSetting.group, PlatformSetting.display_order)
    )
    return [_to_response(s) for s in result.scalars().all()]
