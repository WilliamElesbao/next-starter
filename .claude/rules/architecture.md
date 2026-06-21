---
paths:
  - "src/**/*"
---

# Architecture

Organize every file by ownership: shared infrastructure lives in the platform layer, product code lives in self-contained features. Features never reach into each other — lift shared logic up to `src/hooks/` or `src/utils/`, never wire it sideways.

## Project Structure

```
src/
├── actions/            # Server Actions — mutations only (writes via external services)
├── app/                # Next.js App Router
│   ├── [locale]/       # i18n-aware routes
│   └── api/            # Route Handlers (Better Auth, client-side reads, webhooks)
├── components/         # Shared components used across the entire application
│   └── ui/             # shadcn/ui primitives (Radix UI based)
├── constants/          # Shared constants
├── contexts/           # Shared contexts
├── data/               # Server-side data-access layer — reads for Server Components
├── database/           # Prisma connection helper
├── features/           # Feature modules (isolated, self-contained)
│   ├── auth/
│   └── dashboard/
├── hooks/              # Shared hooks used across the entire application
├── lib/                # Reusable libraries preconfigured for the application
├── middleware/         # Middleware modules (auth, i18n, cookies)
├── providers/          # React providers (Theme, QueryClient, Toaster)
├── scripts/            # Maintenance scripts
├── styles/             # Global styles (CSS variables, Tailwind)
├── utils/              # Pure utility functions
├── dev/                # Devtools (development only)
├── stores/             # Global state stores (jotai, zustand, etc.)
└── env.ts              # Environment validation (single source of truth)
```

## Platform vs Feature

| Layer | Paths | Scope |
|---|---|---|
| Platform | `src/lib/`, `src/providers/`, `src/middleware/`, `src/database/`, `src/utils/` | Shared infrastructure |
| Feature | `src/features/*/` | Isolated, self-contained modules |

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

## Context Scoping

`src/contexts/` holds **global** contexts (shared across 2+ features). Each feature can have its own isolated context under `src/features/{feature}/contexts/`. If a feature context needs to be shared, move it to `src/contexts/` — never import it cross-feature.

Scope hierarchy: `Global (src/contexts/) → Feature → Page / Module → Component`

See `.claude/rules/contexts.md` for the full pattern and rules.

## Core Principles

| Principle | Enforcement |
|---|---|
| Server Components first | Add `'use client'` only when state, effects, or browser APIs are needed |
| Feature isolation | Features do not cross-import |
| Type safety | No `any`; minimize type assertions |
| Named exports | No default exports (except App Router page wrappers) |
| No barrel files | No `index.ts` that only re-exports |
| No `process.env` in app code | Use `src/env.ts` exclusively |
| Reads use the data layer | Server Components call `src/data/*`; client reads hit a Route Handler |
| Mutations use Server Actions | `src/actions/*` is the only place the UI writes to external services |

## Hooks Convention

```ts
// ✅ Always return an object — never a primitive
export function useDialog() {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}

// ❌ Never return primitive
export function useDialog() {
  return useState(false)
}
```

| Scope | Path |
|---|---|
| Shared hook | `src/hooks/{domain}/{hook-name}.ts` |
| Feature hook | `src/features/{feature}/hooks/{hook-name}.ts` |
| Module hook | `src/features/{feature}/{module}/hooks/{hook-name}.ts` |
| Shared query hooks | `src/hooks/{domain}/*.queries.ts` |
| Shared mutation hooks | `src/hooks/{domain}/*.mutations.ts` |
| Feature query hooks | `src/features/{feature}/hooks/*.queries.ts` |
| Feature mutation hooks | `src/features/{feature}/hooks/*.mutations.ts` |

> **Rule:** Place a hook in `src/hooks/` only when it is used by more than one feature.
> If a hook is only used inside one feature, it belongs in `src/features/{feature}/hooks/`.

## DTO Pattern

```ts
const CreateUserSchema = z.object({ email: z.email(), name: z.string().min(1) })
type CreateUserInput = z.infer<typeof CreateUserSchema>
export async function createUser(input: CreateUserInput): Promise<ActionResult<User>> { ... }
```

## Optimistic Updates

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
    queryClient.setQueryData(["subscription"], context?.previous)
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["subscription"] }),
})
```
