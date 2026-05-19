<!-- @format -->

# Documentation

Central documentation hub for Next Starter.

## Start Here

- [Local setup](./local-setup/local-setup.md)
- [Docker deployment](./docker/deployment.md)
- [CI/CD overview](./ci-cd/README.md)

## Project Standard

This repository follows a modular "platform + features" pattern:

- **Platform code** lives in `src/lib`, `src/providers`, `src/middleware`, `src/database`, and `src/utils` — shared infrastructure
- **Feature code** lives in `src/feature/*` with isolated UI, hooks, and actions — self-contained modules
- **UI components** are split into:
  - `src/components/ui/`: shadcn/ui primitives (Radix UI components with custom styling)
  - `src/components/origin-ui/`: App-specific composition components built from UI primitives
  - `src/feature/*/components/`: Feature-specific components
- **Server actions** live in `src/actions/` and should be the only layer touching external services from the UI
- **Environment validation** is centralized in `src/env.ts` using Zod

## Technology Stack

### Core

- **Runtime & Package Manager**: Bun 1.3.3
- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI based)
- **Linting & Formatting**: Biome 2.2.0
- **Database**: PostgreSQL via Prisma 7.8.0
- **Email**: React Email templates with Resend
- **TypeScript**: Strict mode enabled

### Integrations

- **Authentication**: Better Auth 1.6.11 (email/password + Google OAuth)
- **Payments**: Stripe 22.0.0 with @better-auth/stripe plugin
- **i18n**: next-intl 4.12.0
- **State Management**: TanStack Query 5.100.10
- **Form Validation**: React Hook Form 7.72.0 + Zod 4.4.3
- **Icons**: Lucide React 1.16.0 + Tabler Icons React 3.40.0

## Setup and Integrations

- [Google OAuth setup](./google/google-oauth-setup.md)
- [Stripe setup](./stripe/stripe-setup.md)

## CI/CD

- [CI/CD README](./ci-cd/README.md)
- [Pipeline architecture](./ci-cd/pipeline-architecture.md)
- [Drone setup](./ci-cd/drone-setup.md)
- [SonarCloud setup](./ci-cd/sonarcloud-setup.md)
- [Configuration files reference](./ci-cd/configuration-files.md)

## Testing and Quality Quick Reference

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# i18n validation
bun run locale-check
bun run locale-unused

# Linting and formatting
bun run lint
bun run lint:fix
bun run format
bun run ci

# Type checking
bun tsc
```

## Build Commands

```bash
# Build Next.js standalone output
bun run build

# Build Docker image (after running bun run build)
docker build -t next-starter .

# Run Docker container
docker run --name next-starter \
  --env-file .env \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/next-starter \
  -p 3000:3000 \
  next-starter
```

## Database Commands

```bash
# Generate Prisma client
bun run db:generate

# Apply migrations
bun run db:migrate

# Open Prisma Studio
bun run db:studio
```

## Better Auth Commands

```bash
# Generate Better Auth types/config
bun run better-auth:generate
```

## Notes

- This repository is intended to be a reusable starter foundation
- Keep docs aligned with real scripts/configs before merging architecture or workflow changes
- Always use Bun as the package manager, never npm/yarn/pnpm
- All environment variables must be validated in `src/env.ts` using Zod
