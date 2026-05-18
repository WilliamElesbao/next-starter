# Next Starter
Next Starter is a full-stack Next.js 16 template focused on a clean, scalable
foundation for SaaS-style products with authentication, billing, email, and
local infrastructure baked in.

## Project overview
This repository is a single Next.js app with server actions, Prisma-backed
PostgreSQL, Better Auth, Stripe billing, and React Email templates.
It is designed to keep platform concerns centralized while features live in
their own modules.

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
bun dev
bun run build
bun run start
bun run lint
bun run lint:fix
bun run format
bun run test
bun run test:coverage
bun run locale-check
bun run locale-unused
bun run db:generate
bun run db:migrate
bun run db:studio
```

## Docker support
This repository ships a single `Dockerfile` for the Next.js standalone build.
Run `bun run build` first, then build the image. See `docs/docker/deployment.md`
for the full flow.

## CI/CD overview
- Drone CI (`.drone.yml`): install → typecheck → lint → i18n audit → build
- GitHub Actions:
  - `.github/workflows/sonar.yml` (SonarCloud scan)
  - `.github/workflows/pr-review.yml` (Biome annotations)
- SonarCloud config in `sonar-project.properties`

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
