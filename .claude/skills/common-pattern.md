# Skill: Common Code Patterns

## TanStack Query

Configured in `src/lib/react-query/query-client.ts`, wrapped via `src/providers/providers.tsx`.

### Query (read)

```ts
// src/hooks/stripe/use-subscription.ts
import { useQuery } from '@tanstack/react-query';
import type { Subscription } from '@/prisma/generated/models';

async function fetchSubscription(userId: string): Promise<Subscription | null> {
  const res = await fetch(`/api/subscription?userId=${userId}`);
  return res.json();
}

export function useSubscription(userId: string) {
  return useQuery({
    queryKey: ['subscription', userId],
    queryFn: () => fetchSubscription(userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}
```

### Mutation (write) — wrapping a Server Action

```ts
// src/hooks/stripe/use-subscription-form.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cancelSubscription } from '@/actions/subscription.actions';

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

### Query Key Convention

```ts
// Shape: [domain, ...identifiers]
['subscription', userId]
['plans']
['user', userId]
```

## Forms (react-hook-form + Zod)

### Step 1 — Schema file

```ts
// src/features/auth/sign-in/hooks/form-schema.ts
import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

export type SignInInput = z.infer<typeof SignInSchema>;
```

### Step 2 — Hook file

```ts
// src/features/auth/sign-in/hooks/use-sign-in-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInSchema, type SignInInput } from './form-schema';

export function useSignInForm() {
  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: '', password: '' },
  });
  return { form };
}
```

## `safePromise` Utility

Replaces try/catch boilerplate. Returns a tuple `[error, data]`.

```ts
import { safePromise } from '@/utils/safe-promise';

const [error, user] = await safePromise(
  db.user.findUnique({ where: { id } })
);

if (error) return { success: false, error: 'User not found' };
// user is typed and defined here
```

## next-intl Patterns

```ts
// Server Component
import { getTranslations } from 'next-intl/server';
async function Page() {
  const t = await getTranslations('dashboard');
  return <h1>{t('title')}</h1>;
}

// Client Component
'use client';
import { useTranslations } from 'next-intl';
function Component() {
  const t = useTranslations('auth.signIn');
  return <button>{t('submit')}</button>;
}

// i18n-aware navigation — never use next/link or next/navigation directly
import { Link, useRouter, redirect } from '@/lib/i18n/navigation';
```

## Environment Variables

```ts
// ✅ Always import from src/env.ts
import { env } from '@/env';

const key = env.STRIPE_SECRET_KEY;
const url = env.NEXT_PUBLIC_APP_URL;

// ❌ Never access process.env directly in app code
const key = process.env.STRIPE_SECRET_KEY;
```

## Date Formatting

```ts
import dayjs from '@/lib/dayjs';

dayjs(date).format('MMM D, YYYY')    // "Jun 3, 2026"
dayjs(date).fromNow()                 // "2 hours ago"
dayjs().isAfter(expiryDate)           // boolean comparison
```

## Toast Notifications

```ts
import { toast } from 'sonner';

toast.success('Subscription updated');
toast.error('Something went wrong');
toast.info('Check your email');
toast.promise(promise, {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
});
```

## Prisma Client

```ts
// Always import from the shared connection
import { db } from '@/database/prisma-connection';

const user = await db.user.findUnique({ where: { id } });
```
