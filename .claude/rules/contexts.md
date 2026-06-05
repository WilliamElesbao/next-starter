---
paths:
  - "src/contexts/**/*.tsx"
  - "src/features/*/contexts/**/*.tsx"
---

# Contexts & Providers

## Scoping Rules

| Context type | Location | When to use |
|---|---|---|
| Global context | `src/contexts/` | Shared across 2+ features |
| Feature context | `src/features/{feature}/contexts/` | Used by a single feature only |

**Promotion rule:** if a feature-scoped context needs to be accessed by another feature, move it to `src/contexts/`. Never import a context from one feature inside another — that is a cross-feature dependency violation.

## File Structure

```
src/contexts/
└── dialog-context.tsx        # Global — shared across features

src/features/dashboard/
└── contexts/
    └── dashboard-context.tsx # Feature-scoped — dashboard only
```

Each context file exports exactly three things: the typed interface, the Provider component, and the consumer hook.

## Pattern

```tsx
"use client";

import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

interface DialogContextType {
  dialogIsOpen: boolean;
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProviderProps extends PropsWithChildren {}

export const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      dialogIsOpen,
      setDialogIsOpen,
    }),
    [dialogIsOpen],
  );
  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
```

## Rules

| Rule | Enforcement |
|---|---|
| `createContext` initialized as `Type \| undefined` | Required — forces explicit provider check |
| `useMemo` wraps the context value object | Required — prevents unnecessary re-renders |
| Consumer hook throws when used outside provider | Required — fail fast with a clear message |
| Provider and consumer hook exported from same file | Required |
| Feature context lives in feature folder | Required — never in `src/contexts/` unless shared |
| Global context lives in `src/contexts/` | Required when accessed by 2+ features |
| No cross-feature context imports | Forbidden — promote to `src/contexts/` instead |

## Isolation Example

```
✅ Feature A reads from src/contexts/dialog-context.tsx  (global)
✅ Feature A reads from src/features/auth/contexts/auth-context.tsx  (own)
❌ Feature A reads from src/features/dashboard/contexts/dashboard-context.tsx  (foreign feature)
```
