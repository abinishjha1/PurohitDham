"""
API v1 router — aggregates all v1 route modules.
"""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.pujas import router as pujas_router
from app.api.v1.pandits import router as pandits_router
from app.api.v1.admin import router as admin_router

api_v1_router = APIRouter()

# Auth routes: /api/v1/auth/*
api_v1_router.include_router(auth_router)

# Puja routes: /api/v1/pujas, /api/v1/categories
api_v1_router.include_router(pujas_router)

# Pandit routes: /api/v1/pandits/*
api_v1_router.include_router(pandits_router)

# Master Admin routes: /api/v1/admin/*
api_v1_router.include_router(admin_router)
