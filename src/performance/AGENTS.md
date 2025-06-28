# Performance Optimization Guidelines

## Core Web Vitals Targets
- LCP: < 2.5s (target: 1.5s for news content)
- INP: < 200ms (target: < 100ms for interactions)
- CLS: < 0.1 (target: < 0.05 for reading experience)

## Optimization Patterns
- Implement image optimization with next/image
- Use code splitting with React.lazy and Suspense
- Optimize bundle size with webpack-bundle-analyzer
- Monitor Web Vitals with sendBeacon API

## Monitoring Implementation
- Use Sentry for error tracking with user context
- Implement performance monitoring with custom metrics
- Track conversion funnels for editorial workflow
- Monitor API response times with circuit breaker thresholds
