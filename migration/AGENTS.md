# Next.js Migration Guidelines

## Migration Context
- Phased migration from React SPA to Next.js 14+
- Maintain backward compatibility during transition
- Target 60-80% performance improvement in Core Web Vitals
- SEO optimization for news content indexing

## Implementation Patterns
- Use App Router for new features
- Implement ISR for news articles with 1-hour revalidation
- Follow server component patterns for data fetching
- Maintain client components only when necessary for interactivity

## Testing Migration
- Compare performance metrics against SPA baseline
- Validate SEO improvements with search console
- Monitor Core Web Vitals during rollout
- A/B test user experience between versions
