---
paths:
  - "src/components/**/*.tsx"
  - "src/features/*/components/**/*.tsx"
---

# React Component Rules

## File Structure

```tsx
import * as React from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { cn } from "@/lib/shadcn/utils"

export const buttonVariants = tv(
  "base-classes",
  {
    variants: {
      variant: { default: "...", secondary: "..." },
      size: { default: "...", sm: "..." },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      data-slot="button"
      data-disabled={disabled ? "" : undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
```

## Component Organization

- **Base UI components** (`src/components/ui/`): Simple, reusable, no business logic
- **Composition components** (`src/components/`): Built from UI primitives, handle composition
- **Feature components** (`src/features/*/components/`): Feature-specific, isolated

## When to Use Compound Components

✅ **Use when**:
- Building complex forms with multiple field types
- Creating Section, Card, Dialog components with multiple parts (header, content, footer)
- Building data tables with header, body, footer, pagination
- Creating modals/dialogs with header, content, footer
- Building navigation components with multiple sections

❌ **Avoid when**:
- Building simple, single-purpose components
- Components don't have a clear parent-child relationship
- Sub-components are rarely used together

## Folder Structure for Compound Components

```txt
src/features/contact/
├── components/
│   ├── contact-form/
│   │   ├── form-root.tsx
│   │   ├── form-input.tsx
│   │   ├── form-phone.tsx
│   │   ├── form-text-area.tsx
│   │   ├── form-submit.tsx
│   │   └── contact-form.tsx              # Namespace assembly
│   └── contact-section.tsx
├── hooks/
│   └── use-contact-form.ts
└── contact.tsx
```

## Rules

- ✅ Always use named exports, never default exports
- ✅ Props: Extend `React.ComponentProps<'element'>` + `VariantProps`
- ✅ Styling: Use `cn()` for class merging, `data-slot` for identification
- ✅ States: Use `data-[state]:` attributes, not className conditionals
- ✅ Focus: Always include `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`
- ✅ Icons: Use `className="size-4"` for sizing
- ✅ Icon buttons: Always include `aria-label`
- ✅ Props spread: Always at the end `{...props}`
- ✅ Use `Object.assign()` for compound component namespaces
- ❌ Never use React.FC
- ❌ Never use default exports (except App Router pages)
- ❌ Never hardcode colors (use theme variables)

## UI Library

This project uses **Radix UI** for accessible component primitives:

```tsx
import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import * as Select from "@radix-ui/react-select"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
```

**Note**: `@base-ui/react` is also installed but Radix UI is preferred for new components.

## Color System

Use CSS variables from theme:

- Backgrounds: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`
- Text: `text-foreground`, `text-card-foreground`, `text-muted-foreground`
- Borders: `border-border`, `border-input`
- Focus: `ring-ring`
- Actions: `bg-primary`, `bg-destructive`

Never hardcode colors.

## Server Components

```tsx
// ✅ Server Component (default)
export async function UserCard({ userId }: Props) {
  const user = await getUser(userId)

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}
```

## Client Components

Use "use client" only when necessary:

```tsx
// ✅ Client Component (only when needed)
"use client"

import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

## Avoid Deeply Nested Functions

```tsx
// ❌ Too many nested levels
function Component() {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          {item.children.map((child) => (
            <div>
              {child.grandchildren.map((grandchild) => (
                <span>{grandchild.name}</span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ✅ Extract into helper components
function GrandchildItem({ grandchild }: Props) {
  return <span>{grandchild.name}</span>
}

function ChildItem({ child }: Props) {
  return (
    <div>
      {child.grandchildren.map((grandchild) => (
        <GrandchildItem
          key={grandchild.id}
          grandchild={grandchild}
        />
      ))}
    </div>
  )
}

function ItemList({ items }: Props) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          {item.children.map((child) => (
            <ChildItem
              key={child.id}
              child={child}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
```