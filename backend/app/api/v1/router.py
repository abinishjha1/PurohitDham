"""
API v1 router — aggregates all v1 route modules.
"""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.pujas import router as pujas_router
from app.api.v1.pandits import router as pandits_router
from app.api.v1.admin import router as admin_router
from app.api.v1.locations import router as locations_router
from app.api.v1.settings import router as settings_router
from app.api.v1.content import router as content_router
from app.api.v1.admin_content import router as admin_content_router

api_v1_router = APIRouter()

# Auth routes: /api/v1/auth/*
api_v1_router.include_router(auth_router)

# Puja routes: /api/v1/pujas, /api/v1/categories
api_v1_router.include_router(pujas_router)

# Pandit routes: /api/v1/pandits/*
api_v1_router.include_router(pandits_router)

# Public dynamic-content routes (unauthenticated reads):
#   /api/v1/locations/*, /api/v1/settings/public, /api/v1/content/*
api_v1_router.include_router(locations_router)
api_v1_router.include_router(settings_router)
api_v1_router.include_router(content_router)

# Master Admin routes: /api/v1/admin/*
api_v1_router.include_router(admin_router)

# Admin content management: /api/v1/admin/* (states, cities, settings, homepage content)
api_v1_router.include_router(admin_content_router)
