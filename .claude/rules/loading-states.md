---
paths:
  - "src/**/*.tsx"
---

# Loading States

## Decision Table

| Goal | Tool | When |
|---|---|---|
| Async loading fallback | `<Suspense>` | Data fetching, code splitting, streaming |
| Hide/show without losing state | `<Activity>` | Tabs, sidebars, internal navigation |
| Skeleton placeholders | `<Skeleton>` | Visual loading indicator |
| Form submission loading | `useActionState` | Server Action submissions |
| Reading Promise/Context values | `use` hook | Inside `<Suspense>` boundaries |

## `<Suspense>` — Async Loading

Wrap async Server Components to enable streaming:

```tsx
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// ✅ Each async section wrapped independently
<Suspense fallback={<Skeleton className="h-48 w-full" />}>
  <SubscriptionList />
</Suspense>
```

**Use for:** Data fetching, `React.lazy()`, Server Components, streaming SSR.

## `<Activity>` — Preserve State When Hidden

React 19 `Activity` hides a component tree without unmounting it:

```tsx
import { Activity } from "react"

<Activity mode={activeTab === "profile" ? "visible" : "hidden"}>
  <Profile />
</Activity>
```

When hidden:
- State (`useState`) is preserved
- Effects (`useEffect`) are unmounted
- Background priority rendering continues
- Restored instantly when visible

**Use for:** Tabs, dashboards, sidebars, chats, internal page navigation.

## Combined Pattern

```tsx
// ✅ Both behaviors together
<Activity mode={activeTab === "posts" ? "visible" : "hidden"}>
  <Suspense fallback={<Spinner />}>
    <Posts />
  </Suspense>
</Activity>
```

| Behavior | Suspense | Activity |
|---|---|---|
| Async loading | ✅ | ❌ |
| Fallback UI | ✅ | ❌ |
| Hide without destroying state | ❌ | ✅ |
| Preserve scroll / inputs | ❌ | ✅ |
| Background rendering | Partial | ✅ |

## `<Skeleton>` Component

```tsx
import { Skeleton } from "@/components/ui/skeleton"

// Placeholder for any content
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-8 w-full" />

// Card skeleton
<div className="flex flex-col gap-3 p-4">
  <Skeleton className="h-5 w-[200px]" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

## TanStack Query Loading States

```tsx
function SubscriptionList() {
  const { data, isLoading, isError, error } = useSubscription(userId)

  if (isLoading) return <Skeleton className="h-48 w-full" />
  if (isError) return <ErrorState message={error.message} />

  return <ul>{data.map(item => <li key={item.id}>{item.name}</li>)}</ul>
}
```

## `use` Hook — Read Promise/Context in Suspense

React 19 `use` reads a Promise (suspending until resolved) or Context value inside a `<Suspense>` boundary:

```tsx
import { use } from "react"

function Comments({ promise }: { promise: Promise<Comment[]> }) {
  const comments = use(promise)
  return <ul>{comments.map(c => <li key={c.id}>{c.text}</li>)}</ul>
}

// Parent suspends automatically via <Suspense>
<Suspense fallback={<Skeleton className="h-32 w-full" />}>
  <Comments promise={fetchComments(postId)} />
</Suspense>
```

Use for streaming data from Server Components to Client Components.

## Server Action Loading (useActionState)

```tsx
"use client"
import { useActionState } from "react"
import { cancelSubscription } from "@/actions/subscription.actions"

function CancelForm({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(
    async (_: unknown) => cancelSubscription({ subscriptionId: id }),
    null
  )

  return (
    <form action={formAction}>
      <Button disabled={isPending}>
        {isPending ? "Cancelling..." : "Cancel Subscription"}
      </Button>
      {state && !state.success && <p className="text-destructive">{state.error}</p>}
    </form>
  )
}
```

## Rules

| Rule | Enforcement |
|---|---|
| Use `<Suspense>` for async boundaries | Required |
| Use `<Activity>` for tab/sidebar navigation | Required |
| Use `<Skeleton>` for loading placeholders | Preferred |
| Set `staleTime` on all `useQuery` | Required |
| Handle `isLoading` + `isError` states in queries | Required |
| Use `useActionState` for Server Action submissions | Preferred |
