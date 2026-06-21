---
paths:
  - "src/**/*.tsx"
  - "src/actions/**/*.ts"
  - "src/app/**/*.tsx"
  - "src/hooks/**/*.ts"
---

# Data Fetching

Fetch on the server by default and pass serializable data down as props. Reach for TanStack Query on the client only when the UI has to read, poll, or paginate after hydration — and when you do, always set `staleTime` and handle every loading and error branch.

## Reads vs Writes

Separate them by mechanism — never fetch reads through a Server Action:

| Operation | Mechanism | Lives in |
|---|---|---|
| Read in a Server Component | Plain async data-access function (cached) | `src/data/*` |
| Read from a Client Component | Route Handler + `useQuery` | `src/app/api/*` + hook |
| Write / mutation | Server Action | `src/actions/*` |

> **Why not a Server Action for reads?** Server Actions are POST endpoints that run sequentially and can't be cached or deduplicated. Use them only for mutations; keep reads in the data layer where they can be wrapped in `cache()` / `unstable_cache`.

## Strategy Overview

| Approach | Direction | Use Case |
|---|---|---|
| Server Component + data layer | Server → Client (props) | Initial data, read-only, SEO |
| Server Actions | Client → Server (mutation) | Forms, mutations, external writes |
| `useQuery` + Route Handler | Client | Client-side reads, polling, caching |
| `useInfiniteQuery` | Client | Load more / infinite scroll |
| `useMutation` | Client → Server | Server Actions with cache invalidation |

## Server Component Data Fetching

Call the data layer directly and parallelize independent reads after the auth check:

```tsx
// src/data/subscription.ts — cached, server-only read
export const getActiveSubscription = cache(async () => {
  const subs = await auth.api.listActiveSubscriptions({ headers: await headers() })
  return subs[0]
})

// Server Component
async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  // ✅ parallel, not a waterfall
  const [plans, subscription] = await Promise.all([
    getStripePlans(),
    getActiveSubscription(),
  ])

  return <Dashboard plans={plans} subscription={subscription} />
}
```

## TanStack Query — Client-Side Reads
```ts
export function useSubscription(userId: string) {
  return useQuery({
    queryKey: ["subscription", userId],   // [domain, ...identifiers]
    queryFn: () => fetch(`/api/subscription?userId=${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  })
}
```

## TanStack Query — Paginated Lists
| UI pattern | Hook | When |
|---|---|---|
| Numbered pages (1, 2, 3…) | `useQuery` + `keepPreviousData` | User navigates to any page |
| Load more / infinite scroll | `useInfiniteQuery` | Sequential, cursor-based loading |

### Offset Pagination — Numbered Pages

`placeholderData: keepPreviousData` keeps the previous page visible while loading. Disable "Next" when `isPlaceholderData` is true.

```ts
import { keepPreviousData, useQuery } from "@tanstack/react-query"
interface DocumentsPage { items: DocumentItem[]; totalPages: number }
export function useDocuments(page: number) {
  return useQuery({
    queryKey: ["documents", page],
    queryFn: (): Promise<DocumentsPage> =>
      fetch(`/api/documents?page=${page}&limit=20`).then(r => r.json()),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  })
}
```

```tsx
function DocumentTable() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isPlaceholderData } = useDocuments(page)
  if (isLoading) return <Skeleton className="h-48 w-full" />
  return (
    <>
      <ul>{data?.items.map(item => <li key={item.id}>{item.title}</li>)}</ul>
      <div className="flex items-center gap-2">
        <Button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</Button>
        <span>{page} / {data?.totalPages ?? "—"}</span>
        <Button
          onClick={() => setPage(p => p + 1)}
          disabled={isPlaceholderData || page === data?.totalPages}
        >Next</Button>
      </div>
    </>
  )
}
```

### Cursor-Based Pagination — Load More / Infinite Scroll

`initialPageParam` is required in v5. Never call `fetchNextPage` while `isFetching` — a single cache entry is shared across all pages.

```ts
import { useInfiniteQuery } from "@tanstack/react-query"
interface TransactionPage { items: Transaction[]; nextCursor: string | null }
export function useTransactions() {
  return useInfiniteQuery({
    queryKey: ["transactions"],
    queryFn: ({ pageParam }): Promise<TransactionPage> =>
      fetch(`/api/transactions?cursor=${pageParam}&limit=20`).then(r => r.json()),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000,
  })
}
```

```tsx
function TransactionList() {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
    useTransactions()
  const items = data?.pages.flatMap(p => p.items) ?? []
  if (isLoading) return <Skeleton className="h-48 w-full" />
  return (
    <>
      <ul>{items.map(item => <li key={item.id}>{item.description}</li>)}</ul>
      <Button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetching}
      >
        {isFetchingNextPage ? "Loading..." : "Load more"}
      </Button>
    </>
  )
}
```

## TanStack Query — Wrapping Server Actions
```ts
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

## Rules Summary

| Rule | Enforcement |
|---|---|
| `staleTime` on all `useQuery` and `useInfiniteQuery` | Required |
| `enabled` guard on `useQuery` with optional params | Required |
| Numbered pages → `useQuery` + `keepPreviousData` | Required |
| Load more / infinite scroll → `useInfiniteQuery` | Required |
| `initialPageParam` set on every `useInfiniteQuery` | Required (v5) |
| Never call `fetchNextPage` while `isFetching` is true | Required |
| Never expose raw DB/Stripe errors to client | Required |
