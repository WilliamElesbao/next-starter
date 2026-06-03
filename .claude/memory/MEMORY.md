# Project Memory — next-starter

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Auth | Better Auth |
| Database | PostgreSQL + Prisma ORM |
| Payments | Stripe |
| Email | Resend + React Email |
| Styling | Tailwind CSS + shadcn/ui |
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
| `src/components/ui/` | shadcn/ui primitives — do not modify |
| `src/components/` | Shared complex components |
| `src/actions/` | Next.js Server Actions (`*.actions.ts`) |
| `src/hooks/` | Cross-feature shared hooks |
| `src/lib/` | Third-party client configuration |
| `src/middleware/` | Middleware modules (`auth`, `cookies`, `i18n`) |
| `src/constants/` | App-wide constants |
| `src/contexts/` | React Contexts |
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
| `src/utils/safe-fetch.ts` | Typed HTTP fetch wrapper |
| `src/utils/format-price.ts` | Price formatting |
| `src/utils/get-initials.ts` | Name initials |
| `src/lib/shadcn/utils.ts` | `cn()` class merger |

## Rule References

| Area | File |
|---|---|
| Architecture | `rules/feature-based-architecture.md` |
| TypeScript | `rules/typescript-pattern.md` |
| Testing | `rules/testing.md` |
| Styling | `rules/styling.md` |
| Server Actions | `rules/server-actions.md` |
| Performance | `rules/performance.md` |

## Non-Negotiable Conventions

- No `any` types anywhere
- No inline comments explaining WHAT code does (see `memory/feedback_fewer_comments.md`)
- No `<img>` tags — always `<Image />` from `next/image`
- No `process.env.X` outside `src/env.ts`
- Compound Component pattern for complex UI
- Server Actions for all mutations
- TanStack Query for client-side server-state fetching
- Zod for all schema validation
- `safePromise` for all async DB / external API calls
- Navigation via `@/lib/i18n/navigation` — never `next/link` directly
