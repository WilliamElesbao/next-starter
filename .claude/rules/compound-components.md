---
paths:
  - "src/components/**/*.tsx"
  - "src/components/ui/**/*.tsx"
  - "src/features/*/components/**/*.tsx"
---

# Compound Components

## When to Use

| Use compound components | Keep as single component |
|---|---|
| Card with header, content, footer | Simple button |
| Dialog/modal with header, body, actions | Single input field |
| Form with multiple field types | Icon display |
| Data table with header, body, pagination | Badge/tag |
| Navigation with sections | Separator |

## Folder Structure

```
src/features/auth/components/
├── auth-form-container.tsx
├── auth-form-description.tsx
├── auth-form-field.tsx
├── auth-form-header.tsx
├── auth-form-root.tsx
├── auth-form-separator.tsx
├── auth-form-socials.tsx
├── auth-form-submit.tsx
└── auth-form.tsx              # Namespace assembly
```

## Namespace Assembly

Use `Object.assign()` to expose sub-components:

```tsx
// auth-form.tsx
import { AuthFormContainer } from "./auth-form-container"
import { AuthFormDescription } from "./auth-form-description"
import { AuthFormField } from "./auth-form-field"
import { AuthFormHeader } from "./auth-form-header"
import { AuthFormRoot } from "./auth-form-root"
import { AuthFormSeparator } from "./auth-form-separator"
import { AuthFormSocials } from "./auth-form-socials"
import { AuthFormSubmit } from "./auth-form-submit"

export const AuthForm = Object.assign(AuthFormRoot, {
  Form: AuthFormContainer,
  Header: AuthFormHeader,
  Field: AuthFormField,
  Submit: AuthFormSubmit,
  Separator: AuthFormSeparator,
  Socials: AuthFormSocials,
  Description: AuthFormDescription,
})
```

## Usage Pattern

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

## Sub-Component Pattern

Each sub-component follows the primitive component rules (see `primitive-components.md`):

```tsx
export function AuthFormHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="auth-form-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}
```

Any component that receives children must use or extend React’s PropsWithChildren type.

```tsx
import type { PropsWithChildren } from "react";

export const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
};

```

## Checklist

- [ ] Each sub-component is a separate file (lowercase with hyphens)
- [ ] All sub-components use named exports
- [ ] `Object.assign(Root, { Sub: SubComponent, ... })` for namespace
- [ ] Root component validates props common to all children
- [ ] Sub-components are rarely used independently
