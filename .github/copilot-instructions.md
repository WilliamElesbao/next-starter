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
├── contexts/             # React contexts
├── database/             # Prisma connection helper
├── dev/                  # Devtools (development only)
├── env.ts                # Centralized environment validation with Zod
├── features/             # Feature modules (isolated UI, hooks, actions)
│   ├── auth/
│   └── dashboard/
├── hooks/                # Cross-feature shared hooks
├── lib/                  # Platform integrations
│   ├── better-auth/
│   ├── dayjs/
│   ├── i18n/
│   ├── react-query/
│   ├── resend/
│   ├── shadcn/
│   └── stripe/
├── middleware/           # Next.js middleware (auth, i18n, cookies)
├── providers/            # React providers
├── scripts/              # Maintenance scripts (i18n validation)
├── stores/               # Global state stores (jotai, zustand, etc.)
├── styles/               # Global styles
└── utils/                # Shared utilities

prisma/                   # Prisma schema, migrations, and generated types
react-email/emails/       # React Email templates
docs/                     # Setup and infrastructure documentation
public/                   # Static assets
```

## Architectural Pattern

### Platform vs Features

This project follows a modular "platform + features" pattern:

- **Platform code** lives in `src/lib`, `src/providers`, `src/middleware`, `src/database`, and `src/utils` — shared infrastructure
- **Feature code** lives in `src/features/*` with isolated UI, hooks, and actions — self-contained modules
- **UI components**:
  - `src/components/ui/`: shadcn/ui primitives (Radix UI components)
  - `src/components/`: App-specific composition components
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
| Feature A uses global contexts (Auth, Theme) | Feature A imports from Feature B |
| Feature A uses `src/components/` | Feature A uses Feature B's hooks |
| Feature A uses `src/hooks/` | Cross-feature context access |

Shared logic must be lifted to `src/hooks/` or `src/utils/`.

## Component Development Patterns

### File Naming

- Files: lowercase with hyphens → `user-card.tsx`, `use-modal.ts`
- Always use named exports, never default exports
- No barrel files (`index.ts`) for internal folders

### Primitive Component Structure

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"
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

### Styling Patterns

- `cn()` from `@/lib/shadcn/utils` for all class merging
- `data-slot` on every component for identification
- `data-variant` / `data-size` when using cva variants
- Data attributes for states: `data-disabled={disabled ? "" : undefined}`
- Focus visible: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
- Icon sizing: `<Check className="size-4" />` or `[&_svg:not([class*='size-'])]:size-4` in variants
- `aria-label` on icon-only buttons
- Props spread at the end: `{...props}`

### Forms (React Hook Form + Zod v4)

```ts
// form-schema.ts — factory function for localized errors
export const useSignInFormSchema = () => {
  const t = useTranslations("validation")
  return z.object({
    email: z.email({ error: t("email.please-enter-a-valid-email") }),
    password: z.string().min(1, { error: t("password.password-is-required") }),
  })
}
export type SignInFormValues = z.infer<ReturnType<typeof useSignInFormSchema>>
```

Always wrap form inputs with `<Controller />` from react-hook-form:

```tsx
<Controller
  control={form.control}
  name="email"
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

**Zod v4:** custom errors use `{ error: "..." }` (not `{ message: "..." }`). `z.string().email()` is now `z.email()`.

### Hooks Convention

Hooks always return an object — never a primitive:

```ts
// ✅
export function useDialog() {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}
```

### Data Fetching

- `useQuery` / `useInfiniteQuery` for reads — always set `staleTime`
- `useInfiniteQuery` for large lists, tables, and history views
- `useMutation` for writes — invalidate queries on success
- Server Actions for all mutations to external services

### i18n

- Every rendered string must use translation keys from `src/lib/i18n/locales/en.json` and `pt-BR.json`
- New keys: add to `en.json` first, then `pt-BR.json`
- Navigation via `@/lib/i18n/navigation` — never `next/link` or `next/navigation` directly
- `useTranslations()` in Client Components; `getTranslations()` in Server Components

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
