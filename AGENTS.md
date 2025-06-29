## Project Overview & Security Context

This repository implements a **security-first, audit-compliant React/TypeScript application** with enterprise-grade security controls, comprehensive vulnerability management, and automated security monitoring. Based on recent security audit findings, this configuration prioritizes **zero-trust security**, **performance optimization**, and **compliance requirements**.

**🚨 SECURITY ALERT**: This project has undergone security audit. All development must address identified vulnerabilities systematically.

## Current Security Audit Status

### Critical Issues Requiring Immediate Attention
- **HIGH**: Express rate limiter vulnerability (SEC-2025-001)
- **MEDIUM**: CSP allows external CDNs without SRI (SEC-2025-002)  
- **MEDIUM**: Missing service worker for asset caching (PERF-2025-001)
- **MEDIUM**: Inconsistent error handling patterns (QUAL-2025-001)

### Security-First Development Workflow
```bash
# MANDATORY: Security validation before any development
npm run security:audit
npm run dependencies:check
npm run lint:security
npm run test:security
```

## Core Technical Stack (Security-Hardened)

- **Frontend**: React 18+, TypeScript 5.0+ (Strict Mode)
- **Security**: Helmet, CSP with SRI, Rate Limiting (Redis-backed)
- **Validation**: Zod schemas with security sanitization
- **Testing**: Security-focused test suites with edge cases
- **Monitoring**: Real-time security event tracking
- **Compliance**: GDPR-compliant analytics and data handling

## Security Architecture Guidelines

### 1. Rate Limiting Implementation (HIGH PRIORITY)
**Context**: Addressing SEC-2025-001 vulnerability

```typescript
// Required: Redis-backed rate limiting
import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// CRITICAL: Always use Redis store in production
const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  // Cluster-aware configuration
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});
```

**Implementation Requirements**:
- ✅ Redis connection with automatic failover
- ✅ Environment-specific rate limits (dev/staging/prod)
- ✅ Monitoring and alerting for rate limit breaches
- ✅ Graceful degradation if Redis unavailable

### 2. Content Security Policy with SRI (MEDIUM PRIORITY)
**Context**: Addressing SEC-2025-002 vulnerability

```typescript
// Required: SRI-enhanced CSP configuration
export const createCspDirectives = (nonce: string) => ({
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    `'nonce-${nonce}'`,
    // CRITICAL: All external scripts must have integrity hashes
    "'sha256-<computed-hash-for-plausible>'",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Only for Tailwind, replace with hashes
    "https://fonts.googleapis.com",
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
  ],
  // MANDATORY: SRI verification for all external resources
  requireSriFor: ['script', 'style'],
});
```

**SRI Hash Generation**:
```bash
# Generate SRI hashes for all external resources
openssl dgst -sha256 -binary script.js | openssl base64 -A
```

### 3. Environment Variable Validation (LOW PRIORITY)
**Context**: Addressing SEC-2025-003 vulnerability

```typescript
// Required: Comprehensive environment validation
import { z } from 'zod';

const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().min(1000).max(65535).default(3000),
  CORS_ORIGIN: z.string().url().min(1),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  // Security-specific variables
  CSP_REPORT_URI: z.string().url().optional(),
  SECURITY_HEADERS_ENABLED: z.boolean().default(true),
});

// CRITICAL: Validate on startup, fail fast if invalid
export const validateEnvironment = () => {
  const result = EnvironmentSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Environment validation failed:', result.error.format());
    process.exit(1);
  }
  return result.data;
};
```

## Performance Optimization Guidelines

### 4. Service Worker Implementation (MEDIUM PRIORITY)
**Context**: Addressing PERF-2025-001

```typescript
// Required: Workbox service worker configuration
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// CRITICAL: Cache strategy for different resource types
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [{
      cacheKeyWillBeUsed: async ({ request }) => {
        return `${request.url}?v=${BUILD_VERSION}`;
      },
    }],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
  })
);
```

### 5. Bundle Analysis Integration (LOW PRIORITY)
**Context**: Addressing PERF-2025-002

```yaml
# Required: GitHub Actions bundle analysis
name: Bundle Analysis
on: [pull_request]
jobs:
  bundle-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Build and analyze
        run: |
          npm run build
          npm run analyze
      - name: Bundle size check
        run: |
          # Fail if main bundle exceeds 250KB
          BUNDLE_SIZE=$(stat -c%s dist/assets/*.js | head -1)
          if [ $BUNDLE_SIZE -gt 256000 ]; then
            echo "❌ Bundle too large: ${BUNDLE_SIZE} bytes"
            exit 1
          fi
```

## Quality & Testing Standards

### 6. Error Handling Standardization (MEDIUM PRIORITY)
**Context**: Addressing QUAL-2025-001

```typescript
// Required: Standardized error response interface
interface StandardErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    field?: string;
    correlationId: string;
    timestamp: string;
  };
  meta: {
    requestId: string;
    version: string;
  };
}

// CRITICAL: Error handling middleware with correlation IDs
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const correlationId = req.headers['x-correlation-id'] || generateId();
  
  logger.error('Request failed', {
    error: err.message,
    stack: err.stack,
    correlationId,
    path: req.path,
    method: req.method,
  });

  const response: StandardErrorResponse = {
    success: false,
    error: {
      message: err.message,
      code: determineErrorCode(err),
      correlationId,
      timestamp: new Date().toISOString(),
    },
    meta: {
      requestId: correlationId,
      version: process.env.APP_VERSION || 'unknown',
    },
  };

  res.status(determineStatusCode(err)).json(response);
};
```

## Development Workflow (Security-Enhanced)

### Pre-Development Security Checks
```bash
# MANDATORY: Run before any development
npm run security:pre-flight

# Includes:
# 1. Dependency vulnerability scan
# 2. Environment validation
# 3. Security configuration verification
# 4. Rate limiting Redis connectivity test
```

### Task-Specific Guidelines for AI Agents

#### When Working on Security Issues (Priority: HIGH/MEDIUM)
- **Always validate**: Check current security configuration before changes
- **Test thoroughly**: Include edge cases and failure scenarios
- **Document changes**: Update security documentation
- **Monitor impact**: Verify no regressions in security posture

#### When Working on Performance Issues (Priority: MEDIUM/LOW)
- **Measure first**: Establish baseline metrics before optimization
- **Progressive enhancement**: Ensure graceful degradation
- **Bundle awareness**: Monitor bundle size impact
- **Cache strategies**: Implement appropriate caching levels

## Success Metrics

### Security Metrics
- ✅ Zero high/critical vulnerabilities
- ✅ 100% rate limit coverage on public endpoints
- ✅ All external resources with SRI verification
- ✅ Environment validation passes on all deployments

### Performance Metrics  
- ✅ Main bundle < 250KB gzipped
- ✅ Cache hit ratio > 90% for static assets
- ✅ Service worker coverage for offline functionality
- ✅ Core Web Vitals scores > 90

---

**Configuration Version**: 2.0.0 (Audit Remediation)  
**Last Updated**: June 29, 2025  
**Security Audit**: Compliant with findings SEC-2025-001 through COMP-2025-001
