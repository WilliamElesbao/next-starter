# Next Starter

Next.js 16 starter with TypeScript, feature-based architecture, server-first approach, and modern tooling.

## Tech Stack

| Area | Tech | Version |
|---|---|---|
| Framework | Next.js (App Router) + React | 16 + 19 |
| Package Manager | Bun | 1.3+ |
| Validation | Zod | v4 |
| Forms | React Hook Form + @hookform/resolvers | 7.72 |
| i18n | next-intl | 4.12 |
| UI Library | Radix UI | Latest |
| Variants | class-variance-authority (cva) | 0.7 |
| CSS | Tailwind CSS v4 + tw-animate-css | 4 |
| DB ORM | Prisma | 7.8 |
| Auth | Better Auth | 1.6 |
| Payments | Stripe | 22 |
| Email | Resend + React Email | Latest |
| Client State | TanStack Query | 5.100 |
| Testing | Vitest + React Testing Library | 4 |
| Linting | Biome | 2.2 |

## Project Structure

```
src/
├── actions/              # Server Actions (only external service callers)
├── app/                  # Next.js App Router
│   ├── [locale]/         # i18n-aware routes
│   └── api/auth/         # Better Auth API handler
├── components/           # Shared components
│   ├── ui/               # shadcn/ui primitives (Radix UI)
│   └── origin-ui/        # App-specific composition components
├── constants/            # App-wide constants
├── contexts/             # React contexts (scoped, not global unless required)
├── database/             # Prisma connection
├── env.ts                # Environment validation (single source of truth)
├── features/             # Self-contained feature modules
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── sign-in/
│   │   └── sign-up/
│   └── dashboard/
├── hooks/                # Cross-feature shared hooks
├── lib/                  # Third-party configs
│   ├── better-auth/
│   ├── i18n/             # Routing, navigation, locale loading
│   ├── react-query/
│   ├── resend/
│   ├── shadcn/           # cn() utility
│   └── stripe/
├── middleware/           # Next.js middleware modules
├── providers/            # Theme, QueryClient, Toaster providers
├── scripts/              # i18n validation scripts
├── styles/               # globals.css (CSS variables, Tailwind)
└── utils/                # Pure utilities (safe-promise, format-price, etc.)
```

## Documentation

| Area | File |
|---|---|
| Architecture & Project Structure | `.claude/rules/architecture.md` |
| Component Organization | `.claude/rules/components.md` |
| Primitive Components (cva, Radix UI) | `.claude/rules/primitive-components.md` |
| Compound Components | `.claude/rules/compound-components.md` |
| Loading States (Suspense, Activity) | `.claude/rules/loading-states.md` |
| Forms (RHF + Zod v4) | `.claude/rules/forms.md` |
| Data Fetching (Server Actions, TanStack Query) | `.claude/rules/data-fetching.md` |
| Testing (Vitest, TDD) | `.claude/rules/testing.md` |
| i18n (next-intl) | `.claude/rules/i18n.md` |
| TypeScript Patterns | `.claude/rules/typescript.md` |

## Common Commands

```bash
bun run dev              # Development server
bun run build            # Production build
bun run test             # Run tests
bun run lint:fix         # Fix linting issues
bun run format           # Format code
bun run db:migrate       # Run migrations
bun run db:studio        # Prisma Studio
bun run locale-check     # Validate translations
```

## Prohibited Practices

| ❌ Do Not | ✅ Instead |
|---|---|
| `console.log` in production | Use proper logging or remove |
| `process.env.X` in app code | Import `env` from `@/env` |
| Default exports | Named exports always |
| Barrel files (`index.ts`) | Direct imports only |
| `React.FC` | Plain function components |
| `any` type | `unknown`, generic `<T>`, or proper type |
| `forwardRef` (deprecated in React 19) | `ref` as regular prop |
| TypeScript `enum` | `const` object + derived type |
| `<img>` tag | `next/image` (`<Image />`) |
| Hardcoded strings | Translation keys from locale files |
| Modify `prisma/generated/` | Hand off to Prisma CLI |
| Feature cross-importing | Lift to `src/hooks/` or `src/utils/` |


## Quick Reference

| Topic | File |
|---|---|
| Architecture & module boundaries | `rules/architecture.md` |
| Component patterns | `rules/components.md` |
| Primitive components (cva, Radix) | `rules/primitive-components.md` |
| Compound components | `rules/compound-components.md` |
| Loading states (Suspense, Activity) | `rules/loading-states.md` |
| Form handling (RHF + Zod v4) | `rules/forms.md` |
| Data fetching (Server Actions, TanStack Query) | `rules/data-fetching.md` |
| Server Action anatomy | `rules/server-actions.md` |
| Testing (Vitest, TDD) | `rules/testing.md` |
| i18n (next-intl, localized validation) | `rules/i18n.md` |
| TypeScript patterns | `rules/typescript.md` |

## Agents

- `/review` — Code review bot
- `/fix-issue <number>` — Automated fix for GitHub issues
