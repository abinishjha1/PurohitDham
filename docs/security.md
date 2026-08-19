# Security

## Authentication

- **Password hashing:** bcrypt with cost factor 12
- **JWT access tokens:** Short-lived (15 minutes), contains `user_id`, `role`, `jti`
- **Refresh tokens:** Long-lived (7 days), stored as SHA-256 hash in Redis
- **Token rotation:** New refresh token issued on each refresh; old one is invalidated

## Authorization

- **RBAC:** Four roles — `CUSTOMER`, `PANDIT`, `ADMIN`, `SUPER_ADMIN`
- **Route-level:** FastAPI dependencies check roles before handler execution
- **Resource-level:** Users can only access their own data (enforced in service layer)

## API Security

| Measure | Implementation |
|---|---|
| CORS | Whitelist frontend origins only |
| Rate limiting | Redis sliding window (configurable per endpoint) |
| Input validation | Pydantic strict types on every endpoint |
| SQL injection | SQLAlchemy parameterized queries |
| XSS | Content-Security-Policy headers, input sanitization |
| CSRF | SameSite=Strict cookies for web; not needed for API-only mobile |
| Security headers | X-Content-Type-Options, X-Frame-Options, HSTS |

## Payment Security

- **Never trust frontend** — Payment success is verified server-side
- **Signature verification** — HMAC-SHA256 of Razorpay response
- **Webhook reconciliation** — Secondary verification channel
- **Amount validation** — Server confirms amount matches booking

## Data Protection

### Never Exposed

- Password hashes
- JWT secrets
- Payment gateway secrets
- Verification documents (served via signed URLs to admins only)
- Internal user IDs in error messages

### Audit Logging

All sensitive operations are logged to the `audit_logs` table:
- Login/logout events
- Booking status changes
- Payment events
- Admin actions
- Profile modifications

Logs never contain passwords, tokens, or payment secrets.
