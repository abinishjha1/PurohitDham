# API Documentation

## Base URL

- **Development:** `http://localhost:8000/api/v1`
- **Production:** `https://api.purohitdham.com/api/v1`

## Interactive Docs

In development mode, interactive API documentation is available at:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## Authentication

All authenticated endpoints require an `Authorization: Bearer <access_token>` header.

## Common Response Format

### Success
```json
{
  "items": [...],
  "total": 50,
  "page": 1,
  "page_size": 20,
  "total_pages": 3
}
```

### Error
```json
{
  "detail": "Human-readable error message",
  "error_code": "ERROR_CODE",
  "fields": { "field_name": "Field-specific error" }
}
```

## Endpoints

*Detailed endpoint documentation will be added as APIs are implemented in Phases 4-8.*

### Overview

| Module | Prefix | Auth | Implemented |
|---|---|---|---|
| Health | `/health` | No | ✅ Phase 2 |
| Auth | `/api/v1/auth/` | Mixed | ⬜ Phase 4 |
| Users | `/api/v1/users/` | Yes | ⬜ Phase 4 |
| Pujas | `/api/v1/pujas/` | No | ⬜ Phase 5 |
| Pandits | `/api/v1/pandits/` | No | ⬜ Phase 6 |
| Bookings | `/api/v1/bookings/` | Yes | ⬜ Phase 7 |
| Payments | `/api/v1/payments/` | Mixed | ⬜ Phase 8 |
| Reviews | `/api/v1/reviews/` | Yes | ⬜ Phase 5 |
| Admin | `/api/v1/admin/` | Admin | ⬜ Phase 11 |
