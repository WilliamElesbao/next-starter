---
paths:
  - "src/components/**/*.tsx"
  - "src/components/ui/**/*.tsx"
  - "src/features/*/components/**/*.tsx"
---

# Primitive Components

Build the base UI vocabulary in `src/components/ui/` — stateless, reusable, and free of business logic. Style every primitive with `cva` and merge classes with `cn()`; drive state off `data-*` and `aria-*` attributes, never conditional `className` strings.

## Structure Template

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "@/lib/shadcn/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        sm: "h-7 gap-1 px-2.5 text-[0.8rem]",
        default: "h-8 gap-1.5 px-2.5",
        lg: "h-9 gap-1.5 px-2.5",
        icon: "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

## Rules

| Rule | Enforcement |
|---|---|
| Variants defined with `cva()` | Required |
| Classes merged with `cn()` (from `@/lib/shadcn/utils`) | Required |
| `data-slot` attribute | Required — identifies the component |
| State driven by `data-*` / `aria-*` selectors | Required — never conditional `className` |
| `focus-visible` ring on interactive elements | Required |
| `aria-label` on icon-only buttons | Required |
| `{...props}` spread at the end | Required |
| Polymorphism via `asChild` + `Slot.Root` from `radix-ui` | When polymorphic rendering is needed |
| `React.FC` | Forbidden — plain function components |
| Hardcoded colors | Forbidden — use theme variables |
| `forwardRef` (React 19) | Forbidden — pass `ref` as a regular prop |

## Radix UI Primitives

```tsx
import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import * as Select from "@radix-ui/react-select"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

<Dialog.Root><Dialog.Portal><Dialog.Overlay /><Dialog.Content /></Dialog.Portal></Dialog.Root>
<Tabs.Root><Tabs.List><Tabs.Trigger /></Tabs.List><Tabs.Content /></Tabs.Root>
<Select.Root><Select.Trigger /><Select.Portal><Select.Content><Select.Item /></Select.Content></Select.Portal></Select.Root>
<DropdownMenu.Root><DropdownMenu.Trigger /><DropdownMenu.Portal><DropdownMenu.Content><DropdownMenu.Item /></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>
```

## Icon Guidelines

```tsx
// Icon sizing
<Check className="size-4" />
"[&_svg]:size-3.5"  // In cva variant strings

// Icon buttons require aria-label
<button aria-label="Close"><X className="size-4" /></button>
```

## Dynamic Imports for Heavy Components

```tsx
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const ChartAreaInteractive = dynamic(
  () => import("@/components/chart-area-interactive"),
  { loading: () => <Skeleton className="h-64 w-full" />, ssr: false }
)
```
