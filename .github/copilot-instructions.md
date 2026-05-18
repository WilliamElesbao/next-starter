# GitHub Copilot Instructions

## Project Overview

Next Starter is a full-stack Next.js 16 template with React 19, designed for SaaS-style products. It uses a modular "platform + features" architecture with authentication, billing, email, and local infrastructure.

## Technology Stack

### Core

- **Runtime & Package Manager**: Bun 1.3.3 — always use `bun`, never `npm`, `yarn`, or `pnpm`
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

## Repository Structure

```
src/
├── actions/              # Server Actions (only layer touching external services from UI)
├── app/                  # Next.js App Router
│   └── [locale]/        # i18n-aware routes
├── components/          # UI components
│   ├── ui/             # shadcn/ui primitives (Radix UI based)
│   └── origin-ui/      # App-specific composition components
├── constants/           # Shared constants
├── context/            # React contexts
├── database/           # Prisma connection helpers
├── env.ts              # Centralized environment validation with Zod
├── feature/            # Feature modules (isolated UI, hooks, actions)
│   ├── auth/          # Authentication feature
│   └── dashboard/     # Dashboard feature
├── hooks/              # Custom React hooks
├── lib/                # Platform integrations
│   ├── better-auth/   # Better Auth configuration
│   ├── dayjs/         # Date utilities
│   ├── i18n/          # Internationalization
│   ├── react-query/   # TanStack Query setup
│   ├── resend/        # Email service
│   ├── shadcn/        # shadcn/ui utilities
│   └── stripe/        # Stripe client
├── middleware/         # Next.js middleware (auth, i18n, cookies)
├── providers/          # React providers
├── scripts/            # Maintenance scripts (i18n validation)
├── styles/             # Global styles
└── utils/              # Shared utilities

prisma/                # Prisma schema, migrations, and generated types
emails/                 # React Email templates and assets
docs/                   # Setup and infrastructure documentation
public/                 # Static assets
```

## Architectural Pattern

### Platform vs Features

This project follows a modular "platform + features" pattern:

- **Platform code** lives in `src/lib`, `src/providers`, `src/middleware`, `src/database`, and `src/utils` — shared infrastructure
- **Feature code** lives in `src/feature/*` with isolated UI, hooks, and actions — self-contained modules
- **UI components** are split into:
  - `src/components/ui/`: shadcn/ui primitives (Radix UI components with custom styling)
  - `src/components/origin-ui/`: App-specific composition components built from UI primitives
  - `src/feature/*/components/`: Feature-specific components
- **Server actions** live in `src/actions/` and should be the only layer touching external services from the UI
- **Environment validation** is centralized in `src/env.ts` using Zod

## Component Development Patterns

### File Naming

- Files: lowercase with hyphens → `user-card.tsx`, `use-modal.ts`
- Always use named exports, never default exports
- No barrel files (`index.ts`) for internal folders

### Component Structure

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/shadcn/utils"

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "variant-classes",
        secondary: "variant-classes",
      },
      size: {
        default: "size-classes",
        sm: "size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

### Styling Patterns

- Always use `cn()` for class merging (from `@/lib/shadcn/utils`)
- Always use `data-slot` for component identification
- Use data-attributes for states: `data-disabled={disabled ? "" : undefined}`
- Focus visible for interactive elements: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
- Icon sizing: `<Check className="size-4" />` or `[&_svg]:size-3.5` in variants
- aria-label for icon buttons: `<button aria-label="Close"><X className="size-4" /></button>`
- Props spread at the end: `{...props}`

### Radix UI Usage

This project uses Radix UI components (not @base-ui/react):

```tsx
import * as Dialog from "@radix-ui/react-dialog"
<Dialog.Root><Dialog.Portal><Dialog.Overlay /><Dialog.Content /></Dialog.Portal></Dialog.Root>

import * as Tabs from "@radix-ui/react-tabs"
<Tabs.Root><Tabs.List><Tabs.Trigger /></Tabs.List><Tabs.Content /></Tabs.Root>

import * as Select from "@radix-ui/react-select"
<Select.Root><Select.Trigger /><Select.Portal><Select.Content><Select.Item /></Select.Content></Select.Portal></Select.Root>
```

### TypeScript Patterns

```tsx
// ✅ Extend ComponentProps + VariantProps
interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

// ✅ Import types from React
import * as React from "react"
import type { ComponentProps } from "react"

// ❌ Do NOT use React.FC
// ❌ Do NOT use any
```

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

- Use Prisma client from `src/database/prisma-connection.ts` when available
- Keep models in `prisma/schema.prisma` and migrations in `prisma/migrations/`

## Better Auth

```bash
bun run better-auth:generate         # Generate Better Auth types/config
```

## i18n

```bash
bun run locale-check               # Validate translation files
bun run locale-unused               # Check unused i18n keys
```

## Prohibited Practices

### ❌ DO NOT

1. Use `console.log` in production code
2. Modify generated files in `prisma/generated/`
3. Use `process.env` directly in app code (use `src/env.ts`)
4. Use npm/yarn/pnpm (always use Bun)
5. Use default exports (always use named exports)
6. Create barrel files (`index.ts`) for internal folders
7. Touch external services from UI components (use Server Actions)
8. Use React.FC or any type

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
bun run test                        # Jest
bun run test:coverage               # Jest with coverage
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

