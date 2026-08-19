"""
Admin Command Center API Endpoints — restricted to ADMIN and SUPER_ADMIN.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.v1.auth import get_current_user
from app.database import get_db
from app.models.user import Role, User
from app.models.puja import PujaCategory, PujaService
from app.models.pandit import PanditProfile
from app.models.booking import Booking, BookingStatus
from app.schemas.admin import (
    AdminAssignPanditRequest,
    AdminBookingResponse,
    AdminCreatePujaRequest,
    AdminStatsResponse,
    AdminUpdateBookingStatusRequest,
    AdminUpdatePujaRequest,
    AdminUserResponse,
)
from app.schemas.puja import PujaServiceDetail, PujaServiceSummary
from app.schemas.pandit import PanditOnboardRequest, PanditProfileResponse
from app.services.pandit_service import _pandit_to_response
from app.services.puja_service import _puja_to_detail, _puja_to_summary

router = APIRouter(prefix="/admin", tags=["Admin Command Center"])


# ─── SECURITY DEPENDENCY: ONLY ADMIN & SUPER_ADMIN ────────────────────────────

async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the user possesses administrative privileges."""
    if current_user.role not in [Role.ADMIN, Role.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Administrator credentials required.",
        )
    return current_user


# ─── 1. PLATFORM METRICS & STATS ──────────────────────────────────────────────

@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Fetch high-level business analytics for the dashboard."""
    # Active Pujas
    puja_count_res = await db.execute(
        select(func.count(PujaService.id)).where(PujaService.is_active.is_(True))
    )
    active_pujas = puja_count_res.scalar_one()

    # Verified Pandits
    pandit_count_res = await db.execute(
        select(func.count(PanditProfile.id)).where(PanditProfile.is_verified.is_(True))
    )
    verified_pandits = pandit_count_res.scalar_one()

    # Bookings stats
    bookings_res = await db.execute(select(func.count(Booking.id)))
    total_bookings = bookings_res.scalar_one()

    pending_res = await db.execute(
        select(func.count(Booking.id)).where(Booking.status == BookingStatus.PENDING)
    )
    pending_bookings = pending_res.scalar_one()

    completed_res = await db.execute(
        select(func.count(Booking.id)).where(Booking.status == BookingStatus.COMPLETED)
    )
    completed_bookings = completed_res.scalar_one()

    # Revenue sum
    revenue_res = await db.execute(
        select(func.coalesce(func.sum(Booking.dakshina_amount), 0)).where(
            Booking.status.in_([BookingStatus.PAID, BookingStatus.PANDIT_ACCEPTED, BookingStatus.COMPLETED])
        )
    )
    total_revenue = float(revenue_res.scalar_one())

    return AdminStatsResponse(
        total_revenue=total_revenue,
        total_bookings=total_bookings,
        active_pujas=active_pujas,
        verified_pandits=verified_pandits,
        pending_bookings=pending_bookings,
        completed_bookings=completed_bookings,
    )


# ─── 2. PUJA MANAGEMENT (CRUD) ────────────────────────────────────────────────

@router.get("/pujas", response_model=list[PujaServiceSummary])
async def admin_list_all_pujas(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all pujas (active & inactive) with category relations."""
    result = await db.execute(
        select(PujaService)
        .options(selectinload(PujaService.category))
        .order_by(PujaService.created_at.desc())
    )
    pujas = result.scalars().all()
    return [_puja_to_summary(p) for p in pujas]


@router.post("/pujas", response_model=PujaServiceDetail, status_code=status.HTTP_201_CREATED)
async def admin_create_puja(
    data: AdminCreatePujaRequest,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a new Puja card on the website."""
    # Validate category exists
    cat_res = await db.execute(
        select(PujaCategory).where(PujaCategory.id == uuid.UUID(data.category_id))
    )
    category = cat_res.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Category ID")

    # Check slug uniqueness
    existing_slug = await db.execute(
        select(PujaService).where(PujaService.slug == data.slug.strip().lower())
    )
    if existing_slug.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A Puja with this slug already exists.")

    puja = PujaService(
        category_id=category.id,
        name=data.name.strip(),
        name_hi=data.name_hi.strip(),
        slug=data.slug.strip().lower(),
        sub_title=data.sub_title,
        sub_title_hi=data.sub_title_hi,
        description=data.description,
        description_hi=data.description_hi,
        duration_minutes=data.duration_minutes,
        base_dakshina=data.base_dakshina,
        icon=data.icon,
        badge=data.badge,
        is_popular=data.is_popular,
        benefits=data.benefits,
        samagri_list=data.samagri_list,
        vidhi_steps=data.vidhi_steps,
        packages=data.packages,
    )
    db.add(puja)
    await db.commit()

    # Re-fetch with category loaded
    result = await db.execute(
        select(PujaService).options(selectinload(PujaService.category)).where(PujaService.id == puja.id)
    )
    created = result.scalar_one()
    return _puja_to_detail(created)


@router.put("/pujas/{puja_id}", response_model=PujaServiceDetail)
async def admin_update_puja(
    puja_id: str,
    data: AdminUpdatePujaRequest,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update any field of an existing Puja card."""
    pid = uuid.UUID(puja_id)
    result = await db.execute(
        select(PujaService).options(selectinload(PujaService.category)).where(PujaService.id == pid)
    )
    puja = result.scalar_one_or_none()
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(puja, key, value)

    await db.commit()
    await db.refresh(puja)
    return _puja_to_detail(puja)


@router.delete("/pujas/{puja_id}", status_code=status.HTTP_200_OK)
async def admin_delete_puja(
    puja_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Deactivate or remove a Puja from the website."""
    pid = uuid.UUID(puja_id)
    result = await db.execute(select(PujaService).where(PujaService.id == pid))
    puja = result.scalar_one_or_none()
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")

    # Soft-delete by setting is_active = False
    puja.is_active = False
    await db.commit()
    return {"message": f"Puja '{puja.name}' deactivated successfully."}


# ─── 3. PANDIT MANAGEMENT & VERIFICATION ──────────────────────────────────────

@router.get("/pandits", response_model=list[PanditProfileResponse])
async def admin_list_pandits(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all pandits with verification status."""
    result = await db.execute(
        select(PanditProfile)
        .options(selectinload(PanditProfile.user))
        .order_by(PanditProfile.created_at.desc())
    )
    pandits = result.scalars().all()
    return [_pandit_to_response(p) for p in pandits]


@router.patch("/pandits/{pandit_id}/verify", response_model=PanditProfileResponse)
async def admin_toggle_pandit_verification(
    pandit_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Toggle the verified badge for a Pandit."""
    pid = uuid.UUID(pandit_id)
    result = await db.execute(
        select(PanditProfile).options(selectinload(PanditProfile.user)).where(PanditProfile.id == pid)
    )
    pandit = result.scalar_one_or_none()
    if not pandit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pandit profile not found")

    pandit.is_verified = not pandit.is_verified
    await db.commit()
    await db.refresh(pandit)
    return _pandit_to_response(pandit)


# ─── 4. BOOKING MANAGEMENT ────────────────────────────────────────────────────

def _booking_to_response(b: Booking) -> AdminBookingResponse:
    customer_name = b.customer.full_name if b.customer else b.yajman_name
    customer_phone = b.customer.phone if b.customer and b.customer.phone else ""
    customer_email = b.customer.email if b.customer else ""
    puja_name = b.puja.name if b.puja else "Vedic Puja"
    pandit_name = f"{b.pandit.title} {b.pandit.user.full_name}" if b.pandit and b.pandit.user else None

    return AdminBookingResponse(
        id=str(b.id),
        booking_number=b.booking_number,
        customer_id=str(b.customer_id),
        customer_name=customer_name,
        customer_phone=customer_phone,
        customer_email=customer_email,
        puja_id=str(b.puja_id),
        puja_name=puja_name,
        pandit_id=str(b.pandit_id) if b.pandit_id else None,
        pandit_name=pandit_name,
        booking_date=b.booking_date,
        muhurat_time=b.muhurat_time,
        venue_address=b.venue_address,
        city=b.city,
        state=b.state,
        pincode=b.pincode,
        package_name=b.package_name,
        dakshina_amount=float(b.dakshina_amount),
        samagri_included=b.samagri_included,
        yajman_name=b.yajman_name,
        gotra=b.gotra,
        status=b.status,
        admin_notes=b.admin_notes,
        created_at=b.created_at,
    )


@router.get("/bookings", response_model=list[AdminBookingResponse])
async def admin_list_bookings(
    status_filter: BookingStatus | None = Query(default=None),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """View all customer bookings with optional status filter."""
    query = (
        select(Booking)
        .options(
            selectinload(Booking.customer),
            selectinload(Booking.puja),
            selectinload(Booking.pandit).selectinload(PanditProfile.user),
        )
        .order_by(Booking.created_at.desc())
    )

    if status_filter:
        query = query.where(Booking.status == status_filter)

    result = await db.execute(query)
    bookings = result.scalars().all()
    return [_booking_to_response(b) for b in bookings]


@router.patch("/bookings/{booking_id}/status", response_model=AdminBookingResponse)
async def admin_update_booking_status(
    booking_id: str,
    data: AdminUpdateBookingStatusRequest,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Change booking status (e.g. Confirm, Mark Completed, Cancel)."""
    bid = uuid.UUID(booking_id)
    result = await db.execute(
        select(Booking)
        .options(
            selectinload(Booking.customer),
            selectinload(Booking.puja),
            selectinload(Booking.pandit).selectinload(PanditProfile.user),
        )
        .where(Booking.id == bid)
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    booking.status = data.status
    if data.admin_notes is not None:
        booking.admin_notes = data.admin_notes

    await db.commit()
    await db.refresh(booking)
    return _booking_to_response(booking)


@router.patch("/bookings/{booking_id}/assign", response_model=AdminBookingResponse)
async def admin_assign_pandit_to_booking(
    booking_id: str,
    data: AdminAssignPanditRequest,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Assign a Pandit to a booking."""
    bid = uuid.UUID(booking_id)
    pid = uuid.UUID(data.pandit_id)

    # Verify pandit
    pandit_res = await db.execute(select(PanditProfile).where(PanditProfile.id == pid))
    if not pandit_res.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pandit not found")

    result = await db.execute(
        select(Booking)
        .options(
            selectinload(Booking.customer),
            selectinload(Booking.puja),
            selectinload(Booking.pandit).selectinload(PanditProfile.user),
        )
        .where(Booking.id == bid)
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    booking.pandit_id = pid
    booking.status = BookingStatus.PANDIT_ACCEPTED
    await db.commit()
    await db.refresh(booking)
    return _booking_to_response(booking)


# ─── 5. USER MANAGEMENT ───────────────────────────────────────────────────────

@router.get("/users", response_model=list[AdminUserResponse])
async def admin_list_users(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all registered users and their current roles."""
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return [
        AdminUserResponse(
            id=str(u.id),
            email=u.email,
            full_name=u.full_name,
            phone=u.phone,
            role=u.role.value if hasattr(u.role, "value") else str(u.role),
            is_active=u.is_active,
            created_at=u.created_at,
        )
        for u in users
    ]


@router.patch("/users/{user_id}/role")
async def admin_update_user_role(
    user_id: str,
    new_role: str = Query(description="CUSTOMER, PANDIT, ADMIN, SUPER_ADMIN"),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Promote or change a user's role."""
    uid = uuid.UUID(user_id)
    result = await db.execute(select(User).where(User.id == uid))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    try:
        user.role = Role[new_role.upper()]
    except KeyError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role specified")

    await db.commit()
    return {"message": f"User '{user.full_name}' role changed to {new_role}."}
