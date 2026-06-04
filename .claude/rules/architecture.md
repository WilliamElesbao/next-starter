---
paths:
  - "src/**/*"
---

# Architecture

## Project Structure

```
src/
├── actions/            # Server Actions — only layer touching external services from UI
├── app/                # Next.js App Router
│   ├── [locale]/       # i18n-aware routes
│   └── api/            # API routes (Better Auth, webhooks)
├── components/         # shared components used across the entire application
│   ├── ui/             # shadcn/ui primitives (Radix UI based)
│   └── header/         # shared custom component
├── constants/          # shared constants
├── contexts/           # shared contexts
├── database/           # prisma connection helper
├── features/           # feature modules (isolated, self-contained)
│   ├── auth/
│   └── dashboard/
├── hooks/              # shared hooks used across the entire application
├── lib/                # reusable libraries preconfigured for the application
├── middleware/         # middleware modules (auth, i18n, cookies)
├── providers/          # react providers (Theme, QueryClient, Toaster)
├── scripts/            # maintenance scripts
├── styles/             # global styles (CSS variables, Tailwind)
├── utils/              # pure utility functions
├── dev/                # devtools
├── stores/             # global state stores (jotai, zustand, etc.)
└── env.ts              # environment validation (single source of truth)
```

## Platform vs Feature

| Layer | Paths | Scope |
|---|---|---|
| Platform | `src/lib/`, `src/providers/`, `src/middleware/`, `src/database/`, `src/utils/` | Shared infrastructure |
| Feature | `src/features/*/` | Isolated, self-contained modules |

## Context Scoping

Choose the smallest possible scope. Promote to global only when multiple features require it.

```tsx
// Feature-scoped: only one feature uses this context
<Dashboard.Provider>
  <Dashboard>
    <Dashboard.Header />
    <Dashboard.Cards />
    <Dashboard.Table />
  </Dashboard>
</Dashboard.Provider>
```

## Scope Hierarchy

```
Global (Auth, Theme, QueryClient)
   ↓
Feature (Dashboard, Auth)
   ↓
Page / Module
   ↓
Component
```

## Isolation Rules

| Action | Allowed? |
|---|---|
| Feature A uses global contexts (Auth, Theme) | ✅ |
| Feature A uses shared components (`src/components/`) | ✅ |
| Feature A uses shared hooks (`src/hooks/`) | ✅ |
| Feature A accesses Feature B's context | ❌ |
| Feature A imports from Feature B's components | ❌ |
| Feature A imports from Feature B's hooks | ❌ |

Shared logic must be lifted to `src/hooks/` or `src/utils/`.

## Core Principles

| Principle | Enforcement |
|---|---|
| Server Components first | Add `'use client'` only when state, effects, or browser APIs are needed |
| Feature isolation | Features do not cross-import |
| Type safety | No `any`; minimize type assertions |
| Named exports | No default exports (except App Router page wrappers) |
| No barrel files | No `index.ts` that only re-export |
| No `process.env` in app code | Use `src/env.ts` exclusively |
| External services via Server Actions only | UI never touches Stripe, Resend, etc. directly |

## Environment Validation

All env vars validated in `src/env.ts` using `@t3-oss/env-nextjs` + Zod. See `.env.example` for required vars. Never use `process.env.X` outside `src/env.ts`.

## Hooks Convention

- Always return `{ xxx }` (an object), never a primitive value
- Shared hooks: `src/hooks/{domain}/{hook-name}.ts`
- Feature hooks: `src/features/{feature}/hooks/{hook-name}.ts`
- Module hooks: `src/features/{feature}/{module}/hooks/{hook-name}.ts`
- Query/Mutation hooks are organized by domain: `src/hooks/{domain}/*.queries.ts`, `src/hooks/{domain}/*.mutations.ts`

```ts
// ✅ Always return object
export function useDialog() {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}

// ❌ Never return primitive
export function useDialog() {
  return useState(false)
}
```

## DTO Pattern

Never trust the client. Create DTOs for communication between frontend and backend:

```ts
// Define input types from Zod schemas
const CreateUserSchema = z.object({ email: z.email(), name: z.string().min(1) })
type CreateUserInput = z.infer<typeof CreateUserSchema>

// Server Actions validate input before processing
export async function createUser(input: CreateUserInput): Promise<ActionResult<User>> { ... }
```

## Optimistic Approach

Default to optimistic updates for mutations:

```ts
useMutation({
  mutationFn: updateSubscription,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ["subscription"] })
    const previous = queryClient.getQueryData(["subscription"])
    queryClient.setQueryData(["subscription"], newData)
    return { previous }
  },
  onError: (_err, _new, context) => {
    queryClient.setQueryData(["subscription"], context?.previous)  // Rollback
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["subscription"] }),
})
```

## Feature Module Structure

```
src/features/auth/
├── components/       # Feature-specific UI components
├── hooks/            # Feature-specific hooks
├── sign-in/
│   ├── hooks/
│   │   ├── form-schema.ts
│   │   └── use-sign-in-form.ts
│   ├── sign-in-form.tsx
│   └── sign-in-page.tsx
└── sign-up/
    ├── hooks/
    ├── sign-up-form.tsx
    └── sign-up-page.tsx
```
