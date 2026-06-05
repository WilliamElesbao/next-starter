# Feedback: Write Fewer Code Comments

## Rule
Code must be self-documenting. Do not add comments that explain WHAT the code does.

## When Comments Are Acceptable

| Scenario | Example |
|---|---|
| Non-obvious business logic (WHY, not WHAT) | `// Stripe requires amount in cents, not dollars` |
| Workaround for a known bug with ticket reference | `// TODO(#312): Remove after Prisma fixes nested upsert` |
| JSDoc on exported public API functions | `/** Returns price formatted as "$12.00" */` |

## ❌ Anti-Patterns

```ts
// Map users to get their names
const names = users.map(u => u.name);

// Check if user is admin
if (user.role === 'admin') {
  // Allow access
  return true;
}

// Format the date
const formatted = dayjs(date).format('MMM D, YYYY');
```

## ✅ Correct

```ts
const names = users.map(u => u.name);

if (user.role === 'admin') {
  return true;
}

const formatted = dayjs(date).format('MMM D, YYYY');
```

## Application

This rule applies to all code generated or reviewed by Claude in this project.
When reviewing PRs, flag any comment that describes what the code obviously does.
