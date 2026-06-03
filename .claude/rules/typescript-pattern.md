# Rule: TypeScript Patterns

## Configuration
TypeScript runs in **strict mode**. All strict checks are enabled.

## `interface` vs `type`

| Use `interface` | Use `type` |
|---|---|
| Object shapes / component props | Union types |
| Extensible contracts | Intersection types |
| Class shapes | Mapped / conditional types |

```ts
// ✅ interface for props and object shapes
interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
  className?: string;
}

// ✅ type for unions and intersections
type Status = 'active' | 'inactive' | 'pending';
type AdminUser = User & { permissions: string[] };
```

## Forbidden Patterns

| Pattern | Alternative |
|---|---|
| `any` | `unknown`, proper type, or generic `<T>` |
| `as SomeType` (unsafe cast) | Type guard or runtime narrowing |
| Excessive `!` (non-null assertion) | Optional chaining + null check |
| `@ts-ignore` | Fix the error or use `@ts-expect-error` with a comment |
| TypeScript `enum` | `const` object + derived type |

```ts
// ❌ Forbidden
const data = response as UserData;
const name = user!.name;
enum Role { Admin = 'admin' }

// ✅ Correct
if (!isUserData(response)) throw new Error('Unexpected response shape');
const name = user?.name ?? 'Unknown';
const Role = { Admin: 'admin', User: 'user' } as const;
type Role = (typeof Role)[keyof typeof Role];
```

## Component Props

```ts
// ✅ Explicit interface; extend HTML element props when wrapping native elements
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

function Button({ variant = 'primary', isLoading, ...props }: ButtonProps) {
  return <button disabled={isLoading} {...props} />;
}
```

## Server Action Return Types

Always declare an explicit return type for Server Actions.

```ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createUser(input: CreateUserInput): Promise<ActionResult<User>> { ... }
```

## Utility Types

Use built-in TypeScript utilities before creating custom ones.

```ts
Partial<User>                    // all props optional
Required<Config>                 // all props required
Pick<User, 'id' | 'name'>        // select fields
Omit<User, 'password'>           // exclude fields
Record<string, Plan>             // key-value map
ReturnType<typeof fetchUser>     // infer return type
Parameters<typeof handler>[0]    // infer first param
```

## Prisma Types

Import generated model types from the Prisma generated client.

```ts
import type { User, Subscription } from '@/prisma/generated/models';
```

Never redefine types that already exist in the generated models.

## Generics

Use generics for reusable utilities instead of duplicating types.

```ts
// src/utils/safe-promise.ts
async function safePromise<T>(promise: Promise<T>): Promise<[Error, null] | [null, T]> {
  try {
    return [null, await promise];
  } catch (e) {
    return [e instanceof Error ? e : new Error(String(e)), null];
  }
}
```

## Zod + Type Inference

Derive TypeScript types from Zod schemas — never duplicate them manually.

```ts
import { z } from 'zod';

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignInInput = z.infer<typeof SignInSchema>; // ✅ derived
```
