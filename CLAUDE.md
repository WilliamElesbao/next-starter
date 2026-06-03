# Next Starter

## Overview

This is a Next.js 16 starter project with TypeScript, featuring a feature-based architecture, server-first approach, and modern tooling.

## Tech Stack

- **Framework**: Next.js 16.2.6 with React 19.2.4
- **Language**: TypeScript 5.9+
- **Package Manager**: Bun 1.3+
- **Database**: PostgreSQL + Prisma 7.8.0
- **Styling**: Tailwind CSS v4 + Radix UI
- **State Management**: TanStack Query v5
- **Forms**: React Hook Form + Zod
- **Auth**: Better Auth
- **Email**: Resend + React Email
- **Payments**: Stripe
- **Testing**: Vitest
- **Linting**: Biome
- **Containization**: Docker

## Architecture
This project uses Feature-Based Architecture

See [`.claude/rules/feature-based-architecture.md`](./.claude/rules/feature-based-architecture.md)

## Core Principles
1. Server Components First — Use Server Components por padrão. Adicione "use client" somente quando o componente precisar de estado, efeitos, APIs do navegador ou interação direta do usuário. Mantenha a menor árvore possível de Client Components.
2. Feature Isolation - Features are self-contained and don't cross-import
3. Type Safety - Strong typing everywhere; no any; avoid unnecessary type assertions and prefer proper typing before resorting to them
4. Named Exports - No default exports (except App Router pages)
5. No Barrel Files - Avoid pure re-export index.ts files;
6. DRY Code - Extract repeated patterns into utilities
7. Performance - Leverage Next.js caching, optimistic updates, cursor pagination
8. TDD - você deve escrever o teste automatizado de uma funcionalidade antes de escrever o código que a fará funcionar

## Project Structure
```
next-starter/
├── emails/                         # React Email & Email Templates
├── prisma/                         # Prisma config
│   └── schema.prisma               # Prisma Models
├── prisma.config.ts                # Prisma config
├── public/                         # Assets
└── src/
    ├── actions/                    # Server Actions (external service calls)
    ├── app/                        # Next.js App Router
    │   ├── [locale]/               # i18n routes
    │   ├── api/                    # Next.js api route
    │   │   └── auth/               # Better Auth api config
    │   │       └── [...all]/
    │   │           └── route.ts
    │   └── layout.tsx              # global layout setup
    ├── components/                 # Shared UI components (Header, Footer, Dialogs, etc.)
    │   └── ui/                     # Base UI primitives (Avatar, Button, Text, etc.)
    ├── constants/                  # Shared constants
    ├── contexts/                   # Global contexts
    ├── database/                   # Client to connect to the database
    ├── feature/                    # Feature modules
    ├── hooks/                      # Shared hooks
    ├── lib/                        # external integrations
    │   ├── better-auth/
    │   ├── dayjs/
    │   ├── i18n/
    │   ├── react-query/
    │   ├── resend/
    │   ├── shadcn/
    │   └── stripe/
    ├── middleware/                 # Next.js middeware helpers
    ├── providers/                  # Global Providers (ThemeProvider, QueryClientProvider)
    ├── scripts/                    # Maintenance script
    ├── styles/                     # global styles
    ├── utils/                      # Shared utilities
    ├── proxy.ts                    # Next.js middleware
    └── env.ts                      # Environment validation
```

## Documentation Structure
`.claude/rules/` - Coding standards and conventions (auto-included by file pattern)
`.claude/skills/` - Reference patterns and examples (manually included)
`.claude/commands/` - Custom commands (/review, /fix-issue)
`.claude/agents/` - Specialized agents (code-reviewer, security-auditor)
`.claude/memory/` - <add a bit description here>

## Common Commands

```bash
# Development
bun run dev              # Start dev server
bun run build            # Production build
bun run start            # Start production server

# Database
bun run db:generate      # Generate Prisma client
bun run db:migrate       # Run migrations
bun run db:studio        # Open Prisma Studio

# Code Quality
bun run lint:fix         # Fix linting issues
bun run format           # Format code
bun run test             # Run tests
bun run test:coverage    # Test with coverage

# i18n
bun run locale-check     # Validate translations
bun run locale-unused    # Find unused keys

# Docker
docker compose up -d     # Start services
docker compose down      # Stop services
```

## Quick Reference

- **File Naming**: `kebab-case` (e.g., `user-card.tsx`, `use-modal.ts`)
- **Component Props**: Extend `React.ComponentProps<'element'>` + `VariantProps`
- **Styling**: Use `cn()` for class merging, `data-*` attributes for states
- **Environment**: Import from `@/env`, never use `process.env` directly
- **Database**: Always use Server Actions, never expose Prisma to client
- **Forms**: React Hook Form + Zod validation + Server Actions
- **TDD**: Test-Driven Development, teste + funcionalidade

## Getting Help

- Check `.claude/rules/` for specific topics (TypeScript, React, styling, etc.)
- Check `.claude/skills/` for patterns and examples
- Run `/review` to review code changes
- Run `/fix-issue <number>` to fix a GitHub issue