# ArtOfficial Intelligence - Enterprise React/TypeScript Application

## Project Overview & Context

This repository implements a **security-first, performance-optimized React 18+ application** with TypeScript 5.4+, built on Vite 5.4+ and modern web standards. The project follows enterprise-grade development practices with comprehensive security auditing.

**🔒 Security Status**: All critical findings addressed. Zero-trust security model implemented.

## Core Technology Stack (2025 Standards)

### Frontend Architecture
- **Framework**: React 18.3+ with concurrent features
- **Language**: TypeScript 5.4+ with strict mode
- **Build Tool**: Vite 5.4+ with ESM, tree-shaking, code splitting
- **Package Manager**: pnpm 9.0+ (required - not npm/yarn)
- **Styling**: Tailwind CSS 3.4+ with design tokens
- **State**: Zustand 4.0+ or TanStack Query v5
- **Testing**: Vitest 2.0+ with React Testing Library

### Development Environment
- **Node.js**: 20+ LTS required
- **Editor**: VS Code with TypeScript, ESLint, Prettier extensions
- **Git**: Conventional commits, Husky pre-commit hooks

## Development Commands

### Essential Commands (Copy-Paste Ready)
```bash
# Setup & Installation
pnpm install                  # Install all dependencies
pnpm dev                      # Start development server (localhost:3000)

# Build & Testing
pnpm build                    # TypeScript check + production build
pnpm test                     # Run Vitest tests with coverage
pnpm test:watch               # Run tests in watch mode
pnpm lint                     # ESLint + TypeScript validation
pnpm lint:fix                 # Auto-fix linting issues

# Analysis & Security
pnpm analyze                  # Bundle size analysis
pnpm audit                    # Security dependency audit
pnpm type-check               # TypeScript strict checking
pnpm preview                  # Preview production build locally
```

## Project Structure (Feature-Based Architecture)

```
src/
├── components/
│   ├── ui/                   # Design system primitives (AGENTS.md)
│   ├── layout/               # Layout components (Header, Footer, Nav)
│   ├── features/             # Feature-specific components
│   └── AGENTS.md             # Component development guide
├── pages/                    # Route components (lazy-loaded)
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities, configurations
├── data/                     # Static content, constants
├── types/                    # Global TypeScript definitions
├── styles/                   # Global styles & Tailwind config
└── content/                  # CMS content (AGENTS.md)
```

## Development Standards

### TypeScript Configuration
- **Strict Mode**: All strict flags enabled
- **Path Mapping**: `@/` alias points to `src/`
- **Module System**: ESM with top-level await
- **Target**: ESNext for modern browsers

### Code Quality Requirements
```typescript
// Import order (enforced by ESLint)
// 1. React and React-related
import React, { useState, useEffect } from 'react'

// 2. Third-party libraries (alphabetical)
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

// 3. Internal components
import { Button } from '@/components/ui/button'

// 4. Internal utilities  
import { cn } from '@/lib/utils'

// 5. Type-only imports (last)
import type { ComponentProps } from '@/types'
```

### Component Standards
- **Functional Components**: Use function declarations, not arrow functions
- **Props Interface**: Always define TypeScript interfaces
- **Default Props**: Use ES6 default parameters
- **Error Boundaries**: Wrap feature components
- **Accessibility**: WCAG 2.1 AA compliance required

### Testing Requirements
```typescript
// Every component must have tests
// File: ComponentName.test.tsx
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

test('renders component correctly', () => {
  render(<ComponentName />)
  expect(screen.getByRole('...')).toBeInTheDocument()
})
```

## Security Implementation (Critical)

### Content Security Policy
```typescript
// All routes must implement CSP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'sha256-HASH'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))
```

### Rate Limiting (Required)
```typescript
// Redis-backed rate limiting for all API routes
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

const limiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
})
```

## Performance Standards

### Bundle Targets (Enforced)
- **Main Bundle**: < 250KB gzipped
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Code Splitting Pattern
```typescript
// Route-level splitting (required)
const HomePage = lazy(() => import('@/pages/Home'))
const ArticlesPage = lazy(() => import('@/pages/Articles'))

// Component-level splitting for heavy features
const NewsletterWidget = lazy(() => 
  import('@/components/features/Newsletter')
)
```

## Validation & CI/CD

### Pre-Commit Validation
```bash
# Automated via Husky (runs on every commit)
pnpm lint                     # ESLint + TypeScript
pnpm test                     # All tests with coverage
pnpm build                    # Production build verification
pnpm audit                    # Security vulnerabilities
```

### GitHub Actions Pipeline
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

## Pull Request Guidelines

### PR Title Format
```
[area] Brief description

Examples:
[ui] Add loading states to Button component
[pages] Implement article search with filters
[security] Update CSP directives and add SRI hashes
[perf] Optimize image loading with WebP/AVIF
```

### PR Checklist
- [ ] All tests pass (`pnpm test`)
- [ ] TypeScript compiles (`pnpm build`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Bundle size reviewed (`pnpm analyze`)
- [ ] Security implications considered
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Performance impact assessed

## Task-Specific Guidelines for AI Agents

### When Working on UI Components
- Always reference `src/components/AGENTS.md` for component patterns
- Use `src/components/ui/AGENTS.md` for design system primitives
- Implement proper TypeScript interfaces and prop validation
- Include unit tests with good coverage

### When Working on Performance
- Reference `src/performance/AGENTS.md` for optimization strategies
- Monitor bundle size with `pnpm analyze`
- Implement proper code splitting and lazy loading
- Use React 18 concurrent features (Suspense, startTransition)

### When Working on Content
- Reference `content/AGENTS.md` for CMS integration patterns
- Ensure proper content sanitization and security
- Implement SEO optimization and structured data
- Follow GDPR compliance requirements

## Environment Configuration

### Required Environment Variables
```bash
# .env.local
NODE_ENV=development
PORT=3000
VITE_APP_NAME="ArtOfficial Intelligence"
REDIS_URL=redis://localhost:6379
CSP_REPORT_URI=https://your-csp-endpoint.com
```

### Development Dependencies
```json
{
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

---

**Repository Version**: 3.0.0 (Enterprise Security + Performance Excellence)  
**Last Updated**: June 29, 2025  
**Codex Compatibility**: Optimized for latest OpenAI Codex patterns  
**Stack**: React 18.3+, TypeScript 5.4+, Vite 5.4+, pnpm 9.0+
