---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# TypeScript

Make illegal states unrepresentable. Derive types from Zod schemas instead of hand-writing them, narrow with type guards instead of casting, and never reach for `any` to silence the compiler — the type that's hard to express is usually the bug.

## Configuration

| Setting | Value |
|---|---|
| `strict` | `true` |
| Path alias | `@/*` → `src/*` |
| Module resolution | `bundler` |

## `interface` vs `type`

| Use `interface` | Use `type` |
|---|---|
| Object shapes / component props | Union types |
| Extensible contracts | Intersection types |
| Class shapes | Mapped / conditional types |

```ts
// ✅ interface for props
interface UserCardProps {
  user: User
  onDelete: (id: string) => void
  className?: string
}

// ✅ type for unions and derived types
type Status = "active" | "inactive" | "pending"
type AdminUser = User & { permissions: string[] }
```

## Pattern: `as const` instead of `enum`

```ts
// ❌ Forbidden
enum Role { Admin = "admin", User = "user" }

// ✅ Correct
const Role = { Admin: "admin", User: "user" } as const
type Role = (typeof Role)[keyof typeof Role]
```

## Forbidden Patterns

| Pattern | Alternative |
|---|---|
| `any` | `unknown`, proper type, or generic `<T>` |
| `as SomeType` (unsafe cast) | Type guard or runtime narrowing |
| Excessive `!` (non-null assertion) | Optional chaining + `??` default |
| `@ts-ignore` | `@ts-expect-error` with an explanation comment |
| TypeScript `enum` | `const` object + derived type |
| `React.FC` | Plain function component |
| `forwardRef` (deprecated in React 19) | `ref` as a regular prop |

```ts
// ❌
const data = response as UserData
const name = user!.name

// ✅
if (!isUserData(response)) throw new Error("Invalid response")
const name = user?.name ?? "Unknown"
```

## Component Props

```tsx
interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {}
```

## Server Action Return Types

```ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function cancelSubscription(
  input: CancelInput
): Promise<ActionResult> { ... }
```

## Zod Type Inference

```ts
import { z } from "zod"

const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

// ✅ Derived type — never duplicate manually
type SignInInput = z.infer<typeof SignInSchema>
```

## Utility Types

```ts
Partial<User>                    // All props optional
Required<Config>                 // All props required
Pick<User, "id" | "name">       // Select fields
Omit<User, "password">          // Exclude fields
Record<string, Plan>             // Key-value map
ReturnType<typeof fetchUser>     // Infer return type
```

## Generics

```ts
// src/utils/safe-promise.ts
async function safePromise<T>(
  promise: Promise<T>
): Promise<[Error, null] | [null, T]> {
  try {
    return [null, await promise]
  } catch (e) {
    return [e instanceof Error ? e : new Error(String(e)), null]
  }
}
```

## Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserCard` |
| Hooks | camelCase, prefixed `use` | `useSignInForm` |
| Functions | camelCase | `formatPrice` |
| Event handlers | `on` prefix | `onSubmit` |
| Booleans | `is`, `has`, `can` prefix | `isLoading`, `hasError` |
| Constants (objects) | UPPER_SNAKE_CASE | `WELCOME_TOAST` |
| Constants (primitives) | camelCase | `maxRetries` |
| Files | kebab-case | `user-card.tsx` |
| Types | PascalCase | `UserCardProps` |
