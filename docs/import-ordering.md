# Import Ordering Standards

This project enforces a strict order for `import` statements to keep the codebase consistent and readable.

1. **React and React related imports**
2. **Third-party libraries** (alphabetical)
3. **Internal components** (`@/components`)
4. **Internal utilities** (`@/lib`, `@/utils`, `@/types`)
5. **Relative imports** (`./`)
6. **Type-only imports** (placed last)

Imports are automatically sorted using ESLint and the `eslint-plugin-import` ruleset. Run `pnpm lint:fix` to apply fixes or enable `editor.codeActionsOnSave` in VS Code to organize imports on save.
