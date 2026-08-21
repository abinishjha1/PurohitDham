"""
Location service — read helpers + first-run seed for States & Cities.

Admin create/update/delete lives in the admin router (inline, matching the
existing admin.py style). This module owns the public read shape and the
initial seed so a fresh dev database is immediately usable.
"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.location import City, State
from app.schemas.location import CityResponse, StateResponse, StateWithCities


# ─── SEED DATA: major Indian states + cities ──────────────────────────────────
# A sensible starting set the admin can extend/trim from the panel. Not
# exhaustive by design — the whole point is that locations are editable.

SEED_LOCATIONS: list[dict] = [
    {"name": "Delhi", "name_hi": "दिल्ली", "code": "DL",
     "cities": [("New Delhi", "नई दिल्ली"), ("Dwarka", "द्वारका"), ("Rohini", "रोहिणी"), ("Saket", "साकेत")]},
    {"name": "Uttar Pradesh", "name_hi": "उत्तर प्रदेश", "code": "UP",
     "cities": [("Varanasi", "वाराणसी"), ("Prayagraj", "प्रयागराज"), ("Lucknow", "लखनऊ"),
                ("Ayodhya", "अयोध्या"), ("Mathura", "मथुरा"), ("Kanpur", "कानपुर"), ("Noida", "नोएडा")]},
    {"name": "Maharashtra", "name_hi": "महाराष्ट्र", "code": "MH",
     "cities": [("Mumbai", "मुंबई"), ("Pune", "पुणे"), ("Nagpur", "नागपुर"),
                ("Nashik", "नासिक"), ("Thane", "ठाणे")]},
    {"name": "Rajasthan", "name_hi": "राजस्थान", "code": "RJ",
     "cities": [("Jaipur", "जयपुर"), ("Jodhpur", "जोधपुर"), ("Udaipur", "उदयपुर"),
                ("Pushkar", "पुष्कर"), ("Ajmer", "अजमेर")]},
    {"name": "Madhya Pradesh", "name_hi": "मध्य प्रदेश", "code": "MP",
     "cities": [("Ujjain", "उज्जैन"), ("Indore", "इंदौर"), ("Bhopal", "भोपाल"), ("Gwalior", "ग्वालियर")]},
    {"name": "Gujarat", "name_hi": "गुजरात", "code": "GJ",
     "cities": [("Ahmedabad", "अहमदाबाद"), ("Surat", "सूरत"), ("Vadodara", "वडोदरा"), ("Rajkot", "राजकोट")]},
    {"name": "Karnataka", "name_hi": "कर्नाटक", "code": "KA",
     "cities": [("Bengaluru", "बेंगलुरु"), ("Mysuru", "मैसूरु"), ("Mangaluru", "मंगलुरु"), ("Hubballi", "हुबली")]},
    {"name": "Tamil Nadu", "name_hi": "तमिलनाडु", "code": "TN",
     "cities": [("Chennai", "चेन्नई"), ("Madurai", "मदुरै"), ("Coimbatore", "कोयंबटूर"), ("Kanchipuram", "कांचीपुरम")]},
    {"name": "West Bengal", "name_hi": "पश्चिम बंगाल", "code": "WB",
     "cities": [("Kolkata", "कोलकाता"), ("Howrah", "हावड़ा"), ("Siliguri", "सिलीगुड़ी")]},
    {"name": "Bihar", "name_hi": "बिहार", "code": "BR",
     "cities": [("Patna", "पटना"), ("Gaya", "गया"), ("Muzaffarpur", "मुजफ्फरपुर")]},
    {"name": "Telangana", "name_hi": "तेलंगाना", "code": "TG",
     "cities": [("Hyderabad", "हैदराबाद"), ("Warangal", "वारंगल")]},
    {"name": "Haryana", "name_hi": "हरियाणा", "code": "HR",
     "cities": [("Gurugram", "गुरुग्राम"), ("Faridabad", "फरीदाबाद"), ("Kurukshetra", "कुरुक्षेत्र")]},
    {"name": "Punjab", "name_hi": "पंजाब", "code": "PB",
     "cities": [("Amritsar", "अमृतसर"), ("Ludhiana", "लुधियाना"), ("Chandigarh", "चंडीगढ़")]},
    {"name": "Uttarakhand", "name_hi": "उत्तराखंड", "code": "UK",
     "cities": [("Haridwar", "हरिद्वार"), ("Rishikesh", "ऋषिकेश"), ("Dehradun", "देहरादून")]},
]


async def seed_locations_if_empty(db: AsyncSession) -> None:
    """Populate states + cities on a fresh database."""
    existing = await db.execute(select(func.count(State.id)))
    if existing.scalar_one() > 0:
        return

    for s_order, s in enumerate(SEED_LOCATIONS):
        state = State(
            name=s["name"],
            name_hi=s.get("name_hi"),
            code=s.get("code"),
            display_order=s_order,
        )
        db.add(state)
        await db.flush()  # assign state.id for the city FK
        for c_order, (c_name, c_name_hi) in enumerate(s["cities"]):
            db.add(City(
                state_id=state.id,
                name=c_name,
                name_hi=c_name_hi,
                display_order=c_order,
            ))

    await db.commit()


# ─── READ HELPERS ──────────────────────────────────────────────────────────────

def _city_to_response(c: City) -> CityResponse:
    return CityResponse(
        id=str(c.id),
        state_id=str(c.state_id),
        name=c.name,
        name_hi=c.name_hi,
        display_order=c.display_order,
        is_active=c.is_active,
    )


def _state_to_response(s: State, active_only: bool = True) -> StateResponse:
    cities = [c for c in s.cities if c.is_active] if active_only else list(s.cities)
    return StateResponse(
        id=str(s.id),
        name=s.name,
        name_hi=s.name_hi,
        code=s.code,
        display_order=s.display_order,
        is_active=s.is_active,
        city_count=len(cities),
    )


async def get_states_service(db: AsyncSession, include_inactive: bool = False) -> list[StateResponse]:
    """List states (public: active only) with an active-city count."""
    query = select(State).options(selectinload(State.cities)).order_by(State.display_order, State.name)
    if not include_inactive:
        query = query.where(State.is_active.is_(True))
    result = await db.execute(query)
    return [_state_to_response(s, active_only=not include_inactive) for s in result.scalars().all()]


async def get_state_with_cities_service(
    db: AsyncSession, state_id: uuid.UUID, include_inactive: bool = False
) -> StateWithCities | None:
    """One state plus its cities."""
    result = await db.execute(
        select(State).options(selectinload(State.cities)).where(State.id == state_id)
    )
    state = result.scalar_one_or_none()
    if not state:
        return None
    cities = [c for c in state.cities if c.is_active or include_inactive]
    base = _state_to_response(state, active_only=not include_inactive)
    return StateWithCities(**base.model_dump(), cities=[_city_to_response(c) for c in cities])


async def get_cities_service(
    db: AsyncSession, state_id: uuid.UUID | None = None, include_inactive: bool = False
) -> list[CityResponse]:
    """List cities, optionally filtered to one state."""
    query = select(City).order_by(City.display_order, City.name)
    if state_id is not None:
        query = query.where(City.state_id == state_id)
    if not include_inactive:
        query = query.where(City.is_active.is_(True))
    result = await db.execute(query)
    return [_city_to_response(c) for c in result.scalars().all()]
