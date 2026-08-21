# Purohitdham — Codebase Audit

**Date:** 2026-08-21
**Scope:** Full repository — backend (FastAPI), frontend (Next.js 16), docs, deployment config
**Method:** Read every source file; compared implementation against the five design docs and the README phase table. The backend could not be executed in the audit sandbox (the committed `backend/venv` is a macOS build and the sandbox runs Linux/Python 3.10), so backend findings are from source reading and syntax checks rather than runtime testing. The frontend was typechecked and linted directly.

---

## 1. Headline

The project is far more built than the README admits, and far less finished than it looks. Roughly 11,800 lines of real code exist across 24 working API endpoints and 12 pages. The catalogue, pandit directory, authentication, and admin console are genuinely functional. But the transaction at the centre of the product — a customer booking a pandit and paying — does not exist at any layer. There is no booking endpoint, no payment integration, no checkout page, and no customer or pandit dashboard.

The most valuable thing to understand before planning work: this codebase's polish is unevenly distributed. The landing page is the most attractive file in the repository and also the emptiest, built entirely from mock data hardcoded inside the translation file. `src/lib/api/client.ts` and the registration form, by contrast, are careful, competent work. Judging progress by appearance will mislead you in both directions.

## 2. The README phase table is wrong

`README.md:110-125` still marks Phase 3 as next and Phase 4 as not started. Both are substantially built. The table has not been updated since Phase 2 and is now actively misleading — it was the reason this audit was commissioned.

| Phase | README says | Actual state |
|---|---|---|
| 1 — Architecture & Design | Complete | Partly. Two of five docs are stubs; the ER diagram they reference does not exist |
| 2 — Project Structure | Complete | Yes |
| 3 — Database Models & Migrations | **Next** | Models built (5 of 17 tables). **Zero migrations exist** |
| 4 — Auth & Authorization | Not started | **Built and working**, with real security gaps (§5) |
| 5 — Puja Services | Not started | **Built**, catalogue + 10 seeded pujas in 5 categories + admin CRUD |
| 6 — Pandit Management | Not started | **Built**, onboarding with GPS + directory + verification |
| 7 — Booking & Availability | Not started | **Admin-side only.** No customer booking. No availability engine at all |
| 8 — Payment Architecture | Not started | **Nothing.** No Razorpay code, package not installed |
| 9 — Customer Frontend | Not started | Browse-only. No booking, no dashboard |
| 10 — Pandit Dashboard | Not started | **Nothing** beyond the onboarding form |
| 11 — Admin Dashboard | Not started | **Built** — 5 pages, 12 endpoints, the most complete area |
| 12 — Testing & Security | Not started | **Zero tests exist** |
| 13 — Production Deployment | Not started | Nothing production-ready |
| 14 — Android API Readiness | Not started | Nothing |

## 3. The blocking problem: booking and payment

This is the finding that matters more than all the others combined.

On the frontend, `src/lib/api/bookings.ts` and `src/lib/api/payments.ts` exist and call `POST /bookings`, `GET /bookings`, `GET /bookings/{id}`, `POST /bookings/{id}/cancel`, `POST /payments/initiate`, and `POST /payments/verify`. None of those six endpoints exist on the backend — `app/api/v1/router.py` registers only `auth`, `pujas`, `pandits`, and `admin`. Nothing user-visible breaks today only because both client files have zero importers; they are pre-written stubs for a flow nobody built.

The consequence is visible in the UI. `src/app/pujas/[slug]/page.tsx:254` renders a button reading "🪔 Book Pandit Ji Now". It has no `onClick`, no `href`, and no form. It is the primary conversion action in the entire product and it is decoration. Five other buttons on the landing page are dead in the same way (`page.tsx:204`, `268`, `277`, `336`, `454` — the remaining six are wrapped in `<Link>` and work), including the hero search (whose two `<select>` elements are uncontrolled, so there is no search state to submit even if the button worked). Two of the five sit inside `.map()` loops, so eleven dead buttons render on the page.

Admin booking management is real and well-built — `app/api/v1/admin.py:286-375` implements listing, status changes, and pandit assignment against a real `Booking` model. But because no create path exists, `/admin/bookings` can only ever render "No bookings matching filter." A complete feature with no possible input.

Payments are absent at every layer: no `payments.py` router, no `app/integrations/` adapter (the directory holds only `__init__.py`, despite `architecture.md:64-66` requiring Razorpay to sit behind an interface), the `razorpay` package is not in `requirements.txt` and not installed, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set in `.env.local` but read by nothing. There is no Razorpay checkout script anywhere in the frontend.

### The decision that gates everything

Three incompatible booking models exist, and no work can proceed on booking until one is chosen.

| Source | States | Shape |
|---|---|---|
| `docs/booking-flow.md:31-48` (spec) | 11 | 14 defined transitions |
| `frontend/src/types/booking.ts:3-15` | 11 ✅ | `address_id`, `total_amount`, `platform_fee`, `pandit_amount`, `start_time`/`end_time` |
| `frontend/src/types/admin.ts:73` (in use) | 7 | inline `venue_address`/`city`/`state`/`pincode`, `dakshina_amount`, `yajman_name`, `gotra`, `muhurat_time` |
| `backend/app/models/booking.py:15-22` (in use) | 7 | matches `admin.ts` except for `latitude`, `longitude`, `special_requests` |

The spec-correct 11-state enum in `frontend/src/types/booking.ts` is dead code: its only importer is `lib/api/bookings.ts:10`, which has no importers of its own. The 7-state version is what actually runs, and it is missing `PAYMENT_PENDING`, `CONFIRMED`, `PANDIT_REJECTED`, and `REFUND_PENDING`. Those four are not cosmetic: without `PAYMENT_PENDING` there is nowhere to park a booking during checkout, and without `REFUND_PENDING` the refund flow has no state to occupy.

The two models also disagree structurally. The backend uses a denormalised inline address plus Vedic domain fields (`yajman_name`, `gotra`, `muhurat_time`, `package_name`) that are genuinely appropriate for this product. The frontend's dead model uses a normalised `address_id` and a platform-fee split. The backend's version is the better fit for the domain; the frontend's version is the only one that acknowledges the platform needs to earn money.

**Recommendation:** keep the backend's denormalised, domain-rich shape, extend its enum to the full 11 states, and add the fee-split columns from the frontend model. Delete `types/booking.ts` and regenerate it from the backend schema. Because the enum lives in PostgreSQL, adding the four states requires a migration — which brings us to the next problem.

## 4. Zero migrations exist, and schema is created by a dev-only side effect

`backend/alembic/versions/` contains only `.gitkeep`. Alembic is fully configured (`alembic.ini`, an async-aware `env.py` with `target_metadata` wired to `Base.metadata`) and has never been used to generate a single revision.

Instead, `app/main.py:27-28` calls `Base.metadata.create_all` inside the startup lifespan, guarded by the `if settings.is_development` at line 18. This works on a fresh developer machine and cannot work anywhere else. There is no path to production, and no way to alter a column without dropping the database. Every schema change described in §3 is blocked on this.

One detail looks like an accident and is not, which is worth knowing before anyone "fixes" it. The lifespan explicitly imports `app.models.user`, `puja`, and `pandit` (`main.py:22-24`) so they register with `Base.metadata`, and conspicuously omits `app.models.booking`. The `bookings` table still gets created, because `app/models/__init__.py:2-6` imports all five models and Python executes a package `__init__` before any of its submodules — so the `from app.models.base import Base` on line 20 has already registered everything. The three explicit imports are redundant rather than load-bearing, and reordering them changes nothing. Replace them with a single `import app.models` so the file stops advertising a fragility it does not have. The same mechanism is why `alembic/env.py` gets a fully populated `target_metadata` from its lone `from app.models.base import Base`.

Five of the seventeen tables in `docs/database.md` exist: `users`, `pandit_profiles`, `puja_categories`, `puja_services`, `bookings`. Missing are `customer_profiles`, `pandit_verification`, `pandit_services`, `pandit_availability`, `addresses`, `booking_status_history`, `payments`, `payment_transactions`, `reviews`, `notifications`, `support_tickets`, and `audit_logs`. A `PaymentStatus` enum is defined in `models/booking.py:25-29` with no `Payment` model to attach it to.

Two absences are more serious than the raw count suggests. Without `pandit_availability` there is no availability engine, and steps 5 and 7 of the booking flow in `docs/booking-flow.md` — "System shows available time slots" and "System shows available Pandits for that service, location, date, and time" — have nothing to query. Without `booking_status_history` and `audit_logs`, the audit trail that `docs/security.md:45-54` requires for login, booking, payment, and admin events does not exist.

Three schema conventions from `database.md:27-33` are also not being followed: foreign keys should default to `ON DELETE RESTRICT` but the models use `CASCADE` and `SET NULL`; enums should be native PostgreSQL types (mostly honoured); and indexes should cover all foreign keys (mostly honoured).

## 5. Security findings

Authentication works and the token plumbing on the client is unusually good. `src/lib/api/client.ts:44-59` implements a refresh mutex with a queued-request pattern so concurrent 401s trigger one refresh instead of a stampede, and holds the access token in a module variable rather than `localStorage` — a deliberate, correct choice for XSS resistance. Credit where due.

The gaps below are ranked by real risk.

**Redis is entirely unused.** The package is installed, `REDIS_URL` is configured, `docker-compose.yml` runs a Redis 7 container, and `architecture.md:36` assigns it three jobs. Not one line of application code touches it. Three specified controls therefore do not exist:

Refresh tokens are stateless JWTs with a 7-day life. `docs/security.md:3-8` requires them stored as SHA-256 hashes in Redis, rotated on every refresh, with the old token invalidated. `auth_service.py:221-242` validates the incoming token and issues only a new access token — the same refresh token stays valid for its full 7 days. `/auth/logout` clears the cookie and nothing else, so a stolen refresh token survives logout and cannot be revoked by any means. The `jti` claim is minted in `core/security.py` specifically to support access-token denylisting, and is never read.

**There is no rate limiting.** `RATE_LIMIT_LOGIN=5/5m` and `RATE_LIMIT_REGISTER=3/1h` are defined in config and consumed by nothing; `slowapi` is not installed. Login and registration are open to unlimited brute-force. Given hardcoded admin credentials also exist (below), this is the most exploitable finding in the audit.

**Hardcoded super-admin credentials.** `auth_service.py:292-305` seeds `admin@purohitdham.com` with password `Admin@123456` and the `SUPER_ADMIN` role on startup. It is guarded by `is_development`, but the password now lives permanently in git history, and a single `APP_ENV` misconfiguration in production creates a known-credential super-admin on an unthrottled login endpoint. These need to move to environment variables and the account should be created by an explicit CLI command, not a startup side effect.

**`app/core/permissions.py` is a live landmine.** All 64 lines are unusable. `require_roles`, `require_admin`, and `require_authenticated` all depend on `_get_current_user_stub`, which raises `NotImplementedError` with the comment "This will be completed in Phase 4." Phase 4 was completed, but nobody came back — `admin.py:36` defines its own local `require_admin` instead, and the module even re-declares its own `Role` enum rather than using the one in `app/models/user.py`. So the module is dead today, and the first developer who imports it in good faith gets a 500 on every request to that route. Delete it or implement it; do not leave it.

**Frontend route protection is cosmetic.** There is no edge gate anywhere: no `proxy.ts`, which is Next 16's replacement for the now-deprecated `middleware.ts`, and no `middleware.ts` either. `src/app/admin/layout.tsx:27-40` checks the role in a `useEffect` and renders a "Restricted Admin Access" card — but never navigates away; `useRouter()` is assigned at line 24 and never used. The entire admin bundle downloads and executes for any visitor. `/pandit/onboard` has no gate at all: line 48 destructures `user` and `isAuthenticated` and uses neither, so an anonymous visitor completes a three-step GPS form and is told "Onboarding failed. Please ensure you are logged in." The FastAPI `require_admin` dependency is the only real enforcement, which is the correct last line of defence but should not be the only one.

**Cookie flags are not production-safe.** `auth.py:36` hardcodes `secure=False` with a `# Set to True in production` comment, and uses `samesite="lax"` where `security.md:25` specifies `Strict`. Both need to be environment-driven.

One item from the brief turned out to be a **non-issue**, worth recording: no real secrets are committed anywhere. `.env` and `.env.local` are both gitignored and contain only placeholders (`rzp_test_xxxxxxxxxxxx`, `dev-secret-key-change-in-production-abc123xyz789`). A side effect is that `.env.local.example` is *also* gitignored — `frontend/.gitignore:34` matches `.env*`, which the root `!.env.local.example` negation cannot override — so it is never shipped, and it omits `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, which Google login silently degrades without.

## 6. Zero tests

`backend/tests/` contains `__init__.py` and an 18-line `conftest.py` with a single unused `client` fixture. There are no test files. `pytest-cov` is not installed. The frontend has no test setup at all — no Vitest, Jest, or Playwright.

For a project handling payments and holding customer money, this is the finding that should worry you second-most after §3. The refund tiers in `booking-flow.md:50-57` (full refund above 48 hours, 50% between 24 and 48, none below 24) are exactly the kind of boundary arithmetic that is wrong in production and silent about it.

The frontend does typecheck cleanly (`npx tsc --noEmit` exits 0) and a production build has succeeded on the host. ESLint reports 18 errors and 11 warnings which do **not** block the build, since Next 16 no longer runs ESLint during `next build`. Six of those errors are `react-hooks/set-state-in-effect`, and one of them is a genuine bug: `src/contexts/language-context.tsx:18-30` initialises language to Hindi, then reads `localStorage` in an effect, so every user whose saved preference is English sees a flash of Hindi and a second render on every page load. It is not a hydration mismatch — the server render and the first client render agree on Hindi — but it is a real defect, and the fix is to resolve the preference before the first paint.

## 7. Mock data presented as real

`src/app/page.tsx` imports nothing from `@/lib/api` and contains no `useEffect` and no `fetch`. Its eight puja cards and three pandit cards come from `t.services` and `t.pandits` — business data hardcoded inside `src/lib/i18n/translations.ts:194-291` and `:305-339` (Hindi) and `:511-608` and `:622-656` (English).

So the homepage advertises three named priests who exist in no database — "आचार्य पं. विद्याधर शास्त्री", credited to a Varanasi gurukul, with `rating: "४.९८"` and 340 reviews — in two languages, alongside eight pujas whose hardcoded prices disagree with the real catalogue in five of eight cases (Griha Pravesh is ₹4,100 on the homepage and ₹5,100 in the seed data; Navgraha Shanti is ₹2,500 against ₹4,100). Anything an admin creates in `/admin/pujas` is invisible on the homepage.

Similar fiction elsewhere: `admin/page.tsx:14` seeds `active_pujas: 20` into initial state and swallows the API error in an empty `catch`, so a dead backend displays "20 Active Puja Cards" and "₹0 Revenue" as though both were measured. `admin/page.tsx:163-186` renders an entire "System & Security" panel — "API Status ● Healthy", "PostgreSQL Async" — as static JSX with no health check behind it. `admin/pujas/page.tsx:164-175` gives every admin-created puja the same two hardcoded `samagri_list` items, two `vidhi_steps`, and two `packages`, with no UI to edit any of them; since `/pujas/[slug]` renders exactly those fields, the whole "Vedic Vidhi & Samagri" system is boilerplate for anything created through the admin UI. And `admin/pujas/page.tsx:98-99` overwrites `description` with hardcoded placeholder text when opening the edit modal, because the list endpoint returns a summary type with no description field — with the practical result that a puja's description can never be edited after creation.

A grep for `TODO`, `FIXME`, `mock`, `stub`, and `coming soon` returns zero hits across the repository. None of this scaffolding is marked as scaffolding, which is precisely why the project reads as nearly finished.

## 8. Smaller defects worth fixing while nearby

A silent data-corruption bug: `src/app/(auth)/register/page.tsx:67-68` declares `setVedicLineage` and `setBio` and never calls them, and no form inputs exist for either. Every pandit registering through `/register` is submitted with `vedic_lineage` defaulted to "Shukla Yajurveda (शुक्ल यजुर्वेद)" and an empty bio. `/pandit/onboard` has the same defect for lineage — line 253 binds the input's `value` with no `onChange` — though it does have a working bio field. The pandit directory is accumulating false credentials.

Registration is a non-transactional two-call sequence (`register/page.tsx:191-217`): create the user, then create the pandit profile. If the second call fails there is no rollback and no retry path — the user ends up logged in, on the register page, with an account and no profile.

`AVAILABLE_PUJAS` is duplicated between `pandit/onboard/page.tsx:12-30` (17 entries) and `register/page.tsx:13-30` (16 entries, missing `bhoomi-pujan`) and has already drifted. Both are hardcoded and neither updates when an admin adds a puja.

Google Sign-In loads its script via a bare inline `<script async defer>` rather than `next/script` (`login:90`, `register:267`), so the first click on a slow connection reliably fails with "Google Sign-In is not initialized."

Search on `/pujas` and `/pandits` fires a request on every keystroke with no debounce and no abort controller, so out-of-order responses can overwrite newer results.

The API response envelope specified in `docs/api.md:20-38` — `{items, total, page, page_size, total_pages}` for lists and `{detail, error_code, fields}` for errors — is not implemented. Admin endpoints return bare arrays, and `client.ts:107` re-rejects every non-401 error raw, so each call site invents its own handling: six duplicate `err?.response?.data?.detail || "..."` and five swallow the error into a `catch` block containing only a comment. The `ApiError` type at `types/common.ts:11` has zero importers.

Accessibility has one problem directly on the booking path: `pujas/[slug]/page.tsx:218-232` implements the package-tier selector as a `<div onClick>` with no `role`, `tabIndex`, or key handler, so it cannot be operated by keyboard or screen reader. More broadly, ten raw `<select>` elements lack `id`/`htmlFor` association, status and rating are conveyed by bare emoji with no text alternative, and `admin/layout.tsx:86` hides the entire admin sidebar below 768px with no mobile alternative.

Roughly 2,150 lines are dead. Twelve of eighteen shadcn components are unused (1,583 lines) — including `dialog` and `sonner`, while the admin pages use five native `alert()` calls, one `confirm()`, and hand-rolled `<div className="fixed inset-0">` modals with no focus trap or Escape handling. Three of the four custom `vedic/` components are rendered nowhere (442 lines; only `LanguageToggle` is used). The pre-written booking and payment clients and their types add another 134. `next-themes` is pulled in only by the unused `sonner`, and the `.dark` block at `globals.css:87` can never activate because no `ThemeProvider` is mounted. `js-cookie` has zero imports.

There is no data-fetching library. Every one of the twelve pages is `"use client"` with hand-rolled `useState` + `useEffect`; the root `src/app/layout.tsx` is the only server component in the app and it fetches nothing, so there is no server-side data access anywhere, despite `components.json` declaring `"rsc": true`.

Deployment is not production-ready. `frontend/next.config.ts` is the untouched create-next-app stub with no security headers. `frontend/Dockerfile` runs `npm run dev` with no `next build`, and with `COPY . .` and no `.dockerignore` it bakes `.env.local` and host `node_modules` into the image. `docker-compose.yml` runs both services in dev mode and never invokes `alembic upgrade`.

Internationalisation is structurally complete — one `Translations` interface, both `hi` and `en` fully implementing it — and reaches three of twelve pages. `LanguageToggle` is rendered on the homepage only, so there is no way to change language anywhere else. Both auth pages, `/pandits`, `/pandit/onboard`, and all five admin pages are hardcoded English. A Hindi-first user reads a fully Hindi homepage, clicks "रजिस्टर", and lands in a 778-line English-only form. `/pujas` and `/pujas/[slug]` bypass the translation table entirely in favour of roughly thirteen inline `language === "hi" ? ... : ...` ternaries each.

## 9. Note on the design docs

Two of the five docs are thinner than their filenames suggest, which matters for planning: where a doc is silent, divergence in the code is a documentation defect rather than a code defect.

`database.md` (37 lines) lists seventeen table names with one-line purposes and no columns, closing with "Detailed column definitions will be added when SQLAlchemy models are created in Phase 3." `api.md` (56 lines) lists nine route prefixes and defines zero endpoints. `database.md:3` also forward-references a Phase 1 architecture document with an ER diagram that does not exist anywhere in the repository. There is **no payments design document at all** — the entire Razorpay specification is four bullets in `security.md:28-34`.

`booking-flow.md` and `security.md` are the substantive ones and should be treated as binding.

Two spec gaps are worth escalating rather than silently resolving in code. **Commission and payouts do not exist in the specification.** There is no commission rate, no platform-fee field in the backend model, no payouts or settlements table among the seventeen, no mention of Razorpay Route, and no payout schedule or GST/TDS handling. For a marketplace this is the largest hole in the design: "total amount" is the only money concept defined, and nothing splits it between platform and pandit. Second, `PANDIT_REJECTED → PENDING` returns an already-paid booking to the pre-payment state with no rule for the captured funds, and the doc contradicts itself on who drives it — the transition table says "System reassigns" while `booking-flow.md:27` says "customer can rebook."

## 10. Recommended sequence

The ordering below is chosen so that each step unblocks the next and nothing is built twice.

**Step 1 — Establish migrations and settle the booking schema.** Generate the initial Alembic revision from the five existing models, then a second revision that extends `booking_status` to all 11 states, adds the platform-fee split columns, and adds `booking_status_history`. Remove `create_all` from the lifespan and add `alembic upgrade head` to `docker-compose`. Nothing else can proceed cleanly until this exists, and it is the cheapest step.

**Step 2 — Availability.** Add `pandit_availability` and the slot-generation query: recurring weekly slots projected onto a concrete date, sized by `puja_services.duration_minutes`, filtered by service, city or GPS radius, and existing bookings. This is the hardest logic in the product and has the least written about it — the docs specify no slot granularity, no timezone handling, and no locking strategy against two customers booking the same slot. Worth building deliberately, with tests.

**Step 3 — Booking endpoints and the customer flow.** Add `bookings.py` with create, list, detail, and cancel, enforcing the 14 transitions in the service layer as `architecture.md:48` requires, and writing every change to `booking_status_history`. Then build the checkout page and wire the dead "Book Pandit Ji Now" button, and add a customer `/bookings` list. At the end of this step the product works end to end without money.

**Step 4 — Payments.** Add the `Payment` model, the Razorpay adapter behind an interface in `app/integrations/`, order creation, and the three verification paths the spec requires — HMAC signature, a server-side fetch back to Razorpay, and webhook reconciliation with idempotency. Resolve the commission question first; it changes the schema. Test the refund tier boundaries.

**Step 5 — Pandit dashboard.** Until this exists, `PANDIT_ACCEPTED` and `PANDIT_REJECTED` are unreachable from any UI and no pandit can accept a job.

**Step 6 — Close the security gaps.** Redis-backed refresh-token rotation and `jti` denylist, sliding-window rate limiting on login and register, admin credentials out of source, a `proxy.ts` (Next 16's replacement for `middleware.ts`) for real route protection, environment-driven cookie flags, and either implement or delete `core/permissions.py`.

**Step 7 — Replace the mock data.** Point the homepage at the real catalogue, delete the fabricated pandits and prices from `translations.ts`, wire the five dead buttons, and fix the `vedic_lineage`/`bio` corruption bug.

**Step 8 — Tests, then hygiene, then deployment.** Prioritise the refund arithmetic, the state machine, and the payment verification paths. Then the lint errors, the hydration bug, the accessibility items on the booking path, and a real production `Dockerfile` with `.dockerignore` and security headers.

A reasonable alternative to Step 7's placement: doing it earlier is cheap and makes the product demoable to stakeholders sooner. It has no dependencies either way.

## 11. Implementation note

`frontend/AGENTS.md` carries a warning that applies to any frontend work: this is Next.js 16, which has breaking changes relative to older conventions, and the guidance is to read the relevant guide under `node_modules/next/dist/docs/` before writing code rather than relying on remembered patterns. `next lint` no longer exists and ESLint no longer runs during `next build`, so lint has to be invoked explicitly in CI or the 18 existing errors will never be caught.
