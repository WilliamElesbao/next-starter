---
paths:
  - "src/components/**/*.tsx"
  - "src/components/ui/**/*.tsx"
  - "src/features/*/components/**/*.tsx"
---

# Primitive Components

Base UI primitives in `src/components/ui/`. These are simple, reusable, stateless components with no business logic.

## Structure Template

```tsx
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'
import type { ComponentProps } from 'react'

export const buttonVariants = tv({
	base: [
		'inline-flex cursor-pointer items-center justify-center font-medium rounded-lg border transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
	],
	variants: {
		variant: {
			primary: 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover',
			secondary: 'border-border bg-secondary text-secondary-foreground hover:bg-muted',
			ghost: 'border-transparent bg-transparent text-muted-foreground hover:text-foreground',
			destructive: 'border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90',
		},
		size: {
			sm: 'h-6 px-2 gap-1.5 text-xs [&_svg]:size-3',
			md: 'h-7 px-3 gap-2 text-sm [&_svg]:size-3.5',
			lg: 'h-9 px-4 gap-2.5 text-base [&_svg]:size-4',
		},
	},
	defaultVariants: { variant: 'primary', size: 'md' },
})

export interface ButtonProps
	extends ComponentProps<'button'>,
		VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, disabled, children, ...props }: ButtonProps) {
	return (
		<button
			type="button"
			data-slot="button"
			data-disabled={disabled ? '' : undefined}
			className={twMerge(buttonVariants({ variant, size }), className)}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
```
## Rules

| Rule | Enforcement |
|---|---|
| Variants with `cva()` | Required |
| Classes with `twMerge()` | Required |
| `data-slot` attribute | Required — identifies component |
| States via `data-[state]:` | Required — never conditional className |
| `focus-visible` ring on interactive elements | Required |
| `aria-label` on icon-only buttons | Required |
| `{...props}` spread at end | Required |
| `asChild` prop for polymorphic rendering | When applicable (via `Slot.Root`) |
| No `React.FC` | Forbidden |
| No hardcoded colors | Forbidden — use theme variables |
| forwardRef | Forbidden |
| ref prop (React 19) | Required |

## Radix UI Primitives

```tsx
import * as Dialog from "@radix-ui/react-dialog"
import * as Tabs from "@radix-ui/react-tabs"
import * as Select from "@radix-ui/react-select"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

// Dialog
<Dialog.Root>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content />
  </Dialog.Portal>
</Dialog.Root>

// Tabs
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger />
  </Tabs.List>
  <Tabs.Content />
</Tabs.Root>

// Select
<Select.Root>
  <Select.Trigger />
  <Select.Portal>
    <Select.Content>
      <Select.Item />
    </Select.Content>
  </Select.Portal>
</Select.Root>

// Dropdown Menu
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item />
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
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
