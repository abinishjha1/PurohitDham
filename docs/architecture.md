# Architecture

## Overview

Purohitdham uses a **modular monolith** backend architecture with a **decoupled frontend**.

### Request Flow

```
Client (Web / Android / iOS)
    → API Gateway (Nginx in production)
        → FastAPI Backend
            → API Route (presentation layer — validation, auth check)
                → Service (business logic)
                    → Repository (data access)
                        → PostgreSQL
```

### Key Principles

1. **API-first** — All clients (web, Android, iOS, admin) use the same REST API
2. **Clean separation** — Presentation, business logic, and data access are in separate layers
3. **Dependency injection** — FastAPI's `Depends()` system for loose coupling
4. **Configuration via environment** — No hardcoded secrets or connection strings
5. **Independently deployable** — Frontend, backend, and database can be scaled separately

## Technology Choices

| Component | Choice | Rationale |
|---|---|---|
| FastAPI | High performance async Python framework | Native async, auto-generated OpenAPI docs, Pydantic integration |
| SQLAlchemy 2.0 | Async ORM with modern mapped_column syntax | Type-safe, battle-tested, excellent async support |
| Pydantic v2 | Request/response validation | Rust-powered performance, seamless FastAPI integration |
| Next.js (App Router) | React framework with SSR | SEO-friendly, excellent developer experience, built-in routing |
| PostgreSQL | Primary database | ACID compliance, JSON support, excellent for relational data |
| Redis | Cache and session store | Token blacklisting, rate limiting, query caching |

## Backend Layer Architecture

### API Layer (`app/api/`)
- Route definitions
- Request validation (via Pydantic schemas)
- Authentication/authorization checks
- Response formatting

### Service Layer (`app/services/`)
- All business logic
- State machine validation
- Cross-entity coordination
- Payment verification logic

### Repository Layer (`app/repositories/`)
- Database queries
- CRUD operations
- Query building and filtering
- Pagination

### Core (`app/core/`)
- Security (JWT, password hashing)
- Permissions (RBAC)
- Exceptions
- Logging

### Integrations (`app/integrations/`)
- External service adapters (Razorpay, SMS, Email, Storage)
- Abstracted behind interfaces for testability
