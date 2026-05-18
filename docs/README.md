<!-- @format -->

# Documentation

Central documentation hub for Next Starter.

## Start Here

- [Local setup](./local-setup/local-setup.md)
- [Docker deployment](./docker/deployment.md)
- [CI/CD overview](./ci-cd/README.md)

## Project standard

This repository follows a modular “platform + features” pattern:

- Platform code lives in `src/lib`, `src/providers`, `src/middleware`,
  `src/database`, and `src/utils`.
- Feature code lives in `src/feature/*` with isolated UI, hooks, and actions.
- UI is split into `src/components/ui` (shadcn primitives) and
  `src/components/origin-ui` (composition).
- Server actions live in `src/actions` and connect the UI to integrations.
- Environment validation is centralized in `src/env.ts` using Zod.

## Setup and Integrations

- [Google OAuth setup](./google/google-oauth-setup.md)
- [Stripe setup](./stripe/stripe-setup.md)

## CI/CD

- [CI/CD README](./ci-cd/README.md)
- [Pipeline architecture](./ci-cd/pipeline-architecture.md)
- [Drone setup](./ci-cd/drone-setup.md)
- [GitHub configuration](./ci-cd/github-configuration.md)
- [SonarCloud setup](./ci-cd/sonarcloud-setup.md)
- [Configuration files reference](./ci-cd/configuration-files.md)

## Testing and Quality Quick Reference

```bash
# Run all tests
bun run test

# Run tests with coverage
bun test:coverage

# i18n validation
bun locale-check
bun locale-unused

# Linting and formatting
bun lint
bun lint:fix
bun format

# Type checking
bun tsc
```

## Notes

- This repository is intended to be a reusable starter foundation.
- Keep docs aligned with real scripts/configs before merging architecture or
  workflow changes.
