# Quality Control Checklist

> Used by `agents/code-reviewer.md`. Every item maps to a rule document.

## Architecture — `rules/architecture.md`

- [ ] Code follows Feature-Based Architecture: feature code inside `src/features/{feature}/`
- [ ] No cross-feature imports (feature A importing from feature B)
- [ ] Shared complex components in `src/components/`
- [ ] Shared hooks in `src/hooks/{domain}/`
- [ ] File names follow `kebab-case` convention
- [ ] Hooks prefixed with `use-`; action files suffixed with `.action.ts`
- [ ] Named exports only (no default exports, except Next.js page/layout wrappers)
- [ ] No barrel files (`index.ts` that only re-export)

## Components — `rules/components.md`, `rules/primitive-components.md`, `rules/compound-components.md`

- [ ] Basic UI primitives located in `src/components/ui/` — no business logic
- [ ] Complex components follow the Compound Component pattern
- [ ] Props defined as a named `interface` extending `ComponentProps<"element">` where applicable
- [ ] Variants use `cva()` from `class-variance-authority`
- [ ] `cn()` used for all conditional class merging
- [ ] `data-slot` attribute present for component identification
- [ ] `data-variant` / `data-size` attributes set when using variants
- [ ] `'use client'` present only when necessary (state, effects, browser APIs)
- [ ] `'use client'` boundary pushed as low in the tree as possible
- [ ] No `React.FC` — plain function components only
- [ ] No `forwardRef` — use `ref` as a regular prop (React 19)
- [ ] `<Image />` (next/image) used — no raw `<img>` tags
- [ ] No hardcoded English strings — all text via `useTranslations()` / `getTranslations()`

## Hooks — `rules/architecture.md`

- [ ] Hooks always return an object `{ ... }`, never a primitive
- [ ] Shared hooks in `src/hooks/{domain}/`; feature hooks in `src/features/{feature}/hooks/`
- [ ] Query hooks in `*.queries.ts`; mutation hooks in `*.mutations.ts`
- [ ] Hook file names follow `use-{name}.ts` convention

## Contexts & Providers — `rules/contexts.md`

- [ ] Global contexts (shared across 2+ features) live in `src/contexts/`
- [ ] Feature-scoped contexts live in `src/features/{feature}/contexts/`
- [ ] No context imported from one feature into another — promote to `src/contexts/` instead
- [ ] `createContext` initialized as `Type | undefined`
- [ ] Context value wrapped in `useMemo` inside the Provider
- [ ] Consumer hook throws with a clear message when used outside its Provider
- [ ] Provider component and consumer hook exported from the same file
- [ ] Global providers live in `src/providers/`

## Data & State — `rules/data-fetching.md`, `rules/forms.md`

- [ ] TanStack Query used for server state (not `useState` + `useEffect`)
- [ ] `useQuery` calls include `staleTime`
- [ ] `enabled` guard present on `useQuery` with optional params
- [ ] `queryKey` follows `[domain, ...identifiers]` shape
- [ ] `useMutation` invalidates relevant queries on success
- [ ] `useInfiniteQuery` used for large lists, tables, and history views
- [ ] Form schemas defined with Zod in a separate `form-schema.ts` file
- [ ] Types derived from schemas with `z.infer<typeof Schema>`
- [ ] Zod v4 custom errors: `{ error: "localized.message" }` (not `{ message: "..." }`)
- [ ] Form inputs wrapped with `<Controller />` from react-hook-form

## TypeScript — `rules/typescript.md`

- [ ] No `any` types
- [ ] No excessive type assertions (`as SomeType`)
- [ ] TypeScript `enum` replaced with `const` object + derived type
- [ ] Prisma types imported from generated types — not redefined manually
- [ ] Server Action return type is explicitly `Promise<ActionResult<T>>`
- [ ] `forwardRef` not used — `ref` as regular prop

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
- [ ] Mocks applied only to external dependencies (DB, Resend, Stripe)

## Styling — `rules/primitive-components.md`, `globals.css`

- [ ] Tailwind utility classes only — no inline styles
- [ ] Theme CSS variables used — no hardcoded color values
- [ ] `data-slot` + `data-*` attributes for states (not conditional className)

## i18n — `rules/i18n.md`

- [ ] New keys added to both `en.json` and `pt-BR.json`
- [ ] `useTranslations()` used in Client Components
- [ ] `getTranslations()` used in Server Components (await)
- [ ] Navigation via `@/lib/i18n/navigation` — not `next/link` / `next/navigation` directly

## Security — `skills/security-review/SKILL.md`

- [ ] Auth session checked before every mutation
- [ ] Resource ownership verified after session check
- [ ] No `process.env` outside `src/env.ts`
- [ ] No raw error messages exposed to client

## Code Quality

- [ ] No duplicated or redundant code — promoted to shared util/hook if used in 2+ places
- [ ] Functions are small, single-responsibility, and split when overly complex
- [ ] No comments explaining WHAT code does (see `memory/feedback_fewer_comments.md`)
