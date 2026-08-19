# Purohitdham — Vedic Services Marketplace

A professional online marketplace connecting customers with verified Pandit/Purohit Ji for Hindu/Vedic religious services.

## Architecture

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui |
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Payments** | Razorpay (server-side verification) |

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

## Prerequisites

- **Node.js** >= 20
- **Python** >= 3.11
- **PostgreSQL** 16+ (or use Docker)
- **Redis** 7+ (or use Docker)
- **Docker & Docker Compose** (recommended for local development)

## Quick Start (Docker)

The fastest way to run everything locally:

```bash
# Clone the repository
git clone <repo-url> && cd Purohitdham

# Start all services
docker compose up -d

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Manual Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations (Phase 3+)
# alembic upgrade head

# Start the development server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start the development server
npm run dev
```

## Environment Variables

See [backend/.env.example](backend/.env.example) and [frontend/.env.local.example](frontend/.env.local.example) for all required variables.

> ⚠️ **Never commit `.env` or `.env.local` files.** They contain secrets.

## Project Structure

```
Purohitdham/
├── frontend/          # Next.js web application
├── backend/           # FastAPI REST API
├── docs/              # Documentation
├── docker-compose.yml # Local development environment
└── README.md
```

## Documentation

| Document | Description |
|---|---|
| [Architecture](docs/architecture.md) | System design and technology choices |
| [Database](docs/database.md) | ER diagram, table definitions, relationships |
| [API](docs/api.md) | REST API endpoints and usage |
| [Booking Flow](docs/booking-flow.md) | Booking state machine and business rules |
| [Security](docs/security.md) | Authentication, authorization, and security measures |

## Development Phases

| Phase | Description | Status |
|---|---|---|
| 1 | Architecture & Design | ✅ Complete |
| 2 | Project Structure & Environment | ✅ Complete |
| 3 | Database Models & Migrations | ⬜ Next |
| 4 | Authentication & Authorization | ⬜ |
| 5 | Puja Services | ⬜ |
| 6 | Pandit Management | ⬜ |
| 7 | Booking & Availability | ⬜ |
| 8 | Payment Architecture | ⬜ |
| 9 | Customer Frontend | ⬜ |
| 10 | Pandit Dashboard | ⬜ |
| 11 | Admin Dashboard | ⬜ |
| 12 | Testing & Security Review | ⬜ |
| 13 | Production Deployment | ⬜ |
| 14 | Android API Readiness | ⬜ |

## License

Private — All rights reserved.
