# Next Starter
Next Starter is a full-stack Next.js 16 template focused on a clean, scalable
foundation for SaaS-style products with authentication, billing, email, and
local infrastructure baked in.

## Project overview
This repository is a single Next.js app with server actions, Prisma-backed
PostgreSQL, Better Auth, Stripe billing, and React Email templates.
It is designed to keep platform concerns centralized while features live in
their own modules.

|![sign-in page](docs/sign-in.png)|![dashboard-welcome toast](docs/dashboard-welcome.png)|![dashboard page](docs/dashboard.png)
|---|---|---|

|![email sent](docs/email-sent.png)|![email](docs/email.png)|![redireting to stripe toast](docs/redirecting-to-stripe.png)
|---|---|---|

|![stripe checkout screen](docs/stripe-checkout-screen.png)|![cancel subscription dialog](docs/cancel-subscription-dialog.png)|![stripe subscription cancellation screen](docs/stripe-subscription-cancellation-screen.png)
|---|---|---|

## Stack
- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 + shadcn/ui
- Prisma + PostgreSQL
- Better Auth (email/password + Google OAuth)
- Stripe (subscriptions + webhooks)
- Resend + React Email templates
- TanStack Query
- Zod for schema validation
- next-intl for i18n
- Biome + TypeScript
- Docker Compose (Postgres, Prisma Studio, Stripe CLI)
- CI: Drone + GitHub Actions + SonarCloud

## Pattern adopted
This project follows a modular “platform + features” pattern:
- Platform code lives in `src/lib`, `src/providers`, `src/middleware`,
  `src/database`, and `src/utils`.
- Feature code lives in `src/feature/*` with isolated UI, hooks, and actions.
- UI is split into `src/components/ui` (shadcn primitives) and
  `src/components/origin-ui` (app composition).
- Server actions live in `src/actions` and should be the only layer touching
  external services from the UI.
- Environment validation is centralized in `src/env.ts` using Zod.

## Repository structure
```text
docs/
emails/
  src/templates/
prisma/
  migrations/
  schema.prisma
public/
src/
  actions/
  app/
    [locale]/
  components/
  constants/
  context/
  database/
  feature/
  hooks/
  lib/
  middleware/
  providers/
  scripts/
  styles/
  utils/
```

## Development workflow
1. Install dependencies.
2. Configure `.env` from `.env.example`.
3. Start Docker services.
4. Run Prisma migrations.
5. Start the app.

```bash
bun install
cp .env.example .env
docker compose up -d
bun db:migrate
bun dev
```

## Core commands
```bash
# Development
bun dev                             # Start Next.js dev server
bun run start                       # Start production server

# Build
bun run build                       # Build Next.js standalone output

# Quality & Testing
bun run lint                        # Biome check
bun run lint:fix                    # Biome check with auto-fix
bun run format                      # Biome format
bun run ci                          # CI lint (strict)
bun run test                        # Run tests
bun run test:coverage               # Run tests with coverage

# i18n
bun run locale-check                # Validate translation files
bun run locale-unused               # Check unused i18n keys

# Database (Prisma)
bun run db:generate                 # Generate Prisma client
bun run db:migrate                  # Apply migrations
bun run db:studio                   # Open Prisma Studio

# Better Auth
bun run better-auth:generate        # Generate Better Auth types/config
```

## Docker support

### Local Development Infrastructure

The project includes a `docker-compose.yml` with three services:

- **database**: PostgreSQL database
- **prisma-studio**: Prisma Studio UI (port 5555)
- **stripe-webhook**: Stripe CLI for webhook forwarding

Start all services:
```bash
docker compose up -d
```

### Production Docker Image

The `Dockerfile` builds a production-ready Next.js standalone image.

**Build steps:**
```bash
# 1. Install dependencies and build
bun install
bun run build

# 2. Build Docker image
docker build -t next-starter .

# 3. Run container with environment variables
docker run --name next-starter \
  --env-file .env \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/next-starter \
  -p 3000:3000 \
  next-starter
```

**Important:** When running the container, change `DATABASE_URL` from `localhost` to `host.docker.internal` to connect to services on the host machine.

See `docs/docker/deployment.md` for complete deployment documentation.

## CI/CD overview
- **Drone CI** (`.drone.yml`): install → prisma-generate → typecheck → lint → i18n audit → tests → build
- **GitHub Actions**:
  - `.github/workflows/sonar.yml` (SonarCloud scan)
  - `.github/workflows/pr-review.yml` (Biome annotations)
- **SonarCloud** config in `sonar-project.properties`
- **Tests**: Tests with coverage reporting (enabled in CI pipeline)

## Environment setup
Environment is centralized in a root `.env` file. Use `.env.example` as the
template and validate with `src/env.ts`.

## Documentation
- `docs/README.md`
- `docs/local-setup/local-setup.md`
- `docs/docker/deployment.md`
- `docs/ci-cd/README.md`
- `docs/google/google-oauth-setup.md`
- `docs/stripe/stripe-setup.md`
