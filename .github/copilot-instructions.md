# GitHub Copilot Instructions

## Project Overview

Full-stack Next.js 16 app using Bun as runtime/package manager, PostgreSQL via Prisma, and Docker for local services. Auth is handled with Better Auth, data fetching uses TanStack Query, and email templates live in the `emails/` workspace.

## Repository Structure

- `src/app/` — App Router routes, layouts, and locale-aware pages
- `src/actions/` — Server Actions for subscriptions, plans, and emails
- `src/components/` — App-specific UI components (including `origin-ui/` and `ui/`)
- `src/lib/` — Integrations and utilities (Better Auth, Stripe, i18n, React Query)
- `src/middleware/` — Auth, i18n, and cookie middleware
- `src/providers/` — React providers used in the app shell
- `src/scripts/` — Maintenance scripts (i18n validation, unused key checks)
- `src/styles/` — Global styles and Tailwind setup
- `src/utils/` — Shared utilities
- `src/database/` — Prisma connection helpers
- `src/feature/` — Feature modules (auth, dashboard, etc.)
- `prisma/` — Prisma schema, migrations, and generated types
- `emails/` — React Email templates and assets
- `docs/` — Setup and infrastructure documentation
- `public/` — Static assets

## Technology Stack

### Core

- **Runtime & Package Manager**: Bun — always use `bun`, never `npm`, `yarn`, or `pnpm`
- **Framework**: Next.js 16 with React 19 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Linting & Formatting**: Biome (replaces ESLint/Prettier)
- **Database**: PostgreSQL via Prisma
- **Email**: React Email templates in `emails/`

### Integrations

- **Authentication**: Better Auth
- **Payments**: Stripe
- **i18n**: `next-intl`
- **State**: TanStack Query

## Code Conventions

### Package Manager

```bash
bun install
bun add <package>
bun run dev
```

### Linting & Formatting

```bash
bun run lint
bun run lint:fix
bun run format
```


### Commits (Conventional Commits)

```bash
# Allowed types
feat, fix, refactor, perf, docs, test, ci, chore, build, style, revert

# Rules
- Max header length: 88 characters
- Format: <type>(<scope>): <description>
- Scope is optional
```

## Prisma

### Schema & Migrations

```bash
bun run db:generate                 # Generate Prisma client
bun run db:migrate                  # Apply migrations
bun run db:studio                   # Open Prisma Studio
```

### Database Access

- Use Prisma client from `src/database/prisma-connection.ts` when available.
- Keep models in `prisma/schema.prisma` and migrations in `prisma/migrations/`.

## Prohibited Practices

### ❌ DO NOT

1. **Use `console.log` in production code**
2. **Modify generated files** in `prisma/generated/`
3. **Use `process.env` directly** in app code
4. **Use npm/yarn/pnpm** — always use `bun`

## Useful Commands

### Development

```bash
bun install                         # Install dependencies
bun run dev                         # Run Next.js dev server
bun run start                       # Start production server
```

### Build & Quality

```bash
bun run build                       # Build the app
bun run lint                        # Biome lint
bun run lint:fix                    # Lint with auto-fix
bun run format                      # Biome format
bun run ci                          # CI lint (Biome)
```

### Tests

```bash
bun run test                        # Vitest
bun run test:coverage               # Vitest with coverage
```

### i18n

```bash
bun run locale-check               # Validate translation files
bun run locale-unused               # Check unused i18n keys
```

### Better-Auth

```bash
bun run better-auth:generate         # Generate Better Auth types/config
```

### Infrastructure

```bash
docker compose up -d                # Database, Prisma Studio, Stripe CLI
```

## CI/CD

### Pipeline Checks

- **Lint**: `bun run ci`
- **Tests**: `bun run test`
- **Coverage**: `bun run test:coverage`
- **SonarCloud**: Code quality and security analysis

