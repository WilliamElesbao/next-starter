<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AI Agent Instructions for Next Starter

## Project Overview

Next Starter is a full-stack Next.js 16 template with React 19, designed for SaaS-style products. It uses a modular "platform + features" architecture with authentication, billing, email, and local infrastructure.

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

## Project Structure Pattern

### Modular "Platform + Features" Architecture

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
```

### Key Architectural Principles

1. **Platform vs Features**: Platform code (`src/lib`, `src/providers`, `src/middleware`, `src/database`, `src/utils`) is shared infrastructure. Feature code (`src/feature/*`) is isolated and self-contained.

2. **Server Actions**: All external service calls from the UI must go through Server Actions in `src/actions/`. This is the only layer that should touch Stripe, Resend, etc. from the UI.

3. **Component Organization**:
   - `src/components/ui/`: shadcn/ui primitives (Radix UI components with custom styling)
   - `src/components/origin-ui/`: App-specific composition components built from UI primitives
   - `src/feature/*/components/`: Feature-specific components

4. **Environment Validation**: All environment variables are validated in `src/env.ts` using Zod. Never use `process.env` directly in app code.

## Component Development Patterns

### File Naming Convention

- **Files**: lowercase with hyphens → `user-card.tsx`, `use-modal.ts`
- **Always use named exports**, never default exports
- **No barrel files** (`index.ts`) for internal folders

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

### Compound Components Pattern

```tsx
import * as React from "react"
import { cn } from "@/lib/shadcn/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("base-classes", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("base-classes", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("base-classes", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle }
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

### Styling Patterns

```tsx
// Always use cn() for class merging
className={cn("base-classes", className)}

// Always use data-slot for component identification
<div data-slot="card">

// Use data-attributes for states
data-disabled={disabled ? "" : undefined}
className="data-[disabled]:opacity-50 data-[selected]:bg-primary"

// Focus visible for interactive elements
'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

// Icon sizing
<Check className="size-4" />
'[&_svg]:size-3.5' // in variants

// aria-label for icon buttons
<button aria-label="Close"><X className="size-4" /></button>

// Props spread at the end
{...props}
```

### Radix UI Usage

This project uses Radix UI components (not @base-ui/react):

```tsx
// Dialog
import * as Dialog from "@radix-ui/react-dialog"
<Dialog.Root><Dialog.Portal><Dialog.Overlay /><Dialog.Content /></Dialog.Portal></Dialog.Root>

// Tabs
import * as Tabs from "@radix-ui/react-tabs"
<Tabs.Root><Tabs.List><Tabs.Trigger /></Tabs.List><Tabs.Content /></Tabs.Root>

// Select
import * as Select from "@radix-ui/react-select"
<Select.Root><Select.Trigger /><Select.Portal><Select.Content><Select.Item /></Select.Content></Select.Portal></Select.Root>

// Dropdown Menu
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
<DropdownMenu.Root><DropdownMenu.Trigger /><DropdownMenu.Portal><DropdownMenu.Content><DropdownMenu.Item /></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>
```

### Color System (CSS Variables)

```
bg-background, bg-card, bg-popover, bg-muted        → backgrounds
bg-foreground, bg-card-foreground, bg-muted-foreground → text colors
border-border, border-input                         → borders
ring-ring                                           → focus rings
bg-primary, bg-primary-foreground                   → primary actions
bg-destructive, bg-destructive-foreground           → destructive actions
```

## Development Patterns

### Package Manager

```bash
# Always use Bun
bun install
bun add <package>
bun run dev
```

### Database (Prisma)

```bash
bun run db:generate    # Generate Prisma client
bun run db:migrate     # Apply migrations
bun run db:studio      # Open Prisma Studio
```

### Better Auth

```bash
bun run better-auth:generate  # Generate Better Auth types/config
```

### i18n

```bash
bun run locale-check      # Validate translation files
bun run locale-unused     # Check unused i18n keys
```

### Linting & Formatting

```bash
bun run lint          # Biome check
bun run lint:fix      # Biome check with auto-fix
bun run format        # Biome format
bun run ci            # CI lint (strict)
```

### Testing

```bash
bun run test            # Vitest
bun run test:coverage   # Vitest with coverage
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

## Environment Variables

All environment variables are validated in `src/env.ts` using Zod:

```typescript
const envSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.url(),
  DATABASE_URL: z.url().startsWith("postgresql://"),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.email(),
  EMAIL_TO: z.email(),
  AUDIENCE_ID: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
})
```

## Feature Module Structure

Each feature in `src/feature/*` should be self-contained:

```
src/feature/auth/
├── components/       # Feature-specific UI components
├── hooks/          # Feature-specific hooks
├── sign-in/        # Sign-in page/route
├── sign-up/        # Sign-up page/route
└── index.ts        # Feature exports (if needed)
```

## Server Actions Pattern

Server Actions in `src/actions/` are the only layer that should touch external services:

```tsx
"use server"

import { auth } from "@/lib/better-auth/auth"
import { stripeClient } from "@/lib/stripe"

export async function createCheckoutSession() {
  const session = await auth.api.getSession({
    headers: new Headers()
  })

  // External service call here
  const checkout = await stripeClient.checkout.sessions.create({
    // ...
  })

  return checkout
}
```

## Checklist for New Components

- [ ] File name: lowercase with hyphens
- [ ] Named export (no default export)
- [ ] `React.ComponentProps<'element'>` + `VariantProps` for props
- [ ] Variants with `cva()`, classes with `cn()`
- [ ] `data-slot` for component identification
- [ ] States via `data-[state]:` attributes
- [ ] Colors from theme (no hardcoded colors)
- [ ] Focus visible on interactive elements
- [ ] `aria-label` on icon buttons
- [ ] `{...props}` spread at the end
- [ ] No barrel files for internal folders
