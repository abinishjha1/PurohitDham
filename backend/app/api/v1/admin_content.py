"""
Admin content-management endpoints — full CRUD for every admin-controlled
content type: locations (states/cities), platform settings, and homepage
content (features, testimonials, FAQs, banners, stats).

Mounted under the same `/admin` prefix as admin.py and guarded by the same
`require_admin` dependency, so only ADMIN / SUPER_ADMIN can write. Reads reuse
the service layer with `include_inactive=True` so the panel sees hidden rows.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.admin import require_admin
from app.database import get_db
from app.models.content import Banner, FaqItem, HomeFeature, StatCounter, Testimonial
from app.models.location import City, State
from app.models.setting import PlatformSetting
from app.models.user import User
from app.schemas.content import (
    BannerCreate,
    BannerResponse,
    BannerUpdate,
    FaqCreate,
    FaqResponse,
    FaqUpdate,
    FeatureCreate,
    FeatureResponse,
    FeatureUpdate,
    StatCreate,
    StatResponse,
    StatUpdate,
    TestimonialCreate,
    TestimonialResponse,
    TestimonialUpdate,
)
from app.schemas.location import (
    CityCreate,
    CityResponse,
    CityUpdate,
    StateCreate,
    StateResponse,
    StateUpdate,
)
from app.schemas.setting import (
    SettingBulkUpdateItem,
    SettingCreate,
    SettingResponse,
    SettingUpdate,
)
from app.services.content_service import (
    get_banners_service,
    get_faqs_service,
    get_features_service,
    get_stats_service,
    get_testimonials_service,
)
from app.services.location_service import get_cities_service, get_states_service
from app.services.setting_service import get_all_settings_service

router = APIRouter(prefix="/admin", tags=["Admin — Content Management"])


# ─── SHARED HELPERS ──────────────────────────────────────────────────────────

def _parse_uuid(value: str, label: str = "id") -> uuid.UUID:
    try:
        return uuid.UUID(value)
    except (ValueError, AttributeError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid {label}")


def _apply_updates(obj, data: BaseModel) -> None:
    """Set only the fields the client actually sent (PATCH/PUT semantics)."""
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)


async def _get_or_404(db: AsyncSession, model, obj_id: uuid.UUID, label: str):
    result = await db.execute(select(model).where(model.id == obj_id))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{label} not found")
    return obj


# ══════════════════════════════════════════════════════════════════════════════
# LOCATIONS — STATES
# ══════════════════════════════════════════════════════════════════════════════

async def _state_response(db: AsyncSession, state: State) -> StateResponse:
    count = await db.execute(select(func.count(City.id)).where(City.state_id == state.id))
    return StateResponse(
        id=str(state.id), name=state.name, name_hi=state.name_hi, code=state.code,
        display_order=state.display_order, is_active=state.is_active,
        city_count=count.scalar_one(),
    )


@router.get("/states", response_model=list[StateResponse])
async def admin_list_states(
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    """All states, including inactive ones."""
    return await get_states_service(db, include_inactive=True)


@router.post("/states", response_model=StateResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_state(
    data: StateCreate, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(select(State).where(func.lower(State.name) == data.name.strip().lower()))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A state with this name already exists.")
    state = State(**data.model_dump())
    state.name = state.name.strip()
    db.add(state)
    await db.commit()
    await db.refresh(state)
    return await _state_response(db, state)


@router.put("/states/{state_id}", response_model=StateResponse)
async def admin_update_state(
    state_id: str, data: StateUpdate,
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    state = await _get_or_404(db, State, _parse_uuid(state_id, "state id"), "State")
    _apply_updates(state, data)
    await db.commit()
    await db.refresh(state)
    return await _state_response(db, state)


@router.delete("/states/{state_id}", status_code=status.HTTP_200_OK)
async def admin_delete_state(
    state_id: str, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    """Permanently delete a state and its cities (reference data, safe to remove)."""
    state = await _get_or_404(db, State, _parse_uuid(state_id, "state id"), "State")
    name = state.name
    await db.delete(state)
    await db.commit()
    return {"message": f"State '{name}' and its cities were deleted."}


# ══════════════════════════════════════════════════════════════════════════════
# LOCATIONS — CITIES
# ══════════════════════════════════════════════════════════════════════════════

def _city_response(c: City) -> CityResponse:
    return CityResponse(
        id=str(c.id), state_id=str(c.state_id), name=c.name, name_hi=c.name_hi,
        display_order=c.display_order, is_active=c.is_active,
    )


@router.get("/cities", response_model=list[CityResponse])
async def admin_list_cities(
    state_id: str | None = Query(default=None),
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    """All cities (optionally for one state), including inactive ones."""
    parsed = _parse_uuid(state_id, "state id") if state_id else None
    return await get_cities_service(db, state_id=parsed, include_inactive=True)


@router.post("/cities", response_model=CityResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_city(
    data: CityCreate, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    state_uuid = _parse_uuid(data.state_id, "state id")
    await _get_or_404(db, State, state_uuid, "State")  # parent must exist
    city = City(
        state_id=state_uuid, name=data.name.strip(), name_hi=data.name_hi,
        display_order=data.display_order, is_active=data.is_active,
    )
    db.add(city)
    await db.commit()
    await db.refresh(city)
    return _city_response(city)


@router.put("/cities/{city_id}", response_model=CityResponse)
async def admin_update_city(
    city_id: str, data: CityUpdate,
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    city = await _get_or_404(db, City, _parse_uuid(city_id, "city id"), "City")
    payload = data.model_dump(exclude_unset=True)
    if "state_id" in payload and payload["state_id"] is not None:
        new_state = _parse_uuid(payload["state_id"], "state id")
        await _get_or_404(db, State, new_state, "State")
        payload["state_id"] = new_state
    for key, value in payload.items():
        setattr(city, key, value)
    await db.commit()
    await db.refresh(city)
    return _city_response(city)


@router.delete("/cities/{city_id}", status_code=status.HTTP_200_OK)
async def admin_delete_city(
    city_id: str, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    city = await _get_or_404(db, City, _parse_uuid(city_id, "city id"), "City")
    name = city.name
    await db.delete(city)
    await db.commit()
    return {"message": f"City '{name}' was deleted."}


# ══════════════════════════════════════════════════════════════════════════════
# PLATFORM SETTINGS
# ══════════════════════════════════════════════════════════════════════════════

def _setting_response(s: PlatformSetting) -> SettingResponse:
    return SettingResponse(
        id=str(s.id), key=s.key, value=s.value, value_type=s.value_type, group=s.group,
        label=s.label, description=s.description, is_public=s.is_public, display_order=s.display_order,
    )


@router.get("/settings", response_model=list[SettingResponse])
async def admin_list_settings(
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    """Every setting, grouped, with full edit metadata."""
    return await get_all_settings_service(db)


@router.post("/settings", response_model=SettingResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_setting(
    data: SettingCreate, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(select(PlatformSetting).where(PlatformSetting.key == data.key.strip()))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A setting with this key already exists.")
    setting = PlatformSetting(**data.model_dump())
    setting.key = setting.key.strip()
    db.add(setting)
    await db.commit()
    await db.refresh(setting)
    return _setting_response(setting)


@router.put("/settings/{setting_id}", response_model=SettingResponse)
async def admin_update_setting(
    setting_id: str, data: SettingUpdate,
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    setting = await _get_or_404(db, PlatformSetting, _parse_uuid(setting_id, "setting id"), "Setting")
    _apply_updates(setting, data)
    await db.commit()
    await db.refresh(setting)
    return _setting_response(setting)


@router.patch("/settings/bulk")
async def admin_bulk_update_settings(
    items: list[SettingBulkUpdateItem],
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    """Save many settings at once by key — used by the grouped settings form."""
    updated = 0
    for item in items:
        result = await db.execute(select(PlatformSetting).where(PlatformSetting.key == item.key))
        setting = result.scalar_one_or_none()
        if setting:
            setting.value = item.value
            updated += 1
    await db.commit()
    return {"message": f"{updated} setting(s) updated.", "updated": updated}


@router.delete("/settings/{setting_id}", status_code=status.HTTP_200_OK)
async def admin_delete_setting(
    setting_id: str, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    setting = await _get_or_404(db, PlatformSetting, _parse_uuid(setting_id, "setting id"), "Setting")
    key = setting.key
    await db.delete(setting)
    await db.commit()
    return {"message": f"Setting '{key}' was deleted."}


# ══════════════════════════════════════════════════════════════════════════════
# HOMEPAGE CONTENT — FEATURES ("Why choose us")
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/features", response_model=list[FeatureResponse])
async def admin_list_features(
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    return await get_features_service(db, include_inactive=True)


@router.post("/features", response_model=FeatureResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_feature(
    data: FeatureCreate, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    feature = HomeFeature(**data.model_dump())
    db.add(feature)
    await db.commit()
    await db.refresh(feature)
    return FeatureResponse.model_validate(feature)


@router.put("/features/{feature_id}", response_model=FeatureResponse)
async def admin_update_feature(
    feature_id: str, data: FeatureUpdate,
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    feature = await _get_or_404(db, HomeFeature, _parse_uuid(feature_id, "feature id"), "Feature")
    _apply_updates(feature, data)
    await db.commit()
    await db.refresh(feature)
    return FeatureResponse.model_validate(feature)


@router.delete("/features/{feature_id}", status_code=status.HTTP_200_OK)
async def admin_delete_feature(
    feature_id: str, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    feature = await _get_or_404(db, HomeFeature, _parse_uuid(feature_id, "feature id"), "Feature")
    await db.delete(feature)
    await db.commit()
    return {"message": "Feature deleted."}


# ══════════════════════════════════════════════════════════════════════════════
# HOMEPAGE CONTENT — TESTIMONIALS
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/testimonials", response_model=list[TestimonialResponse])
async def admin_list_testimonials(
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    return await get_testimonials_service(db, include_inactive=True)


@router.post("/testimonials", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_testimonial(
    data: TestimonialCreate, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    testimonial = Testimonial(**data.model_dump())
    db.add(testimonial)
    await db.commit()
    await db.refresh(testimonial)
    return TestimonialResponse.model_validate(testimonial)


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialResponse)
async def admin_update_testimonial(
    testimonial_id: str, data: TestimonialUpdate,
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    testimonial = await _get_or_404(db, Testimonial, _parse_uuid(testimonial_id, "testimonial id"), "Testimonial")
    _apply_updates(testimonial, data)
    await db.commit()
    await db.refresh(testimonial)
    return TestimonialResponse.model_validate(testimonial)


@router.delete("/testimonials/{testimonial_id}", status_code=status.HTTP_200_OK)
async def admin_delete_testimonial(
    testimonial_id: str, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    testimonial = await _get_or_404(db, Testimonial, _parse_uuid(testimonial_id, "testimonial id"), "Testimonial")
    await db.delete(testimonial)
    await db.commit()
    return {"message": "Testimonial deleted."}


# ══════════════════════════════════════════════════════════════════════════════
# HOMEPAGE CONTENT — FAQ
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/faqs", response_model=list[FaqResponse])
async def admin_list_faqs(
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    return await get_faqs_service(db, include_inactive=True)


@router.post("/faqs", response_model=FaqResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_faq(
    data: FaqCreate, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    faq = FaqItem(**data.model_dump())
    db.add(faq)
    await db.commit()
    await db.refresh(faq)
    return FaqResponse.model_validate(faq)


@router.put("/faqs/{faq_id}", response_model=FaqResponse)
async def admin_update_faq(
    faq_id: str, data: FaqUpdate,
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    faq = await _get_or_404(db, FaqItem, _parse_uuid(faq_id, "faq id"), "FAQ")
    _apply_updates(faq, data)
    await db.commit()
    await db.refresh(faq)
    return FaqResponse.model_validate(faq)


@router.delete("/faqs/{faq_id}", status_code=status.HTTP_200_OK)
async def admin_delete_faq(
    faq_id: str, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    faq = await _get_or_404(db, FaqItem, _parse_uuid(faq_id, "faq id"), "FAQ")
    await db.delete(faq)
    await db.commit()
    return {"message": "FAQ deleted."}


# ══════════════════════════════════════════════════════════════════════════════
# HOMEPAGE CONTENT — BANNERS
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/banners", response_model=list[BannerResponse])
async def admin_list_banners(
    placement: str | None = Query(default=None),
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    return await get_banners_service(db, placement=placement, include_inactive=True)


@router.post("/banners", response_model=BannerResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_banner(
    data: BannerCreate, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    banner = Banner(**data.model_dump())
    db.add(banner)
    await db.commit()
    await db.refresh(banner)
    return BannerResponse.model_validate(banner)


@router.put("/banners/{banner_id}", response_model=BannerResponse)
async def admin_update_banner(
    banner_id: str, data: BannerUpdate,
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    banner = await _get_or_404(db, Banner, _parse_uuid(banner_id, "banner id"), "Banner")
    _apply_updates(banner, data)
    await db.commit()
    await db.refresh(banner)
    return BannerResponse.model_validate(banner)


@router.delete("/banners/{banner_id}", status_code=status.HTTP_200_OK)
async def admin_delete_banner(
    banner_id: str, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    banner = await _get_or_404(db, Banner, _parse_uuid(banner_id, "banner id"), "Banner")
    await db.delete(banner)
    await db.commit()
    return {"message": "Banner deleted."}


# ══════════════════════════════════════════════════════════════════════════════
# HOMEPAGE CONTENT — STAT COUNTERS
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/stat-counters", response_model=list[StatResponse])
async def admin_list_stats(
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    return await get_stats_service(db, include_inactive=True)


@router.post("/stat-counters", response_model=StatResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_stat(
    data: StatCreate, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    stat = StatCounter(**data.model_dump())
    db.add(stat)
    await db.commit()
    await db.refresh(stat)
    return StatResponse.model_validate(stat)


@router.put("/stat-counters/{stat_id}", response_model=StatResponse)
async def admin_update_stat(
    stat_id: str, data: StatUpdate,
    admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db),
):
    stat = await _get_or_404(db, StatCounter, _parse_uuid(stat_id, "stat id"), "Stat")
    _apply_updates(stat, data)
    await db.commit()
    await db.refresh(stat)
    return StatResponse.model_validate(stat)


@router.delete("/stat-counters/{stat_id}", status_code=status.HTTP_200_OK)
async def admin_delete_stat(
    stat_id: str, admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)
):
    stat = await _get_or_404(db, StatCounter, _parse_uuid(stat_id, "stat id"), "Stat")
    await db.delete(stat)
    await db.commit()
    return {"message": "Stat deleted."}
