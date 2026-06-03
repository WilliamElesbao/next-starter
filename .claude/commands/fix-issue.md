---
name: fix-issue
description: Fixes a GitHub issue by writing a failing test first, implementing the fix, and validating all checks pass
arguments: [issue-number]
tools: Read, Glob, Grep, Bash
model: sonnet
---

# Command: Fix Issue

## Usage
```
/fix-issue #<issue-number>
```

## Workflow

### 1 — Understand the Issue

- Read the full issue description and all comments
- Identify affected files using the project tree and feature map in `memory/MEMORY.md`
- Check if a test already exists that fails, or write one that does

### 2 — Reproduce

```bash
bun dev                          # Start dev server
bun prisma migrate dev           # Apply pending migrations (if DB change involved)
bun run test --reporter=verbose  # Confirm existing test failures (if any)
```

### 3 — Write the Failing Test First (TDD)

Before touching implementation:

```bash
# Locate or create the test file
# Run — it should FAIL
bun run test path/to/relevant.test.ts
```

See `rules/testing.md` for test patterns.

### 4 — Implement the Fix

- Minimal change — do not refactor unrelated code in the same PR
- Follow all rules in the relevant rule documents (see `memory/MEMORY.md`)
- After implementation, the test from step 3 must pass

### 5 — Validate

```bash
bun run test            # All tests must pass
bun run type-check      # No TypeScript errors
bun run lint            # Biome passes
bun run check:i18n      # i18n keys in sync (if any locale change)
```

### 6 — Commit

```bash
git checkout main && git pull origin main
git checkout -b fix/{scope}-{short-description}

git add -p   # Stage only fix-related changes
git commit -m "fix({scope}): {imperative description of what was fixed}"
```

**Commit examples:**
```
fix(auth): prevent redirect loop when session expires
fix(stripe): verify webhook signature before processing
fix(i18n): add missing pt-BR keys for dashboard title
fix(actions): return generic error instead of raw Prisma message
```

### 7 — PR Description Template

```markdown
## What
One-sentence description of the bug.

## Why (Root Cause)
Explanation of what caused it.

## How (Fix)
What changed and why this approach is correct.

## Testing
- [ ] Failing test added: `path/to/test.ts`
- [ ] All existing tests pass
- [ ] Manually verified: [steps to reproduce and confirm fix]

Closes #<issue-number>
```

## Common Fix Patterns

| Issue type | Approach |
|---|---|
| Missing auth check | Add session check at top of Server Action (see `rules/server-actions.md`) |
| IDOR / missing ownership check | Add ownership check after session validation |
| Missing i18n key | Add to both `en.json` and `pt-BR.json`; run `bun run check:i18n` |
| TypeScript error | Fix the type — never use `as` or `any` to suppress |
| Failing test | Fix the implementation — never weaken the test |
| Missing env var | Declare in `src/env.ts` and `.env.example` |
| `<img>` instead of `<Image />` | Replace with `next/image` (see `rules/performance.md`) |
| Hardcoded string | Move to locale files and use `useTranslations()` |
