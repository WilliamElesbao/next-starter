# Rule: Testing

## Stack

| Tool | Purpose |
|---|---|
| Vitest | Test runner (configured in `vitest.config.ts`) |
| React Testing Library | Component and hook testing |
| `@testing-library/user-event` | Realistic user interaction simulation |
| `vitest.setup.ts` | Global test setup (matchers, mocks) |

## What Must Be Tested

| Code type | Required tests |
|---|---|
| UI components | Render, user interactions, prop variants |
| Custom hooks | State changes, side effects, edge cases |
| Server Actions | Happy path + error cases |
| Utility functions | All branches |
| Zod schemas | Valid inputs, invalid inputs, edge values |

## File Organization

Tests live alongside their source file. Actions tests go in `__tests__/`.

```
src/
├── components/ui/
│   ├── button.tsx
│   └── button.test.tsx          ✅ co-located
├── features/auth/
│   └── hooks/
│       ├── use-sign-in-form.ts
│       └── use-sign-in-form.test.ts  ✅ co-located
├── actions/           
│   ├── send-welcome-email.actions.test.ts   ✅ actions test directory
│   └── send-welcome-email.actions.ts
```

## TDD Approach

```
1. Write failing test  →  2. Implement minimum code  →  3. Refactor
```

Tests must be written before or alongside the implementation — never after.

## Component Test Pattern

```tsx
// button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Hook Test Pattern

```ts
// use-sign-in-form.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSignInForm } from './use-sign-in-form';

describe('useSignInForm', () => {
  it('initializes with empty fields', () => {
    const { result } = renderHook(() => useSignInForm());
    expect(result.current.form.getValues()).toEqual({ email: '', password: '' });
  });

  it('marks email invalid for non-email value', async () => {
    const { result } = renderHook(() => useSignInForm());
    await act(async () => {
      result.current.form.setValue('email', 'not-an-email');
      await result.current.form.trigger('email');
    });
    expect(result.current.form.formState.errors.email).toBeDefined();
  });
});
```

## Server Action Test Pattern

```ts
// send-welcome-email.actions.test.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { sendWelcomeEmail } from './send-welcome-email.actions';

vi.mock('@/lib/resend/resend-client', () => ({
  resend: { emails: { send: vi.fn().mockResolvedValue({ id: 'email-1' }) } },
}));

describe('sendWelcomeEmail', () => {
  it('returns success on valid input', async () => {
    const result = await sendWelcomeEmail({ email: 'user@test.com', name: 'Test' });
    expect(result.success).toBe(true);
  });

  it('returns error on missing email', async () => {
    const result = await sendWelcomeEmail({ email: '', name: 'Test' });
    expect(result.success).toBe(false);
  });
});
```

## Commands

```bash
bun run test            # Run all tests once
bun run test:watch      # Watch mode (development)
bun run test:coverage   # Generate coverage report
```

## Rules

- Do not weaken a test to make it pass — fix the implementation
- No `it.skip` or `it.todo` left in merged code
- Mock only external dependencies (DB, Resend, Stripe) — not internal modules
- Use `screen.getByRole` over `getByTestId` for accessibility-aware queries
