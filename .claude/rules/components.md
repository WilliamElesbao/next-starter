---
paths:
  - "src/components/**/*.tsx"
  - "src/components/ui/**/*.tsx"
  - "src/features/*/components/**/*.tsx"
---

# Components

Default to Server Components. Reach for `'use client'` only when you need state, effects, or browser APIs — and push that boundary as low in the tree as it goes. Build from primitives up: `ui/` primitives, then shared compositions, then feature components.

## Organization

| Directory | Content | Example |
|---|---|---|
| `src/components/ui/` | Base UI primitives — no business logic | Button, Input, Card, Dialog |
| `src/components/` | Composition components built from primitives | DataTable, SiteHeader, Sidebar |
| `src/features/*/components/` | Feature-specific components | AuthForm, DashboardCards |

## Naming

| Convention | Example |
|---|---|
| Files: lowercase with hyphens | `user-card.tsx`, `use-modal.ts` |
| Exports: named, never default | `export function Button` |
| No barrel files for internal folders | No `index.ts` that only re-exports |

## Props Pattern

```tsx
import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}
```

- Extend `ComponentProps<"element">` when wrapping native HTML elements
- Use `VariantProps` from `cva` for variant-based styling
- Do NOT use `React.FC` — use plain function components

## Server vs Client Components

| Requires `'use client'` | Stays Server Component |
|---|---|
| `useState`, `useEffect`, `useReducer` | `async/await` data fetching |
| Browser APIs (`localStorage`, `window`) | Prisma DB queries |
| Event handlers (`onClick`, `onChange`) | Server Actions |
| TanStack Query hooks | Static rendering |
| Third-party React hooks | Streamed children |

Push `'use client'` boundary as low as possible.

```tsx
// ✅ Server Component — default
async function SubscriptionList() {
  const subs = await db.subscription.findMany()
  return <ul>{subs.map(s => <li key={s.id}>{s.status}</li>)}</ul>
}

// ✅ Client Component — only where needed
"use client"
function ToggleButton() {
  const [open, setOpen] = useState(false)
  return <button onClick={() => setOpen(!open)}>{open ? "Close" : "Open"}</button>
}
```

## Server Component Data Flow

```tsx
// Server Component (parent) — passes serializable data down
async function Page() {
  const user = await getUser()
  return <UserProfile user={user} />
}

// Client Component (child)
"use client"
function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>
}
```

## Avoid Deeply Nested Functions

Extract nested rendering into small helper components — one level of nesting max.

```tsx
// ❌ Too many nested levels
function ItemList({ items }: Props) {
  return items.map(item => (
    <div key={item.id}>
      {item.children.map(child => (
        <div>
          {child.grandchildren.map(grandchild => (
            <span>{grandchild.name}</span>
          ))}
        </div>
      ))}
    </div>
  ))
}

// ✅ Extract helper components
function GrandchildItem({ grandchild }: { grandchild: Grandchild }) {
  return <span>{grandchild.name}</span>
}

function ChildItem({ child }: { child: Child }) {
  return (
    <div>
      {child.grandchildren.map(gc => <GrandchildItem key={gc.id} grandchild={gc} />)}
    </div>
  )
}

function ItemList({ items }: Props) {
  return items.map(item => (
    <div key={item.id}>
      {item.children.map(c => <ChildItem key={c.id} child={c} />)}
    </div>
  ))
}
```

## Color System

CSS variables defined in `src/styles/globals.css`. **Never hardcode colors** — use theme variables.

| Role | Tailwind Class |
|---|---|
| Page background | `bg-background` / `text-foreground` |
| Card surface | `bg-card` / `text-card-foreground` |
| Popover surface | `bg-popover` / `text-popover-foreground` |
| Subtle background | `bg-muted` / `text-muted-foreground` |
| Accent highlight | `bg-accent` / `text-accent-foreground` |
| Primary action | `bg-primary` / `text-primary-foreground` |
| Secondary action | `bg-secondary` / `text-secondary-foreground` |
| Destructive action | `bg-destructive` / `text-destructive` |
| Borders | `border-border` / `border-input` |
| Focus ring | `ring-ring` |
| Sidebar | `bg-sidebar` / `text-sidebar-foreground` |

## `<Image />` Usage

Always use `next/image` — never `<img>`.

```tsx
import Image from "next/image"

<Image src="/logo.svg" alt="Logo" width={120} height={40} priority />
<Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
```
