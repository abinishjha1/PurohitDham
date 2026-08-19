# Database Design

> Full database schema documentation. See Phase 1 architecture document for ER diagram and detailed column specs.

## Tables

| Table | Purpose |
|---|---|
| `users` | All user accounts (customers, pandits, admins) |
| `customer_profiles` | Customer-specific fields (gotra, preferred language) |
| `pandit_profiles` | Pandit-specific fields (bio, experience, ratings) |
| `pandit_verification` | Verification workflow documents and status |
| `puja_categories` | Puja service categories |
| `puja_services` | Individual puja services with pricing |
| `pandit_services` | Junction: which pandits offer which pujas |
| `pandit_availability` | Recurring weekly availability slots |
| `addresses` | User addresses with optional geocoding |
| `bookings` | Core booking records |
| `booking_status_history` | Audit trail for all status changes |
| `payments` | Payment records linked 1:1 to bookings |
| `payment_transactions` | Detailed payment event log |
| `reviews` | Customer reviews of pandits (one per booking) |
| `notifications` | In-app notifications |
| `support_tickets` | Customer support / dispute tickets |
| `audit_logs` | System-wide audit trail |

## Conventions

- All primary keys are UUID v4
- All tables include `created_at` and `updated_at` timestamps (except append-only log tables)
- Foreign keys use `ON DELETE RESTRICT` by default
- Enum types are PostgreSQL native ENUMs
- Indexes on all foreign keys and commonly filtered columns

## Schema Details

*Detailed column definitions will be added when SQLAlchemy models are created in Phase 3.*
