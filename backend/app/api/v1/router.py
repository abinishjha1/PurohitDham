"""
API v1 router — aggregates all v1 route modules.
"""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router

api_v1_router = APIRouter()

# Auth routes: /api/v1/auth/*
api_v1_router.include_router(auth_router)

# Future routes will be added here:
# api_v1_router.include_router(users_router)
# api_v1_router.include_router(pujas_router)
# api_v1_router.include_router(pandits_router)
# api_v1_router.include_router(bookings_router)
# api_v1_router.include_router(payments_router)
