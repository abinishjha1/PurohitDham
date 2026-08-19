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
    # Startup — create database tables (development only)
    if settings.is_development:
        from app.database import engine
        from app.models.base import Base
        # Import all models so they register with Base.metadata
        import app.models.user  # noqa: F401

        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

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


# Health check endpoint (outside of versioned API)
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME}


# API v1 router
from app.api.v1.router import api_v1_router  # noqa: E402
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)
