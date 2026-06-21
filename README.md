# Next Starter

Ship SaaS products on a clean, scalable Next.js 16 foundation — authentication,
billing, transactional email, and local infrastructure wired up from day one.

## Project Overview

Next Starter is a single Next.js application that pairs Server Actions, a
Prisma-backed PostgreSQL database, Better Auth, Stripe billing, and React Email
templates. The architecture centralizes platform concerns and isolates every
feature in its own self-contained module, so the codebase scales without turning
into a tangle of cross-dependencies.

| ![sign-in page](docs/sign-in.png) | ![dashboard-welcome toast](docs/dashboard-welcome.png) | ![dashboard page](docs/dashboard.png) |
|---|---|---|

| ![email sent](docs/email-sent.png) | ![email](docs/email.png) | ![redirecting to stripe toast](docs/redirecting-to-stripe.png) |
|---|---|---|

| ![stripe checkout screen](docs/stripe-checkout-screen.png) | ![cancel subscription dialog](docs/cancel-subscription-dialog.png) | ![stripe subscription cancellation screen](docs/stripe-subscription-cancellation-screen.png) |
|---|---|---|

## Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Database | Prisma + PostgreSQL |
| Auth | Better Auth (email/password + Google OAuth) |
| Payments | Stripe (subscriptions + webhooks) |
| Email | Resend + React Email templates |
| Client State | TanStack Query |
| Validation | Zod v4 |
| Forms | React Hook Form + @hookform/resolvers |
| i18n | next-intl (en + pt-BR) |
| Testing | Vitest + React Testing Library |
| Linting | Biome + TypeScript strict |
| Infrastructure | Docker Compose (Postgres, Prisma Studio, Stripe CLI) |
| CI | Drone + GitHub Actions + SonarCloud |

## Architecture

Next Starter follows a modular **platform + features** pattern — shared
infrastructure stays central, product code stays isolated:

- **Platform** — `src/lib`, `src/providers`, `src/middleware`, `src/database`, `src/utils`: shared infrastructure
- **Features** — `src/features/*`: isolated, self-contained modules (UI, hooks, actions)
- **UI components** — `src/components/ui/` (shadcn primitives) and `src/components/` (app composition)
- **Server Actions** — `src/actions/`: the only layer that touches external services from the UI
- **Environment** — `src/env.ts`: single source of truth for all environment variables (Zod-validated)

## Repository Structure

```
docs/                     # Setup and infrastructure documentation
react-email/
  emails/                 # React Email templates
prisma/
  migrations/
  schema.prisma
public/
src/
  actions/                # Server Actions (*.action.ts)
  app/
    [locale]/             # i18n-aware App Router pages
    api/                  # API routes (auth, webhooks)
  components/
    ui/                   # shadcn/ui primitives
  constants/
  contexts/               # React contexts
  database/               # Prisma connection helper
  dev/                    # Devtools (development only)
  env.ts                  # Environment validation
  features/               # Self-contained feature modules
    auth/
    dashboard/
  hooks/                  # Cross-feature shared hooks
  lib/                    # Third-party configurations
  middleware/             # Auth, i18n, cookies middleware
  providers/              # React providers
  scripts/                # i18n validation scripts
  stores/                 # Global state stores
  styles/                 # globals.css
  utils/                  # Pure utility functions
```

## Development Workflow

1. Install dependencies
2. Configure `.env` from `.env.example`
3. Start Docker services
4. Run Prisma migrations
5. Start the app

```bash
bun install
cp .env.example .env
docker compose up -d
bun run db:migrate
bun run dev
```

## Core Commands

```bash
# Development
bun run dev                         # Start Next.js dev server
bun run start                       # Start production server
bun run build                       # Build Next.js standalone output

# Quality & Testing
bun run lint                        # Biome check
bun run lint:fix                    # Biome check with auto-fix
bun run format                      # Biome format
bun run ci                          # CI lint (strict)
bun run test                        # Run tests
bun run test:coverage               # Run tests with coverage

# i18n
bun run locale-check                # Validate translation key parity
bun run locale-unused               # Detect orphan i18n keys

# Database (Prisma)
bun run db:generate                 # Generate Prisma client
bun run db:migrate                  # Apply migrations
bun run db:studio                   # Open Prisma Studio

# Better Auth
bun run better-auth:generate        # Generate Better Auth types/config
```

## Docker

### Local Development Infrastructure

`docker-compose.yml` provides three services:

| Service | Description | Port |
|---|---|---|
| `database` | PostgreSQL | 5432 |
| `prisma-studio` | Prisma Studio UI | 5555 |
| `stripe-webhook` | Stripe CLI webhook forwarder | — |

```bash
docker compose up -d
docker compose down
```

### Production Docker Image

```bash
bun install
bun run build
docker build -t next-starter .

docker run --name next-starter \
  --env-file .env \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/next-starter \
  -p 3000:3000 \
  next-starter
```

> When running the container, replace `localhost` with `host.docker.internal` in `DATABASE_URL`.

See `docs/docker/deployment.md` for full deployment documentation.

## CI/CD

| Pipeline | Steps |
|---|---|
| **Drone CI** (`.drone.yml`) | install → db:generate → typecheck → lint → i18n audit → test → sonarcloud → build |
| **GitHub Actions** (`.github/workflows/ci.yml`) | prisma-generate → typecheck · lint · i18n-audit → tests → SonarCloud → build |
| **SonarCloud** | Code quality and security analysis (`sonar-project.properties`) |

## Documentation

| Topic | File |
|---|---|
| Local setup | `docs/local-setup/local-setup.md` |
| Docker deployment | `docs/docker/deployment.md` |
| CI/CD pipeline | `docs/ci-cd/README.md` |
| Google OAuth | `docs/google/google-oauth-setup.md` |
| Stripe setup | `docs/stripe/stripe-setup.md` |
