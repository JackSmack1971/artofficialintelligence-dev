# AGENTS.md - Repository Foundation Configuration

## Project Overview

This repository implements a **production-ready React/TypeScript application** with enterprise-grade development workflows, comprehensive type safety, and automated CI/CD pipelines. The architecture prioritizes **developer experience**, **code quality**, and **scalable deployment patterns** following industry best practices for 2024-2025.

## Core Technical Stack

- **Frontend**: React 18+, TypeScript 5.0+ (Strict Mode)
- **Validation**: Zod schemas with runtime type safety
- **Styling**: Tailwind CSS with custom design system
- **Testing**: React Testing Library + Jest + Playwright
- **Build**: Vite/Webpack with performance optimization
- **Container**: Docker multi-stage builds
- **CI/CD**: GitHub Actions with security scanning
- **Quality**: ESLint, Prettier, Husky pre-commit hooks

## Development Environment Setup

### Prerequisites Validation
Before proceeding with any development tasks:

```bash
# Verify required tools are installed
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 9.0.0
docker --version  # Should be >= 24.0.0
git --version     # Should be >= 2.40.0
```

### Container-First Development
**Always use the standardized development environment:**

```bash
# Start development environment
docker-compose up -d

# Access development container
docker exec -it app-dev bash

# Alternative: Use VS Code Dev Containers
# Open project in VS Code and select "Reopen in Container"
```

### Environment Configuration
**Never commit secrets to version control:**

```bash
# Copy environment template
cp .env.example .env.local

# Configure required variables
# DB_HOST, DB_PORT, JWT_SECRET, API_KEYS, etc.
```

## Code Architecture Guidelines

### TypeScript Implementation Standards

#### 1. Strict Type Safety
**All code must pass TypeScript strict mode compilation:**

```typescript
// tsconfig.json requirements
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true
  }
}
```

#### 2. Zod Schema-First Validation
**Runtime validation is mandatory for all external data:**

```typescript
// Example: API response validation
import { z } from 'zod';

export const ArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string().min(100),
  publishedAt: z.string().datetime(),
  // ... additional fields
});

export type Article = z.infer<typeof ArticleSchema>;

// Validate API responses
const validateArticleResponse = (data: unknown): Article => {
  return ArticleSchema.parse(data);
};
```

#### 3. Component Architecture
**Follow established patterns for component development:**

```typescript
// Component with proper TypeScript interfaces
interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
  onTagClick?: (tag: string) => void;
  className?: string;
  testId?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'default',
  onTagClick,
  className,
  testId
}) => {
  // Implementation with proper error boundaries
  // Accessibility compliance (WCAG 2.1)
  // Performance optimization (React.memo when appropriate)
};
```

### Custom Hooks Implementation
**Extract reusable logic into properly typed custom hooks:**

```typescript
// hooks/useArticles.ts
interface UseArticlesOptions {
  filters?: {
    status?: ArticleStatus;
    tags?: string[];
  };
  sortBy?: SortBy;
  enableInfiniteScroll?: boolean;
}

export const useArticles = (options: UseArticlesOptions = {}) => {
  // Implement with proper error handling
  // Include loading states and error boundaries
  // Return properly typed data and functions
};
```

### Error Handling Strategy
**Implement comprehensive error boundaries:**

```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // Implement with logging to monitoring service
  // Provide fallback UI for different error types
  // Include error reporting and recovery mechanisms
}
```

## Testing Requirements

### Test Coverage Standards
**Maintain minimum 80% test coverage:**

```bash
# Run test suite
npm run test              # Unit tests with Jest
npm run test:integration  # Integration tests
npm run test:e2e         # End-to-end tests with Playwright

# Coverage reporting
npm run test:coverage
```

### Testing Patterns
**Follow established testing conventions:**

```typescript
// __tests__/components/ArticleCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';
import { mockArticle } from '../../mocks/article-factory';

describe('ArticleCard', () => {
  it('renders article data correctly', () => {
    const article = mockArticle();
    render(<ArticleCard article={article} />);
    
    expect(screen.getByText(article.title)).toBeInTheDocument();
    expect(screen.getByText(article.excerpt)).toBeInTheDocument();
  });

  it('handles tag click events', () => {
    const onTagClick = jest.fn();
    const article = mockArticle({ tags: ['react', 'typescript'] });
    
    render(<ArticleCard article={article} onTagClick={onTagClick} />);
    
    fireEvent.click(screen.getByText('react'));
    expect(onTagClick).toHaveBeenCalledWith('react');
  });
});
```

## Code Quality Enforcement

### Pre-commit Hooks
**Automated quality checks prevent low-quality commits:**

```bash
# Pre-commit validation runs:
# 1. ESLint with auto-fix
# 2. Prettier formatting
# 3. TypeScript compilation
# 4. Unit test execution
# 5. Security vulnerability scanning
```

### Linting and Formatting
**Consistent code style is automatically enforced:**

```json
// .eslintrc.js configuration
{
  "extends": [
    "@typescript-eslint/recommended",
    "react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## Performance Requirements

### Bundle Optimization
**Monitor and optimize application performance:**

```bash
# Performance analysis
npm run analyze          # Bundle size analysis
npm run lighthouse       # Performance metrics
npm run performance:test # Automated performance testing
```

### Performance Standards
- **Initial Load**: < 3 seconds on 3G networks
- **Bundle Size**: < 250KB gzipped for main chunk
- **Lighthouse Score**: > 90 for Performance, Accessibility, Best Practices
- **Memory Usage**: < 50MB heap size for typical usage

### Implementation Requirements
- Implement lazy loading for route-based code splitting
- Use React.memo() for expensive components
- Implement proper image optimization and responsive loading
- Configure service worker for caching strategies

## Build and Deployment

### Container Build Process
**Multi-stage Docker builds optimize for both development and production:**

```dockerfile
# Dockerfile includes:
# 1. Development stage with hot-reload
# 2. Build stage with optimization
# 3. Production stage with minimal footprint
# 4. Security hardening and health checks
```

### CI/CD Pipeline
**GitHub Actions workflow validates all changes:**

```yaml
# .github/workflows/ci.yml includes:
# 1. Code quality checks (lint, format, type-check)
# 2. Security scanning (npm audit, Trivy)
# 3. Test execution (unit, integration, e2e)
# 4. Build validation and performance testing
# 5. Container security scanning
# 6. Automated deployment to staging
```

### Deployment Strategy
**Blue-green deployment with health monitoring:**

```bash
# Deployment process:
# 1. Build and scan container images
# 2. Deploy to staging environment
# 3. Run automated acceptance tests
# 4. Deploy to production with zero downtime
# 5. Monitor health and performance metrics
```

## Security Guidelines

### Security Standards
**Implement comprehensive security measures:**

- **Authentication**: JWT with secure token management
- **Authorization**: Role-based access control (RBAC)
- **Data Validation**: Zod schemas for all inputs
- **Dependencies**: Regular security audits and updates
- **Container Security**: Non-root users, minimal images
- **Secrets Management**: Environment variables, never in code

### Security Scanning
**Automated security validation:**

```bash
# Security checks in CI/CD:
npm audit --audit-level high
docker run --rm -v "$(pwd)":/app aquasec/trivy fs /app
```

## Development Workflow

### Branch Strategy
**Follow GitFlow with protection rules:**

```bash
# Branch naming conventions:
feature/TICKET-123-implement-article-search
bugfix/TICKET-456-fix-pagination-issue
hotfix/TICKET-789-security-patch

# Protected branches:
# - main: Production deployments only
# - develop: Integration branch for features
```

### Code Review Requirements
**All changes require peer review:**

- Minimum 2 approvals for production changes
- Automated CI/CD checks must pass
- Security review for authentication/authorization changes
- Performance impact assessment for UI changes

### Feature Development Process
1. **Create feature branch** from develop
2. **Implement with tests** following TDD principles
3. **Run local validation** (tests, linting, security)
4. **Submit pull request** with comprehensive description
5. **Address review feedback** and update tests
6. **Merge after approval** and successful CI/CD

## Monitoring and Observability

### Application Monitoring
**Implement comprehensive monitoring:**

- **Error Tracking**: Sentry for runtime error monitoring
- **Performance**: Web Vitals and custom metrics
- **User Analytics**: Privacy-compliant usage tracking
- **Infrastructure**: Container health and resource usage

### Logging Strategy
**Structured logging for production debugging:**

```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    // Structured logging implementation
  },
  error: (message: string, error?: Error, context?: Record<string, unknown>) => {
    // Error logging with stack traces and context
  }
};
```

## Documentation Standards

### Code Documentation
**Comprehensive documentation for maintainability:**

- **README.md**: Setup instructions and project overview
- **API Documentation**: OpenAPI/Swagger specifications
- **Component Stories**: Storybook for UI components
- **Architecture Decisions**: ADR documents for major decisions

### Inline Documentation
**JSDoc comments for complex functions:**

```typescript
/**
 * Fetches paginated articles with filtering and sorting
 * @param options - Configuration for article fetching
 * @param options.page - Page number (1-based)
 * @param options.limit - Number of articles per page
 * @param options.filters - Optional filters for articles
 * @returns Promise resolving to paginated article response
 * @throws {ValidationError} When invalid parameters provided
 * @throws {NetworkError} When API request fails
 */
export async function fetchArticles(
  options: FetchArticlesOptions
): Promise<PaginatedResponse<Article>> {
  // Implementation with proper error handling
}
```

## Task Implementation Guidelines

### When Working on Features
1. **Understand Requirements**: Review specifications and acceptance criteria
2. **Plan Implementation**: Design components and data flow
3. **Write Tests First**: Implement test cases before functionality
4. **Implement Incrementally**: Small, testable commits
5. **Validate Continuously**: Run tests and quality checks
6. **Document Changes**: Update relevant documentation

### When Fixing Bugs
1. **Reproduce Issue**: Create test case that demonstrates the bug
2. **Identify Root Cause**: Debug systematically with proper logging
3. **Implement Fix**: Minimal change that addresses root cause
4. **Validate Fix**: Ensure test passes and no regressions
5. **Add Prevention**: Additional tests to prevent similar issues

### When Refactoring Code
1. **Maintain Functionality**: Existing tests must continue passing
2. **Improve Design**: Enhance code structure and readability
3. **Update Tests**: Modify tests if internal structure changes
4. **Document Changes**: Update comments and documentation
5. **Performance Impact**: Measure before/after performance

## Success Metrics

### Code Quality Metrics
- **TypeScript Strict Mode**: 100% compliance
- **Test Coverage**: ≥ 80% line coverage
- **Lint Violations**: 0 errors, minimal warnings
- **Bundle Size**: < 250KB gzipped main chunk
- **Performance**: Lighthouse score > 90

### Development Velocity
- **Build Time**: < 3 minutes for full CI/CD pipeline
- **Review Time**: < 24 hours for standard features
- **Deployment Frequency**: Multiple deployments per day
- **Lead Time**: < 2 days from commit to production

### Reliability Metrics
- **Uptime**: 99.9% availability
- **Error Rate**: < 1% runtime errors
- **Security Issues**: 0 high/critical vulnerabilities
- **Performance**: < 3 second initial load time

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run test            # Run test suite
npm run lint            # Code quality check

# Container Development
docker-compose up       # Start all services
docker-compose down     # Stop all services
docker exec -it app sh  # Access container shell

# Quality Assurance
npm run type-check      # TypeScript validation
npm run test:coverage   # Coverage report
npm run security:audit  # Security scan
npm run performance     # Performance analysis

# CI/CD
git push origin feature/branch  # Trigger CI pipeline
npm run validate:pipeline       # Local pipeline simulation
```

This configuration ensures **enterprise-grade code quality**, **comprehensive testing coverage**, and **automated deployment workflows** while maintaining exceptional developer experience and production reliability.
