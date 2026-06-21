---
paths:
  - "src/actions/**/*.ts"
  - "src/components/**/*.tsx"
  - "src/features/*/components/**/*.tsx"
---

# Server Actions

Server Actions handle **mutations** — the layer through which the UI writes to external services. (Reads belong in the data layer; see `data-fetching.md`.) Treat every action as a trust boundary: validate the input, authenticate the caller, verify ownership, then mutate — and never leak a raw DB, Stripe, or Resend error back to the client.

## File Structure

```
src/actions/                       
├── plans.action.ts
├── send-welcome-email.action.test.ts  # Unit tests
├── send-welcome-email.action.ts
└── subscription.action.ts
```

**Naming:** `{domain}.action.ts` — one domain per file.

## Anatomy of a Server Action

```ts
'use server';                                    // 1. Always first line

import { headers } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/lib/better-auth/auth';
import { db } from '@/database/prisma-connection';
import { env } from '@/env';
import { safePromise } from '@/utils/safe-promise';

// 2. Zod schema for input validation
const CancelSubscriptionSchema = z.object({
  subscriptionId: z.string().uuid(),
});

// 3. Derive TypeScript type from schema
type CancelSubscriptionInput = z.infer<typeof CancelSubscriptionSchema>;

// 4. Explicit return type
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// 5. Exported async function
export async function cancelSubscription(
  input: CancelSubscriptionInput,
): Promise<ActionResult> {
  // 6. Auth check — always before any mutation
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return { success: false, error: 'Unauthorized' };

  // 7. Input validation
  const parsed = CancelSubscriptionSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.message };

  // 8. Ownership check — user can only touch their own data
  const [fetchError, subscription] = await safePromise(
    db.subscription.findUnique({ where: { id: parsed.data.subscriptionId } }),
  );
  if (fetchError || !subscription) return { success: false, error: 'Not found' };
  if (subscription.userId !== session.user.id) return { success: false, error: 'Forbidden' };

  // 9. Perform mutation with safePromise
  const [error] = await safePromise(
    db.subscription.update({ where: { id: subscription.id }, data: { status: 'cancelled' } }),
  );

  // 10. Generic error — never expose raw DB/Stripe errors
  if (error) return { success: false, error: 'Failed to cancel subscription' };

  return { success: true, data: undefined };
}
```

## Mandatory Rules

| Rule | Enforcement |
|---|---|
| `'use server'` at top of every file | Required |
| All inputs validated with Zod | Required |
| Auth session checked before any mutation | Required |
| Ownership verified before DB write | Required |
| `safePromise` for all async DB/external calls | Required |
| Return `{ success, data/error }` shape | Required |
| Raw DB / Stripe / external errors never returned | Required |
| `env` from `src/env.ts` — no `process.env` directly | Required |

## When to Use Server Actions vs API Routes

| Scenario | Use |
|---|---|
| Form submission or data mutation | Server Action |
| Stripe webhook receiver | API Route (`src/app/api/`) |
| Better Auth handler | API Route (`src/app/api/auth/`) |
| External service webhook | API Route |

## Client-Side Invocation Patterns

### With `useTransition` (simple)
```tsx
'use client';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { cancelSubscription } from '@/actions/subscription.action';

function CancelButton({ subscriptionId }: { subscriptionId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await cancelSubscription({ subscriptionId });
          if (!result.success) toast.error(result.error);
          else toast.success('Subscription cancelled');
        })
      }
    >
      Cancel
    </Button>
  );
}
```

### With TanStack Query `useMutation` (preferred for complex flows)
```ts
// src/hooks/stripe/use-subscription-form.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelSubscription } from '@/actions/subscription.action';

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Subscription cancelled');
    },
    onError: () => toast.error('Failed to cancel subscription'),
  });
}
```
