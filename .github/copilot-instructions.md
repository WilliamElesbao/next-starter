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
├── actions/              # Server Actions — only layer touching external services from UI
├── app/                  # Next.js App Router
│   ├── [locale]/         # i18n-aware routes
│   └── api/              # API routes (Better Auth, webhooks)
├── components/           # Shared components
│   └── ui/               # shadcn/ui primitives (Radix UI based)
├── constants/            # Shared constants
├── contexts/             # Shared contexts
├── database/             # Prisma connection helper
├── dev/                  # Devtools (development only)
├── env.ts                # Centralized environment validation with Zod
├── features/             # Feature modules (isolated UI, hooks, actions)
│   ├── auth/
│   └── dashboard/
├── hooks/                # Cross-feature shared hooks
├── lib/                  # Platform integrations
├── middleware/           # Next.js middleware (auth, i18n, cookies)
├── providers/            # React providers
├── scripts/              # Maintenance scripts (i18n validation)
├── styles/               # Global styles
├── utils/                # Shared utilities
├── stores/               # Global state stores
└── env.ts                # Environment validation (single source of truth)

prisma/                   # Prisma schema, migrations, generated types
react-email/emails/       # React Email templates
docs/                     # Setup and infrastructure documentation
public/                   # Static assets
```

## Architecture & Isolation

- **Platform code** lives in `src/lib`, `src/providers`, `src/middleware`, `src/database`, and `src/utils` — shared infrastructure
- **Feature code** lives in `src/features/*` with isolated UI, hooks, and actions — self-contained modules
- **UI components**:
  - `src/components/ui/`: shadcn/ui primitives (Radix UI components, custom components)
  - `src/components/`: App-specific compound components
  - `src/features/*/components/`: Feature-specific components
- **Server Actions** in `src/actions/` are the only layer that touches external services from the UI
- **Environment validation** is centralized in `src/env.ts` using Zod

### Feature Module Structure

```
src/features/auth/
├── components/
├── hooks/
├── sign-in/
│   ├── hooks/
│   │   ├── form-schema.ts
│   │   └── use-sign-in-form.ts
│   ├── sign-in-form.tsx
│   └── sign-in-page.tsx
└── sign-up/
```

### Isolation Rules

| Allowed | Forbidden |
|---|---|
| Feature A uses global contexts (`src/contexts/`) | Feature A imports from Feature B |
| Feature A uses `src/components/` | Feature A uses Feature B's hooks |
| Feature A uses `src/hooks/` | Feature A reads Feature B contexts |

Shared logic must be lifted to `src/hooks/` or `src/utils/`.

## Components

### File Naming

- Files: lowercase with hyphens → `user-card.tsx`
- Exports: named only (no default exports)
- No barrel files (`index.ts`) for internal folders

### Primitive Components (`src/components/ui/`)

- Use `cva()` for variants and `twMerge()` for class merging
- Always include `data-slot`
- Use `data-variant` / `data-size` for variants
- Use state data attributes (`data-disabled`, `data-open`, etc.) instead of conditional classes
- Always include focus-visible rings: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
- Icon-only buttons require `aria-label`
- Spread `{...props}` at the end
- Never hardcode colors — use theme tokens (`bg-background`, `text-foreground`, etc.)
- Never use `<img>` — use `next/image`

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
import { cn } from "@/lib/shadcn/utils"

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", secondary: "..." },
    size: { default: "...", sm: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
})

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Compound Components

- Use separate files per sub-component (kebab-case)
- Assemble with `Object.assign(Root, { Sub: SubComponent, ... })`

### Server vs Client Components

- Default to Server Components
- Add `'use client'` only when state/effects, browser APIs, or TanStack Query hooks are required
- Pass serializable props from Server → Client components

## Contexts & Providers

- Global contexts live in `src/contexts/`
- Feature contexts live in `src/features/{feature}/contexts/`
- Never import a feature context across features; promote to global if shared
- Context files export exactly: interface, Provider, consumer hook
- `createContext<Type | undefined>` and throw in hook when missing provider
- Wrap context values in `useMemo`

## Forms (RHF + Zod v4)

- Zod schema is a factory using `useTranslations("validation")`
- Use `z.email()` and `{ error: "..." }` for custom errors
- Always wrap inputs with `<Controller />`
- Feature forms follow compound component pattern

## Data Fetching

- Prefer Server Components for read-only data
- Use Server Actions for all mutations
- Use `useQuery` / `useInfiniteQuery` with `staleTime`
- Use `enabled` guard for optional params
- Use `useInfiniteQuery` for lists, tables, history views
- Use `safePromise` for DB/external calls in Server Actions

## Server Actions

- `'use server'` must be the first line
- Validate inputs with Zod and derive types via `z.infer`
- Auth check before any mutation
- Verify ownership before DB writes
- Return `{ success, data } | { success, error }`
- Never return raw DB/Stripe errors

## Loading States

- Use `<Suspense>` for async boundaries
- Use `<Activity>` for tab/sidebar navigation to preserve state
- Use `<Skeleton>` for placeholders
- Use `useActionState` for Server Action form submissions

## i18n

- Every rendered string must use keys from `src/lib/i18n/locales/en.json` + `pt-BR.json`
- Add new keys to `en.json` first, then `pt-BR.json`
- Navigation via `@/lib/i18n/navigation` only
- `useTranslations()` in Client Components, `getTranslations()` in Server Components
- After key changes run `bun run locale-check` and `bun run locale-unused`

## TypeScript

- Prefer `interface` for props and object shapes; `type` for unions/intersections
- No `any`, `enum`, `@ts-ignore`, or `forwardRef`
- Avoid unsafe casts; use type guards
- Hooks return objects (never primitives)

## Testing

- Vitest + React Testing Library + `@testing-library/user-event`
- Co-locate tests with source files (`*.test.ts(x)`)
- Cover components, hooks, server actions, utilities
- No `it.skip` or `it.todo` in committed code
- Mock only external services (DB, Stripe, Resend)

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

```
feat(auth): add Google OAuth sign-in
fix(stripe): handle webhook signature failure
chore(deps): update Prisma to 7.x
```

- Allowed types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `ci`, `chore`, `build`, `style`, `revert`
- Max header length: 88 characters

## Prisma

```bash
bun run db:generate    # Generate Prisma client
bun run db:migrate     # Apply migrations
bun run db:studio      # Open Prisma Studio
```

- Use Prisma client from `src/database/prisma-connection.ts`
- Never modify files in `prisma/generated/`

## Better Auth

```bash
bun run better-auth:generate    # Generate Better Auth types/config
```

## i18n Scripts

```bash
bun run locale-check      # Validate key parity between en.json and pt-BR.json
bun run locale-unused     # Detect orphan keys in translation files
```

Both must pass in CI.

## Prohibited Practices

| ❌ Do Not | ✅ Instead |
|---|---|
| `console.log` in production | Use proper logging or remove |
| `process.env.X` in app code | Import `env` from `@/env` |
| Default exports | Named exports always |
| Barrel files (`index.ts`) | Direct imports only |
| `React.FC` | Plain function components |
| `any` type | `unknown`, generics, or proper type |
| `forwardRef` | `ref` as a regular prop (React 19) |
| TypeScript `enum` | `const` object + derived `type` |
| `<img>` tag | `<Image />` from `next/image` |
| Hardcoded UI strings | Translation keys from locale files |
| Modify `prisma/generated/` | Hand off to Prisma CLI |
| Feature cross-imports | Lift to `src/hooks/` or `src/utils/` |
| `next/link` or `next/navigation` directly | `@/lib/i18n/navigation` |
| `npm` / `yarn` / `pnpm` | `bun` |

## Useful Commands

```bash
# Development
bun install                    # Install dependencies
bun run dev                    # Run Next.js dev server
bun run start                  # Start production server
bun run build                  # Build the app

# Quality
bun run lint                   # Biome lint
bun run lint:fix               # Lint with auto-fix
bun run format                 # Biome format
bun run ci                     # CI lint (strict)

# Tests
bun run test                   # Run tests
bun run test:coverage          # Run tests with coverage

# Docker & Deployment
docker compose up -d           # Start database, Prisma Studio, Stripe webhook
docker compose down            # Stop all services
bun run build && docker build -t next-starter .

docker run --name next-starter \
  --env-file .env \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/next-starter \
  -p 3000:3000 \
  next-starter
```

## CI/CD Pipeline Checks

| Step | Command |
|---|---|
| Install | `bun install` |
| Prisma Generate | `bun run db:generate` |
| Typecheck | `bun tsc` |
| Lint | `bun biome ci .` |
| i18n Audit | `bun run locale-check && bun run locale-unused` |
| Tests | `bun run test` |
| Build | `bun run build` |
| SonarCloud | Code quality and security analysis |

### Docker Compose Services

| Service | Description | Port |
|---|---|---|
| `database` | PostgreSQL | 5432 |
| `prisma-studio` | Prisma Studio UI | 5555 |
| `stripe-webhook` | Stripe CLI webhook forwarder | — |
