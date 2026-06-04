# Quality Control Checklist

> Used by `agents/code-reviewer.md`. Every item maps to a rule document.

## Architecture — `rules/architecture.md`

- [ ] Code follows feature-based architecture: feature code inside `src/features/{feature}/`
- [ ] No cross-feature imports (feature A importing from feature B)
- [ ] Shared complex components in `src/components/`
- [ ] Shared hooks in `src/hooks/{domain}/`
- [ ] File names follow `kebab-case` convention
- [ ] Hooks prefixed with `use-`; action files suffixed with `.actions.ts`
- [ ] Named exports (no default exports)

## Components — `rules/components.md`, `rules/primitive-components.md`, `rules/compound-components.md`

- [ ] UI primitives in `src/components/ui/` — no business logic
- [ ] Complex components use the Compound Component pattern
- [ ] Props defined as a named `interface`
- [ ] Variants with `cva()` from `class-variance-authority`
- [ ] `<Image />` (next/image) used — no raw `<img>` tags
- [ ] No hardcoded English strings — all text via `useTranslations()` / `getTranslations()`
- [ ] `cn()` used for all conditional class merging
- [ ] `data-slot` attribute for component identification
- [ ] `'use client'` present only when necessary (state, effects, browser APIs)
- [ ] `'use client'` boundary pushed as low in the tree as possible
- [ ] No `React.FC` — plain function components

## Data & State — `rules/data-fetching.md`, `rules/forms.md`

- [ ] TanStack Query used for server state (not `useState` + `useEffect`)
- [ ] `useQuery` calls include `staleTime`
- [ ] `queryKey` follows `[domain, ...identifiers]` shape
- [ ] `useMutation` invalidates relevant queries on success
- [ ] Form schemas defined with Zod in a separate `form-schema.ts` file
- [ ] Types derived from schemas with `z.infer<typeof Schema>`
- [ ] Zod v4 custom errors: `{ error: "localized.message" }`
- [ ] Form inputs wrapped with `<Controller />` from react-hook-form

## Contexts & Providers

- [ ] Contexts live in `src/contexts/`
- [ ] Providers live in `src/providers/`
- [ ] Context value and updater both exported from a single context file

## TypeScript — `rules/typescript.md`

- [ ] No `any` types
- [ ] No excessive type assertions (`as SomeType`)
- [ ] TypeScript `enum` replaced with `const` object + derived type
- [ ] Prisma types imported from `@prisma/client` — not redefined manually
- [ ] Server Action return type is explicitly `Promise<ActionResult<T>>`
- [ ] No `forwardRef` — use `ref` as regular prop

## Server Actions — `rules/server-actions.md`

- [ ] File begins with `'use server'`
- [ ] All inputs validated with Zod `safeParse` before any DB call
- [ ] Session retrieved and checked before any mutation
- [ ] Ownership verified: user can only modify their own resources
- [ ] All async calls wrapped with `safePromise`
- [ ] Returns `{ success: true, data }` or `{ success: false, error }` shape
- [ ] Raw DB / Stripe / external error messages not returned to client
- [ ] `env` from `src/env.ts` — no `process.env` in action files

## Server Components — `rules/components.md`, `rules/loading-states.md`

- [ ] Async data fetching done directly in the component (`async/await`)
- [ ] No `useState`, `useEffect`, or browser APIs
- [ ] Wrapped in `<Suspense>` with a skeleton fallback

## Client Components — `rules/components.md`, `rules/primitive-components.md`

- [ ] `'use client'` present and required
- [ ] No direct DB or Server Action calls outside of mutations
- [ ] Heavy components loaded with `next/dynamic`

## Testing — `rules/testing.md`

- [ ] Unit test added for every new component
- [ ] Unit test added for every new hook
- [ ] Server Actions have test coverage for happy path and error cases
- [ ] No `it.skip` or `it.todo` left in merged code
- [ ] Mocks only applied to external dependencies

## Styling — `rules/primitive-components.md`, `globals.css`

- [ ] Tailwind utility classes only — no inline styles
- [ ] Theme CSS variables used — no hardcoded color values
- [ ] `data-slot` + `data-*` attributes for states (not conditional className)

## i18n — `rules/i18n.md`

- [ ] New keys added to both `en.json` and `pt-BR.json`
- [ ] `useTranslations()` used in Client Components
- [ ] `getTranslations()` used in Server Components (await)
- [ ] Navigation via `@/lib/i18n/navigation` — not `next/link` / `next/navigation` directly

## Security — `skills/security-review.md`

- [ ] Auth session checked before every mutation
- [ ] Resource ownership verified after session check
- [ ] No `process.env` outside `src/env.ts`
- [ ] No raw error messages exposed to client

## Code Quality

- [ ] No duplicated logic — promoted to shared util/hook if used in 2+ places
- [ ] Functions are small and single-responsibility
- [ ] No comments explaining WHAT code does (see `memory/feedback_fewer_comments.md`)

## Skills Required for Review

| Skill | Reference |
|---|---|
| Code review | `agents/code-reviewer.md` |
| Component review | `rules/components.md` + `rules/primitive-components.md` + `rules/compound-components.md` |
| `next-intl` usage | `rules/i18n.md` |
| Data fetching | `rules/data-fetching.md` + `rules/forms.md` |
| TDD | `rules/testing.md` |
