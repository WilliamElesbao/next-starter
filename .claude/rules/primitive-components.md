---
paths:
  - "src/components/ui/**/*.tsx"
---

# Primitive Components

Base UI primitives in `src/components/ui/`. These are simple, reusable, stateless components with no business logic.

## Structure Template

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/shadcn/utils"

const buttonVariants = cva(
  "base-classes focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem]",
        lg: "h-9 gap-1.5 px-2.5",
        icon: "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
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
| Variants with `cva()` | Required |
| Classes with `cn()` | Required |
| `data-slot` attribute | Required — identifies component |
| States via `data-[state]:` | Required — never conditional className |
| `focus-visible` ring on interactive elements | Required |
| `aria-label` on icon-only buttons | Required |
| `{...props}` spread at end | Required |
| `asChild` prop for polymorphic rendering | When applicable (via `Slot.Root`) |
| No `React.FC` | Forbidden |
| No hardcoded colors | Forbidden — use theme variables |

## Radix UI Primitives

```tsx
import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import * as Select from "@radix-ui/react-select"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

// Dialog
<Dialog.Root><Dialog.Portal><Dialog.Overlay /><Dialog.Content /></Dialog.Portal></Dialog.Root>

// Tabs
<Tabs.Root><Tabs.List><Tabs.Trigger /></Tabs.List><Tabs.Content /></Tabs.Root>

// Select
<Select.Root><Select.Trigger /><Select.Portal><Select.Content><Select.Item /></Select.Content></Select.Portal></Select.Root>

// Dropdown Menu
<DropdownMenu.Root><DropdownMenu.Trigger /><DropdownMenu.Portal><DropdownMenu.Content><DropdownMenu.Item /></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>
```

## Icon Guidelines

```tsx
// Icon sizing
<Check className="size-4" />
'[&_svg]:size-3.5'  // In cva variant strings

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
