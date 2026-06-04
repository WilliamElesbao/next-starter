---
paths:
  - "src/**/*.tsx"
  - "src/actions/**/*.ts"
  - "src/app/**/*.tsx"
  - "src/hooks/**/*.ts"
---

# Data Fetching

## Strategy Overview

| Approach | Direction | Use Case |
|---|---|---|
| Server Component async | Server → Client (props) | Initial data, read-only, SEO |
| Server Actions | Client → Server (mutation) | Forms, mutations, external services |
| TanStack Query (useQuery/useInfiniteQuery) | Client → API | Client-side read data, polling, caching |
| TanStack Query (useMutation) | Client → Server | Wrapping Server Actions with cache invalidation |

## Server Component Data Fetching

Default approach. Direct database access, no `'use client'` needed.

```tsx
// ✅ Server Component — async, direct DB access
async function SubscriptionList() {
  const subscriptions = await db.subscription.findMany()
  return (
    <ul>
      {subscriptions.map(s => (
        <li key={s.id}>{s.status}</li>
      ))}
    </ul>
  )
}
```

Pass serializable data as props to Client Component children.

## Server Actions (Mutations)

See `server-actions.md` for full pattern. All external service calls from the UI must go through Server Actions in `src/actions/`.

```ts
// src/actions/subscription.actions.ts
"use server"

import { auth } from "@/lib/better-auth/auth"
import { db } from "@/database/prisma-connection"
import { safePromise } from "@/utils/safe-promise"
import { z } from "zod"

const CancelSchema = z.object({ subscriptionId: z.string().uuid() })

export async function cancelSubscription(input: z.infer<typeof CancelSchema>) {
  const session = await auth.api.getSession({ headers: headers() })
  if (!session) return { success: false, error: "Unauthorized" }

  const parsed = CancelSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: parsed.error.message }

  const [error] = await safePromise(
    db.subscription.update({ where: { id: parsed.data.subscriptionId }, data: { status: "cancelled" } })
  )
  if (error) return { success: false, error: "Failed to cancel subscription" }

  return { success: true, data: undefined }
}
```

## Hook Organization

```
src/hooks/{domain}/
├── use-subscription.ts          # Shared hook
├── subscription.queries.ts      # TanStack Query useQuery/useInfiniteQuery wrappers
└── subscription.mutations.ts    # TanStack Query useMutation wrappers
```

Query/mutation files group related TanStack Query logic within a domain.

## TanStack Query — Client-Side Reads

```ts
// src/hooks/stripe/use-subscription.ts
import { useQuery } from "@tanstack/react-query"

export function useSubscription(userId: string) {
  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: () => fetch(`/api/subscription?userId=${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,    // Required — prevents refetch on every mount
    enabled: !!userId,             // Required — only run when userId is available
  })
}
```

### Query Key Convention

```ts
["subscription", userId]        // [domain, ...identifiers]
["plans"]                        // Static data
["user", userId, "posts"]        // Nested resource
```

## TanStack Query — Wrapping Server Actions

```ts
// src/hooks/stripe/use-subscription-form.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { cancelSubscription } from "@/actions/subscription.actions"
import { queryClient } from "@/lib/react-query/query-client";

export function useCancelSubscription() {

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] })
      toast.success("Subscription cancelled")
    },
    onError: () => toast.error("Failed to cancel subscription"),
  })
}
```

## Loading & Error States

```tsx
function SubscriptionList() {
  const { data, isLoading, isError, error } = useSubscription(userId)

  if (isLoading) return <Skeleton className="h-48 w-full" />
  if (isError) return <p className="text-destructive">{error.message}</p>
  if (!data?.length) return <p className="text-muted-foreground">No subscriptions</p>

  return <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>
}
```

## Rules Summary

| Rule | Enforcement |
|---|---|
| Server Actions for all mutations | Required |
| `safePromise` for async DB/external calls | Required |
| `staleTime` on all `useQuery` | Required |
| `enabled` guard on `useQuery` with optional params | Required |
| Return `{ success, data/error }` from Server Actions | Required |
| Never expose raw DB/Stripe errors to client | Required |
