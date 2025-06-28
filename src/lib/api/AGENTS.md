# API Integration Guidelines

## CMS Architecture
- Use adapter pattern for CMS abstraction (Contentful/Strapi)
- Implement circuit breaker pattern for resilience
- Follow GraphQL federation with REST endpoint fallbacks
- Use TanStack Query for optimistic updates and caching

## Security Implementation
- All API calls must include CSRF tokens
- Implement rate limiting with exponential backoff
- Use Content Security Policy with nonce-based inline scripts
- Follow OWASP security headers configuration

## Error Handling
- Implement retry mechanism with max 3 attempts
- Use structured error responses with user-friendly messages
- Log errors with context but sanitize sensitive data
- Provide graceful degradation for CMS failures
