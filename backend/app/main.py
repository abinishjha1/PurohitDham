"""
FastAPI application entry point.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.middleware.security_headers import SecurityHeadersMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Startup — create database tables and seed pujas (development only)
    if settings.is_development:
        from app.database import engine, async_session_factory
        from app.models.base import Base
        # Import all models so they register with Base.metadata
        import app.models.user  # noqa: F401
        import app.models.puja  # noqa: F401
        import app.models.pandit  # noqa: F401
        from app.services.puja_service import seed_pujas_and_categories_if_empty

        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Seed initial authentic Vedic pujas and default Super Admin if empty
        async with async_session_factory() as session:
            await seed_pujas_and_categories_if_empty(session)
            from app.services.auth_service import seed_default_admin_if_not_exists
            await seed_default_admin_if_not_exists(session)

    yield
    # Shutdown
    from app.database import engine
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    description="Vedic Services Marketplace — Backend API",
    version="0.1.0",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers middleware
app.add_middleware(SecurityHeadersMiddleware)


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME}


# API v1 router
from app.api.v1.router import api_v1_router  # noqa: E402
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)
