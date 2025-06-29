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
pnpm analyze  # Build with bundle analyzer enabled
```

## Environment Variables

Copy `.env.example` to `.env.local` and adjust values for your environment:

```bash
cp .env.example .env.local
```

Environment variables used by the server:

| Variable | Description |
| --- | --- |
| `NODE_ENV` | `development`, `production`, or `test` |
| `PORT` | Port for the Express server |
| `CORS_ORIGIN` | Allowed origins (comma separated) |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret for JWT signing (32+ characters) |

`REDIS_URL` must point to your Redis instance. In production the server uses
Redis for rate limiting so limits persist across restarts.

### Bundle Analysis

Run `pnpm analyze` to create `dist/stats.html` using the bundle visualizer.
Open the file in your browser to inspect the bundle composition.

## Error Handling

The global error boundary lives at `src/components/ErrorBoundary.tsx`.
It logs caught errors with structured data (timestamp, message, component stack) and displays an AI-themed fallback screen when failures occur.


## Nonce-Based Content Security Policy

The server generates a unique nonce for every request. This nonce replaces
`__NONCE__` in `index.html` at runtime and is added to the `Content-Security-Policy`
header. All inline scripts and styles must include the generated `nonce` attribute.
Run the production server after building with:

```bash
pnpm build
node src/server.js
```

## Contribution Guidelines

We follow a trunk-based workflow:

- **Main branch** is always deployable and protected.
- **Feature branches** should be short-lived and descriptively named.
- **Commits** use conventional messages and represent atomic changes.
- **Pre-commit** hooks run automated linting, formatting and type checks.
- `pnpm test` runs `vitest run --coverage` to generate a coverage report and exit after one run.
Please ensure all pull requests pass `pnpm lint`, `pnpm test`, and `pnpm build` before merging.

## Import Ordering

All source files follow a standard import order enforced by ESLint:

1. React and React related imports
2. Third-party libraries (alphabetical)
3. Internal components (`@/components`)
4. Internal utilities (`@/lib`, `@/utils`, `@/types`)
5. Relative imports (`./`)
6. Type-only imports (last)

Refer to [docs/import-ordering.md](docs/import-ordering.md) for more information.
\n## PWA Caching\nService worker caches are versioned using the package version. Old caches are automatically cleaned with Workbox's cleanupOutdatedCaches.
