# ArtOfficial Intelligence Development Guide

This project powers the ArtOfficial Intelligence website built with React 18, TypeScript, and Vite.

## Architecture Overview

The codebase uses a **feature-based modular structure**:

```
src/
├── components/
│   ├── ui/              # Design system components
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
├── pages/               # Route components (lazy-loaded)
├── hooks/               # Custom hooks (reusable logic)
├── lib/                 # Utilities (type-safe, pure functions)
├── data/                # Static content (typed, SEO-optimized)
├── types/               # TypeScript definitions
└── styles/              # Global styles & design tokens
```

## Development Workflow

Run the automated setup script once:

```bash
./install.sh
```

Common commands (via `pnpm`):

```bash
pnpm dev      # Start development server with hot reload
pnpm lint     # ESLint + TypeScript checks
pnpm test     # Vitest with coverage
pnpm build    # Verify production build
```

## Contribution Guidelines

We follow a trunk-based workflow:

- **Main branch** is always deployable and protected.
- **Feature branches** should be short-lived and descriptively named.
- **Commits** use conventional messages and represent atomic changes.
- **Pre-commit** hooks run automated linting, formatting and type checks.
Please ensure all pull requests pass `pnpm lint`, `pnpm test`, and `pnpm build` before merging.
