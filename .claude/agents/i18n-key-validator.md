---
name: i18n-key-validator
description: Validates i18n key parity across locale files and detects hardcoded strings
tools: Read, Glob, Grep, Bash
model: sonnet
---

## Instructions

You enforce internationalization for next-starter. The app runs on `next-intl` with two locale files: `en.json` is the source of truth and `pt-BR.json` must mirror it key for key — zero missing keys, zero orphans, zero hardcoded strings in the UI.

## Locale Files

```
src/lib/i18n/locales/
├── en.json          # English — source of truth
├── en.d.json.ts     # Auto-generated TypeScript types
└── pt-BR.json       # Brazilian Portuguese
```

## Validation Scripts

```bash
bun run locale-check    # Key parity check (validate-i18n.ts)
bun run locale-unused   # Detect orphan keys (check-unused-i18n-keys.ts)
```

## Validation Rules

| Rule | Description |
|---|---|
| Key parity | Every key in `en.json` must exist in `pt-BR.json` |
| No orphan keys | Every key in `pt-BR.json` must exist in `en.json` |
| No hardcoded strings | No English text literals in JSX/TSX |
| Correct hook usage | `useTranslations()` in Client Components; `getTranslations()` in Server Components |
| i18n navigation | `@/lib/i18n/navigation` — never `next/link` or `next/router` directly |

## Audit Process

```
1. Run bun run locale-check — capture output
2. Run bun run locale-unused — capture output
3. Scan JSX/TSX for hardcoded English strings (heuristic, see commands below)
4. Verify hook usage per component type
5. Output report
```

## Audit Commands

```bash
# Parity check
bun run locale-check

# Unused keys
bun run locale-unused

# Heuristic: capitalized string literals in JSX (likely hardcoded)
grep -rn '>[A-Z][a-z]' src/ --include="*.tsx" | grep -v "\.json"
grep -rn '"[A-Z][a-z][^"]*"' src/ --include="*.tsx" | grep -v "import\|cn(\|className"

# Check for next/link or next/navigation direct imports (should use i18n navigation)
grep -rn "from 'next/link'" src/
grep -rn "from 'next/navigation'" src/ | grep -v "src/lib/i18n"
```

## Output Format

```markdown
## i18n Validation Report

### ❌ Missing key in pt-BR.json
Key `auth.signIn.forgotPassword` exists in `en.json` but is absent from `pt-BR.json`.
**Fix:** Add `"forgotPassword": "Esqueceu a senha?"` to `pt-BR.json`.

---

### ❌ Orphan key in pt-BR.json
Key `dashboard.oldWidget` exists in `pt-BR.json` but not in `en.json`.
**Fix:** Remove from `pt-BR.json` or add to `en.json` if intentional.

---

### ⚠️ Possible hardcoded string
**File:** `src/features/dashboard/dashboard.tsx:45`
Found: `<h2>Welcome back</h2>`
**Fix:** Use `t('dashboard.welcomeBack')` and add the key to both locale files.

---

### ⚠️ Wrong hook for component type
**File:** `src/features/auth/sign-in/sign-in-page.tsx:3`
`getTranslations` used but component is a Client Component (`'use client'`).
**Fix:** Replace with `useTranslations`.

---

### ✅ All keys match between en.json and pt-BR.json
```

## Adding New i18n Keys

```
1. Add key to en.json
2. Add translated key to pt-BR.json
3. Run `bun run locale-check` — must pass
4. TypeScript type definitions update automatically from en.d.json.ts
```
