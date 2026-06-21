# Next Starter

A production-grade Next.js 16 starter: TypeScript end to end, a feature-based architecture, a server-first rendering model, and modern tooling. Build features as isolated modules, keep platform concerns central, and lean on the type system and linter to enforce the rules below.

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
├── actions/              # Server Actions — mutations only (writes to external services)
├── app/                  # Next.js App Router
│   ├── [locale]/         # i18n-aware routes
│   └── api/              # Route Handlers (Better Auth, client-side reads)
├── components/           # Shared components
│   └── ui/               # shadcn/ui primitives (Radix UI)
├── constants/            # App-wide constants
├── contexts/             # Global contexts shared across features (feature-scoped contexts live in features/*/contexts/)
├── data/                 # Server-side data-access layer — reads for Server Components
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

## Rule Documentation

| Area | File |
|---|---|
| Architecture & module boundaries | `.claude/rules/architecture.md` |
| Component organization (Server/Client) | `.claude/rules/components.md` |
| Primitive components (cva, Radix UI) | `.claude/rules/primitive-components.md` |
| Compound components | `.claude/rules/compound-components.md` |
| Loading states (Suspense, Activity) | `.claude/rules/loading-states.md` |
| Forms (RHF + Zod v4) | `.claude/rules/forms.md` |
| Data fetching (Server Actions, TanStack Query) | `.claude/rules/data-fetching.md` |
| Server Action anatomy | `.claude/rules/server-actions.md` |
| Testing (Vitest, TDD) | `.claude/rules/testing.md` |
| i18n (next-intl, localized validation) | `.claude/rules/i18n.md` |
| TypeScript patterns | `.claude/rules/typescript.md` |

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
bun run locale-unused    # Find orphan i18n keys
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
| `next/link` or `next/navigation` directly | `@/lib/i18n/navigation` |

## Agents

- `code-reviewer` — Systematic code review against all project rules
- `environment-inspector` — Validates env var declarations and usage
- `i18n-key-validator` — Checks key parity and detects hardcoded strings
- `security-auditor` — Security audit for Server Actions and API routes

## LLM Behavioral Guidelines

### 1. Think Before Coding

Before implementing: state assumptions explicitly, surface all tradeoffs, ask when unclear.
If multiple interpretations exist, present them — don't pick silently.

### 2. Simplicity First

Minimum code that solves the problem. No features beyond what was asked.
No abstractions for single-use code. No speculative flexibility.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

Touch only what is required. Match existing style. Do not improve adjacent code.
When your changes create orphaned imports/functions, remove them. Leave pre-existing dead code alone.

Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

Transform tasks into verifiable goals. For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

### 5. i18n Rules

- Every component that renders text **must** use translation keys from `src/lib/i18n/locales/en.json` and `pt-BR.json`
- New keys must be added to `en.json` first, then `pt-BR.json`
- Key naming: dot-notation, kebab-case values mirroring the English sentence (e.g. `auth.sign-in.forgot-password`)
- Run `bun run locale-check` and `bun run locale-unused` after any key changes — both must pass

### 6. Commits

Conventional commits: `feat(scope): subject`, `fix: subject`, `chore: subject`.
Header under 88 characters.
