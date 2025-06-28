# ArtOfficial Intelligence Development Guide

## Project Context
- React 18 + TypeScript SPA migrating to Next.js 14+
- Feature-based modular architecture with strict TypeScript
- Enterprise news content platform with performance requirements
- Trunk-based workflow with automated quality gates

## Code Standards
- Use pnpm for package management
- Follow conventional commit messages
- All components must be typed with TypeScript strict mode
- Implement error boundaries for production resilience
- Use TanStack Query v5 for data fetching with optimistic updates

## Development Workflow
- Run `pnpm dev` for development server
- Use `pnpm lint` before commits (automated via pre-commit hooks)
- `pnpm test` runs full test suite with coverage
- `pnpm build` validates production readiness

## Architecture Patterns
- Prefer feature-based organization over technical grouping
- Use adapter pattern for CMS abstraction
- Implement retry mechanisms with exponential backoff
- Follow React Query patterns for data synchronization
