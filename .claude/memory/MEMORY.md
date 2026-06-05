# Project Memory — next-starter

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript strict |
| Auth | Better Auth |
| Database | PostgreSQL + Prisma ORM |
| Payments | Stripe |
| Email | Resend + React Email |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Data Fetching | TanStack Query |
| i18n | next-intl (locales: `en`, `pt-BR`) |
| Testing | Vitest + React Testing Library |
| Linter / Formatter | Biome |
| Package Manager | Bun |
| Toasts | Sonner |
| Dates | dayjs (`src/lib/dayjs/`) |

## Directory Map

| Path | Purpose |
|---|---|
| `src/features/` | Self-contained feature modules |
| `src/components/ui/` | shadcn/ui primitives — add new primitives here |
| `src/components/` | Shared complex components (built from primitives) |
| `src/actions/` | Next.js Server Actions (`*.action.ts`) |
| `src/hooks/` | Cross-feature shared hooks |
| `src/lib/` | Third-party client configuration |
| `src/middleware/` | Middleware modules (auth, cookies, i18n) |
| `src/constants/` | App-wide constants |
| `src/contexts/` | Global React Contexts (shared across 2+ features) — feature-scoped contexts live in `src/features/{feature}/contexts/` |
| `src/providers/` | React Providers |
| `src/utils/` | Pure utility functions |
| `src/env.ts` | Type-safe env variables (single source of truth) |
| `src/styles/globals.css` | Global styles + CSS variable definitions |
| `prisma/` | Prisma schema + migrations |
| `react-email/` | Email templates |

## Key Utility Files

| File | Purpose |
|---|---|
| `src/utils/safe-promise.ts` | `[error, data] = await safePromise(p)` |
| `src/lib/shadcn/utils.ts` | `cn()` class merger |
| `src/lib/i18n/navigation.ts` | i18n-aware Link, redirect, useRouter |

## Non-Negotiable Conventions

- No `any` types
- No inline comments explaining WHAT code does
- No `<img>` — always `<Image />` from `next/image`
- No `process.env` outside `src/env.ts`
- No barrel files, no default exports
- Navigation via `@/lib/i18n/navigation` — never `next/link` directly
- Server Actions for all mutations
- `safePromise` for all async DB / external calls
- Zod v4 for all schema validation (use `{ error: "..." }` for messages)
- `staleTime` on all `useQuery` and `useInfiniteQuery` calls
- `useInfiniteQuery` for large lists, tables, and history views
- Hooks always return an object `{ ... }`, never a primitive
- Every rendered string must use translation keys from locale files
