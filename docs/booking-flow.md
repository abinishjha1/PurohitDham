# Booking Flow

## Customer Flow

1. Customer selects a Puja service
2. Customer views service details (description, duration, price)
3. Customer selects their location (address)
4. Customer selects a date
5. System shows available time slots
6. Customer selects a time slot
7. System shows available Pandits for that service, location, date, and time
8. Customer selects a Pandit
9. Customer reviews booking details and total amount
10. Customer proceeds to payment
11. Razorpay checkout opens
12. Payment is processed
13. **Backend verifies payment** (signature + server-side API call)
14. Booking status: `PENDING` → `PAYMENT_PENDING` → `PAID` → `CONFIRMED`
15. Customer receives confirmation notification

## Pandit Flow

1. Pandit receives a booking notification
2. Pandit reviews booking details
3. Pandit accepts or rejects
4. If accepted: `CONFIRMED` → `PANDIT_ACCEPTED`
5. If rejected: `CONFIRMED` → `PANDIT_REJECTED` → customer can rebook
6. On day of service: `PANDIT_ACCEPTED` → `IN_PROGRESS`
7. After service: `IN_PROGRESS` → `COMPLETED`

## Booking Status State Machine

| From | To | Trigger |
|---|---|---|
| `PENDING` | `PAYMENT_PENDING` | Customer proceeds to pay |
| `PENDING` | `CANCELLED` | Customer cancels before payment |
| `PAYMENT_PENDING` | `PAID` | Backend verifies payment |
| `PAYMENT_PENDING` | `CANCELLED` | Payment timeout / failure |
| `PAID` | `CONFIRMED` | Auto after payment verification |
| `CONFIRMED` | `PANDIT_ACCEPTED` | Pandit accepts |
| `CONFIRMED` | `PANDIT_REJECTED` | Pandit rejects |
| `CONFIRMED` | `CANCELLED` | Customer cancels (per policy) |
| `PANDIT_ACCEPTED` | `IN_PROGRESS` | Pandit starts service |
| `PANDIT_ACCEPTED` | `CANCELLED` | Cancellation (per policy) |
| `PANDIT_REJECTED` | `PENDING` | System reassigns |
| `IN_PROGRESS` | `COMPLETED` | Pandit marks done |
| `CANCELLED` | `REFUND_PENDING` | If payment was made |
| `REFUND_PENDING` | `REFUNDED` | Refund processed |

## Cancellation Policy

| Timing | Refund |
|---|---|
| Before payment | No charge |
| > 48 hours before booking | Full refund |
| 24–48 hours before booking | 50% refund |
| < 24 hours before booking | No refund |
