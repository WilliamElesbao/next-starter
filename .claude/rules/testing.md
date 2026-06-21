---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"  
  - "src/components/**/*.tsx"
  - "src/features/*/components/**/*.tsx"
---

# Testing

Write the test first, then the minimum code to pass it. Verify behavior through public interfaces — what the user observes — not implementation details, so the suite survives a refactor. Never weaken a test to make it pass: fix the implementation.

## Stack

| Tool | Purpose |
|---|---|
| Vitest | Test runner |
| React Testing Library | Component and hook testing |
| `@testing-library/user-event` | Realistic user interactions |
| `vitest.setup.ts` | Global setup (matchers, mocks) |

## What Must Be Tested

| Code type | Required tests |
|---|---|
| UI components | Render, user interactions, prop variants |
| Custom hooks | State changes, side effects, edge cases |
| Server Actions | Happy path + error cases |
| Utility functions | All branches |

## TDD Workflow

```
1. Write failing test → 2. Implement minimum code → 3. Refactor
```

Tests must be written before or alongside the implementation.

## File Organization

Tests co-located with source files:

```
src/components/ui/
├── button.tsx
└── button.test.tsx              ✅ co-located

src/actions/
├── send-welcome-email.action.ts
└── send-welcome-email.action.test.ts   ✅ co-located

src/features/auth/sign-in/hooks/
├── use-sign-in-form.ts
└── use-sign-in-form.test.ts            ✅ co-located
```

## Component Test Pattern

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("applies variant attributes", () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "destructive")
  })

  it("merges custom className", () => {
    render(<Button className="custom">B</Button>)
    expect(screen.getByRole("button")).toHaveClass("custom")
  })
})
```

## Hook Test Pattern

```ts
import { renderHook, act } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useSignInForm } from "./use-sign-in-form"

describe("useSignInForm", () => {
  it("initializes with empty fields", () => {
    const { result } = renderHook(() => useSignInForm())
    expect(result.current.form.getValues()).toEqual({ email: "", password: "" })
  })

  it("marks email invalid for non-email value", async () => {
    const { result } = renderHook(() => useSignInForm())
    await act(async () => {
      result.current.form.setValue("email", "not-an-email")
      await result.current.form.trigger("email")
    })
    expect(result.current.form.formState.errors.email).toBeDefined()
  })
})
```

## Server Action Test Pattern

```ts
import { describe, expect, it, vi } from "vitest"
import { sendWelcomeEmail } from "./send-welcome-email.action"

vi.mock("@/lib/resend/resend-client", () => ({
  resend: { emails: { send: vi.fn().mockResolvedValue({ id: "email-1" }) } },
}))

describe("sendWelcomeEmail", () => {
  it("returns success on valid input", async () => {
    const result = await sendWelcomeEmail({ email: "user@test.com", name: "Test" })
    expect(result.success).toBe(true)
  })

  it("returns error on missing email", async () => {
    const result = await sendWelcomeEmail({ email: "", name: "Test" })
    expect(result.success).toBe(false)
  })
})
```

## Commands

```bash
bun run test            # Run all tests once
bun run test:watch      # Watch mode
bun run test:coverage   # Coverage report
```

## Rules

- Use `screen.getByRole` over `getByTestId` for accessibility-aware queries
- Do not weaken a test to make it pass — fix the implementation
- No `it.skip` or `it.todo` left in merged code
- Mock only external dependencies (DB, Resend, Stripe) — not internal modules
