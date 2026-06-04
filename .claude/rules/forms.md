---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# Forms

## Stack

| Tool | Purpose |
|---|---|
| `react-hook-form` | Form state management |
| `@hookform/resolvers/zod` | Schema validation bridge |
| `zod` v4 | Validation schemas |
| `next-intl` (useTranslations) | Localized error messages |

## File Structure Per Form

```
src/features/auth/sign-in/
├── hooks/
│   ├── form-schema.ts          # Zod schema + localized messages
│   └── use-sign-in-form.ts     # Form hook (useForm + onSubmit)
├── sign-in-form.tsx            # UI component
└── sign-in-page.tsx            # Page wrapper
```

## Schema File (Zod v4 + next-intl)

```ts
// form-schema.ts
import { useTranslations } from "next-intl"
import { z } from "zod"

export const useSignInFormSchema = () => {
  const t = useTranslations("validation")

  return z.object({
    email: z.email({ error: t("email.please-enter-a-valid-email") }),
    password: z.string().min(1, { error: t("password.password-is-required") }),
  })
}

export type SignInFormValues = z.infer<ReturnType<typeof useSignInFormSchema>>
```

**Zod v4 notes:**
- Custom error messages use `{ error: "..." }` (not `{ message: "..." }` as in v3)
- `z.string().email()` → `z.email()`
- Use factory functions with `useTranslations` for localized messages

## Form Hook

```ts
// use-sign-in-form.ts
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type SignInFormValues, useSignInFormSchema } from "./form-schema"

export const useSignInForm = () => {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(useSignInFormSchema()),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  })

  const onSubmit = async (values: SignInFormValues) => {
    // Server Action or auth client call
  }

  return { form, onSubmit }
}
```

## `<Controller />` Wrapping

Always wrap form inputs with `<Controller />` from React Hook Form. Use generic field components for type-safe feature forms:

```tsx
import { Controller, type FieldValues, type Path, type UseFormReturn } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface AuthFormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  type?: React.ComponentProps<typeof Input>["type"]
}

function AuthFormField<T extends FieldValues>({ form, name, label, type }: AuthFormFieldProps<T>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input type={type} {...field} id={field.name} aria-invalid={fieldState.invalid} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
```

The `form.tsx` also exports `<FormField />` (wraps `<Controller />`) for simpler use cases.

## Compound Form Components

Feature-specific forms use the compound component pattern (see `compound-components.md`):

```tsx
function SignInForm(props: React.ComponentProps<"div">) {
  const { form, onSubmit } = useSignInForm()

  return (
    <AuthForm {...props}>
      <AuthForm.Form form={form} onSubmit={onSubmit}>
        <AuthForm.Header mode="sign-in" />
        <AuthForm.Field form={form} name="email" label="Email" type="email" />
        <AuthForm.Field form={form} name="password" label="Password" type="password" />
        <AuthForm.Submit>Sign In</AuthForm.Submit>
        <AuthForm.Separator />
        <AuthForm.Socials />
      </AuthForm.Form>
      <AuthForm.Description />
    </AuthForm>
  )
}
```

## Form Submission Loading

Use `useActionState` (see `loading-states.md`) for Server Action form states, or `useFormStatus` for child components to read the parent `<form>` status:

```tsx
"use client"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  return <Button disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
}
```

## Error Handling

```tsx
// Using Sonner for toast notifications
const onSubmit = async (values: SignInFormValues) => {
  await authClient.signIn.email(values, {
    onError: (context) => {
      toast.error(t("toast.login-failed"), {
        description: context.error.message,
      })
    },
  })
}
```

## Rules Summary

| Rule | Enforcement |
|---|---|
| Schema factory function using `useTranslations` | Required |
| Zod v4 custom errors via `{ error: "..." }` | Required |
| `zodResolver` from `@hookform/resolvers` | Required |
| Always wrap with `<Controller />` | Required |
| Toast errors via Sonner | Preferred |
| Forms use compound component pattern | When feature-specific |
