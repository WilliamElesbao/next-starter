# Rule: Performance

## Server vs Client Components

Default to **Server Components**. Add `'use client'` only when the component requires it.

| Requires `'use client'` | Stays Server Component |
|---|---|
| `useState`, `useReducer`, `useEffect` | `async/await` data fetching |
| Browser APIs (`localStorage`, `window`) | Prisma DB queries |
| Event handlers (`onClick`, `onChange`) | Server Actions |
| TanStack Query hooks | Static or dynamic rendering |
| Third-party hooks | Streamed/suspended children |

```tsx
// ✅ Server Component — no directive needed
async function SubscriptionList() {
  const subscriptions = await db.subscription.findMany();
  return <ul>{subscriptions.map(s => <SubscriptionItem key={s.id} item={s} />)}</ul>;
}

// ✅ Client Component — 'use client' pushed as low as possible
'use client';
function SubscriptionItem({ item }: { item: Subscription }) {
  const [open, setOpen] = useState(false);
  return <li onClick={() => setOpen(!open)}>{item.status}</li>;
}
```

## Next.js `<Image />` Component

Never use `<img>`. Always use `next/image`.

```tsx
import Image from 'next/image';

// ✅
<Image src="/logo.svg" alt="Logo" width={120} height={40} priority />
<Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />

// ❌ Forbidden
<img src="/logo.svg" alt="Logo" />
```

## Dynamic Imports

Use `next/dynamic` for large or conditionally rendered Client Components to reduce initial bundle.

```tsx
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ChartAreaInteractive = dynamic(
  () => import('@/components/chart-area-interactive'),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false,
  },
);
```

## Suspense Boundaries

Wrap async Server Components in `<Suspense>` to enable streaming.

```tsx
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// ✅ Each async section wrapped independently
<Suspense fallback={<Skeleton className="h-48 w-full" />}>
  <SubscriptionList />
</Suspense>
```

## TanStack Query Caching

Always set `staleTime` on queries to prevent unnecessary network requests.

```ts
// ✅
const { data } = useQuery({
  queryKey: ['subscription', userId],
  queryFn: () => fetchSubscription(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: !!userId,         // only run when userId is available
});
```

## Font Optimization

Use `next/font` — never link to external CDNs.

```ts
// src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
```

## Rules Summary

| Rule | Enforcement |
|---|---|
| Default to Server Components | Required |
| `'use client'` boundary as low as possible | Required |
| `<img>` forbidden — use `<Image />` | Required |
| `next/dynamic` for heavy Client Components | Required |
| `staleTime` on all TanStack Query `useQuery` calls | Required |
| `<Suspense>` wrapping async Server Component subtrees | Required |
| Fonts via `next/font` only | Required |
