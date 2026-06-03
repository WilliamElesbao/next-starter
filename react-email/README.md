# React Email Templates

Email templates for Next Starter using React Email and Resend.

## Overview

This directory contains React Email templates used by Next Starter. These templates are rendered server-side and sent via Resend.

## Integration with Next Starter

Email templates are used in Server Actions located in `src/actions/`. The Resend client is configured in `src/lib/resend/`.

## Available Templates

- `welcomeEmail.tsx` - Welcome email for new users
- `notion-magic-link.tsx` - Magic link authentication email
- `plaid-verify-identity.tsx` - Identity verification email
- `stripe-welcome.tsx` - Stripe welcome email
- `vercel-invite-user.tsx` - User invitation email

## Development

### Install Dependencies

```bash
bun install
```

### Preview Templates

To preview templates in development:

```bash
bun run dev
```

Open [localhost:3001](http://localhost:3001) with your browser to see the result.

### Build Templates

To build the templates for production:

```bash
bun run build
```

### Export Templates

To export templates:

```bash
bun run export
```

## Usage in Next Starter

Templates are used in Server Actions like this:

```tsx
import { Resend } from "@/lib/resend"
import { WelcomeEmail } from "@/emails/welcomeEmail"

export async function sendWelcomeEmail(email: string) {
  const resend = new Resend()

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Welcome to Next Starter",
    react: <WelcomeEmail />,
  })
}
```

## License

MIT License
