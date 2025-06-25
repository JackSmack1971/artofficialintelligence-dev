# ArtOfficial Intelligence Website - Production-Ready AI Agent Guide

## 🎯 Mission
Build a world-class AI news website using modern development practices: **automation, consistency, modularity, performance-first thinking, security by design, and continuous improvement**.

## 📐 Development Philosophy
- **Developer Experience First**: Optimized tooling, hot reload, consistent environments
- **Performance by Default**: Bundle optimization, Core Web Vitals, monitoring
- **Security Throughout**: DevSecOps, strict CSP, comprehensive validation
- **Accessibility Compliant**: WCAG 2.1 AA, semantic HTML, screen reader tested
- **Type Safety**: Strict TypeScript, no `any` types, comprehensive interfaces

## 🛠️ Tech Stack & Architecture
- **Frontend**: React 18 (Concurrent Features) + TypeScript (Strict Mode) + Vite
- **Styling**: TailwindCSS (JIT Mode) + CSS Variables for theming
- **State**: React Context + Custom Hooks (no external state management needed)
- **Routing**: React Router v6 (declarative, lazy-loaded routes)
- **Testing**: Vitest + React Testing Library (user-centric testing)
- **Quality**: ESLint + Prettier + Husky (pre-commit hooks)

## 📁 Modular Architecture (Feature-Based)
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

## 🚀 Development Workflow

### Local Development Setup
```bash
# Automated environment setup
./install.sh

# Start development with hot reload
pnpm dev          # Port 3000, state preservation

# Quality gates (run before commits)
pnpm lint         # ESLint + TypeScript checks
pnpm test         # Vitest with coverage
pnpm build        # Production build verification
```

### Git Workflow (Trunk-Based Development)
- **Main branch**: Always deployable, protected
- **Feature branches**: Short-lived (< 2 days), descriptive names
- **Commits**: Conventional commits, atomic changes
- **Pre-commit**: Automated linting, formatting, type checking

### Performance Budgets
- **Bundle Size**: < 500KB initial load
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

## 🔒 Security Requirements

### Content Security Policy (Strict)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}';
  style-src 'self' 'nonce-{RANDOM}';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';">
```

### Input Validation & Sanitization
- **Allowlist validation**: Define exact authorized input patterns
- **Context-aware encoding**: HTML entities, JavaScript escaping
- **Parameterized queries**: Prevent injection attacks
- **Type-safe schemas**: Zod validation for all forms

### Dependency Security
- **Automated scanning**: `pnpm audit` in CI/CD
- **Version pinning**: Lock critical dependencies
- **Regular updates**: Weekly security updates
- **Supply chain**: Verify package integrity

## 📊 Quality Gates (Automated)

### Pre-Commit Hooks (Husky + lint-staged)
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "vitest related --run"
  ]
}
```

### CI/CD Pipeline Requirements
1. **Dependency Security Scan** (fail on critical)
2. **TypeScript Compilation** (strict mode)
3. **ESLint Quality Check** (zero warnings)
4. **Unit Test Coverage** (>80%)
5. **Bundle Size Analysis** (budget enforcement)
6. **Accessibility Audit** (axe-core)
7. **Performance Testing** (Lighthouse CI)

## 🌐 Production Standards

### Core Web Vitals Optimization
- **Image Optimization**: WebP format, lazy loading, proper sizing
- **Code Splitting**: Route-based, component lazy loading
- **Caching Strategy**: Long-term assets, efficient cache headers
- **Critical CSS**: Above-the-fold content prioritization
- **Resource Hints**: Preload, prefetch, dns-prefetch

### Accessibility (a11y) Standards
- **Semantic HTML**: Proper heading structure, landmarks
- **ARIA Integration**: Only when native HTML insufficient
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Reader Testing**: NVDA, JAWS, VoiceOver compatibility
- **Color Contrast**: WCAG AA compliant (4.5:1 ratio)

### Internationalization Ready
- **Locale Separation**: Prepared for i18n implementation
- **Cultural Adaptation**: Date formats, typography considerations
- **Progressive Enhancement**: Content-first, JavaScript optional

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Hot reload development server
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm test             # Run tests with coverage
pnpm test:watch       # Watch mode testing

# Quality Assurance
pnpm lint             # ESLint + TypeScript check
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Prettier formatting
pnpm type-check       # TypeScript compilation check

# Analysis & Optimization
pnpm analyze          # Bundle size analysis
pnpm audit            # Security vulnerability scan
pnpm lighthouse       # Performance audit
pnpm a11y             # Accessibility testing

# Utilities
tree src/             # View project structure
find . -name "*.tsx"  # Find component files
grep -r "TODO" src/   # Find development notes
```

## 📈 Monitoring & Performance

### Performance Monitoring
- **Real User Monitoring**: Core Web Vitals collection
- **Synthetic Testing**: Automated Lighthouse audits
- **Bundle Analysis**: Size tracking, unused code detection
- **Error Tracking**: JavaScript error monitoring

### Success Metrics
- **Performance**: All Core Web Vitals in "Good" range
- **Accessibility**: 100% automated test pass rate
- **Security**: Zero critical/high vulnerabilities
- **Quality**: ESLint score: 0 errors, 0 warnings
- **Type Safety**: 100% TypeScript coverage

## 🎯 Implementation Priorities

### Phase 1: Foundation (Week 1)
1. **Project Setup**: Vite + React 18 + TypeScript strict
2. **Quality Tools**: ESLint + Prettier + Husky configuration
3. **Basic Components**: Layout, navigation, core UI elements
4. **Type Definitions**: Complete TypeScript interfaces
5. **Security Headers**: CSP implementation

### Phase 2: Content & Features (Week 2)
1. **Static Content**: Articles, site content with proper typing
2. **Page Components**: Home, Articles, About, Contact
3. **Performance**: Code splitting, lazy loading
4. **Accessibility**: Semantic HTML, ARIA attributes
5. **Testing Setup**: Vitest + React Testing Library

### Phase 3: Polish & Optimization (Week 3)
1. **Performance Optimization**: Bundle analysis, Core Web Vitals
2. **Accessibility Audit**: Screen reader testing, keyboard navigation
3. **Security Hardening**: Input validation, XSS prevention
4. **Error Handling**: Boundaries, graceful degradation
5. **Production Deployment**: CI/CD pipeline, monitoring

## ⚡ Development Tips for AI Agents

### Command-Line Efficiency
```bash
# Project navigation
cd src/components && ls -la
find src/ -name "*.tsx" | head -10
grep -r "interface.*Props" src/types/

# Development workflow
pnpm dev &          # Start dev server in background
vim src/pages/HomePage.tsx
curl http://localhost:3000/health

# Quality checks
pnpm lint 2>&1 | grep -E "(error|warning)"
pnpm test --reporter=verbose
pnpm build --mode=production
```

### File Creation Patterns
```bash
# Component creation
touch src/components/ui/NewComponent.tsx
# Add: interface, implementation, export
# Test: Create corresponding .test.tsx

# Page creation
touch src/pages/NewPage.tsx
# Add: component, metadata, lazy loading
# Update: router configuration

# Hook creation
touch src/hooks/useNewFeature.ts
# Add: TypeScript types, implementation, tests
```

## 🎖️ Quality Standards

This project follows **enterprise-grade development practices**:
- **Zero-defect mindset**: Catch issues before production
- **Performance-first**: Optimized for real-world conditions
- **Security by design**: Threat modeling integrated
- **Accessibility by default**: Inclusive design principles
- **Maintainable code**: Self-documenting, well-tested
- **Developer experience**: Fast feedback loops, clear workflows

Every feature must meet these standards before deployment.
