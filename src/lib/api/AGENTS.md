# API Security & Compliance Implementation Guide

## Security-First API Architecture

You are an expert backend security architect implementing **audit-compliant, enterprise-grade APIs** with comprehensive security controls. Your primary responsibility is addressing identified security vulnerabilities while maintaining high performance and reliability.

**🚨 CRITICAL CONTEXT**: This API implementation must address specific security audit findings:
- HIGH: Rate limiter vulnerability requiring Redis implementation
- MEDIUM: CSP/SRI security gaps in external resource handling
- MEDIUM: Inconsistent error handling patterns requiring standardization
- LOW: Environment validation and comprehensive testing gaps

## Priority-Based Implementation Framework

### PHASE 1: Critical Security Remediation (Week 1)

#### 1.1 Redis-Backed Rate Limiting (HIGH PRIORITY - SEC-2025-001)
**Context**: Current express-rate-limit@^7.5.1 uses memory store causing security vulnerabilities

```typescript
// CRITICAL: Replace memory-based rate limiting immediately
import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { Redis } from 'ioredis';

// Environment-aware Redis configuration
const createRedisClient = () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  return new Redis(redisUrl, {
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    commandTimeout: 5000,
  });
};

// Production-ready rate limiter with Redis persistence
export const createSecureRateLimiter = () => {
  const redis = createRedisClient();
  
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.call(...args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
    message: {
      error: 'Too many requests from this IP address',
      retryAfter: '15 minutes',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // CRITICAL: Handle Redis failures gracefully
    skip: (req) => {
      // Skip rate limiting if Redis is unavailable (fail open)
      return !redis.status || redis.status !== 'ready';
    },
    onLimitReached: (req, res, options) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
    },
  });
};
```

#### 1.2 Standardized Error Handling (MEDIUM PRIORITY - QUAL-2025-001)
**Context**: Current error handling lacks structure and correlation IDs

```typescript
// CRITICAL: Implement standardized error response format
export interface APIErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    field?: string; // For validation errors
    correlationId: string;
    timestamp: string;
    details?: Record<string, unknown>;
  };
  meta: {
    requestId: string;
    version: string;
    path: string;
    method: string;
  };
}

export interface APISuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
    version: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

// CRITICAL: Centralized error handling middleware
export const createErrorHandler = () => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const correlationId = req.headers['x-correlation-id'] as string || 
                         req.headers['x-request-id'] as string || 
                         generateCorrelationId();

    // Enhanced logging with security context
    logger.error('API request failed', {
      error: {
        message: err.message,
        stack: err.stack,
        name: err.constructor.name,
      },
      request: {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        correlationId,
      },
      security: {
        rateLimited: res.locals.rateLimited || false,
        authenticated: !!req.user,
        userId: req.user?.id,
      },
      timestamp: new Date().toISOString(),
    });

    const statusCode = determineStatusCode(err);
    const errorCode = determineErrorCode(err);
    
    const response: APIErrorResponse = {
      success: false,
      error: {
        message: sanitizeErrorMessage(err.message, statusCode),
        code: errorCode,
        correlationId,
        timestamp: new Date().toISOString(),
        ...(err instanceof ValidationError && { field: err.field }),
      },
      meta: {
        requestId: correlationId,
        version: process.env.APP_VERSION || 'unknown',
        path: req.path,
        method: req.method,
      },
    };

    res.status(statusCode).json(response);
  };
};
```

### PHASE 2: Environment & Validation Security (Week 2)

#### 2.1 Comprehensive Environment Validation (LOW PRIORITY - SEC-2025-003)
**Context**: Missing validation for critical environment variables

```typescript
import { z } from 'zod';

// CRITICAL: Complete environment schema with security focus
const APIEnvironmentSchema = z.object({
  // Core application settings
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().min(1000).max(65535).default(3000),
  
  // Security-critical variables
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  CORS_ORIGIN: z.string().min(1, 'CORS origin is required'),
  
  // Database configuration
  DATABASE_URL: z.string().url('Invalid database URL'),
  DATABASE_SSL: z.boolean().default(true),
  
  // Redis configuration
  REDIS_URL: z.string().url('Invalid Redis URL').optional(),
  REDIS_PASSWORD: z.string().optional(),
  
  // Rate limiting configuration
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(900000), // 15 min
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).default(100),
  
  // Security headers
  CSP_REPORT_URI: z.string().url().optional(),
  SECURITY_HEADERS_ENABLED: z.boolean().default(true),
  
  // Logging and monitoring
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  SENTRY_DSN: z.string().url().optional(),
  
  // API configuration
  API_VERSION: z.string().default('v1'),
  API_RATE_LIMIT_ENABLED: z.boolean().default(true),
});

export type APIEnvironment = z.infer<typeof APIEnvironmentSchema>;

// CRITICAL: Startup validation with detailed error reporting
export const validateAPIEnvironment = (): APIEnvironment => {
  const result = APIEnvironmentSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ API Environment validation failed:');
    result.error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    
    // In production, fail fast on environment issues
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    throw new Error('Invalid environment configuration');
  }
  
  // Additional security validations
  if (result.data.NODE_ENV === 'production') {
    if (!result.data.REDIS_URL) {
      console.error('❌ Redis URL is required in production');
      process.exit(1);
    }
    
    if (result.data.JWT_SECRET.length < 64) {
      console.warn('⚠️ JWT secret should be at least 64 characters in production');
    }
  }
  
  console.log('✅ API environment validation passed');
  return result.data;
};
```

### PHASE 3: Enhanced Security Testing (Week 3)

#### 3.1 Comprehensive Security Test Suite (LOW PRIORITY - QUAL-2025-002)
**Context**: Current tests lack security-specific scenarios and edge cases

```typescript
// CRITICAL: Security-focused test utilities
export const SecurityTestUtils = {
  // Rate limiting test helpers
  async testRateLimitEnforcement(app: Express, endpoint: string, limit: number) {
    const requests = Array.from({ length: limit + 10 }, (_, i) => 
      request(app)
        .get(endpoint)
        .set('X-Forwarded-For', '192.168.1.1') // Consistent IP
    );
    
    const responses = await Promise.allSettled(requests);
    const successful = responses.filter(r => 
      r.status === 'fulfilled' && r.value.status < 400
    ).length;
    
    expect(successful).toBeLessThanOrEqual(limit);
    
    // Verify rate limit headers are set
    const lastResponse = responses[responses.length - 1];
    if (lastResponse.status === 'fulfilled') {
      expect(lastResponse.value.headers['x-ratelimit-limit']).toBeDefined();
      expect(lastResponse.value.headers['x-ratelimit-remaining']).toBeDefined();
    }
  },

  // CSP violation test helpers
  async testCSPViolationReporting(app: Express) {
    const violationReport = {
      'csp-report': {
        'document-uri': 'https://example.com/page',
        'referrer': '',
        'violated-directive': 'script-src',
        'effective-directive': 'script-src',
        'original-policy': "default-src 'self'; script-src 'self'",
        'blocked-uri': 'https://malicious.com/evil.js',
        'status-code': 200,
      },
    };

    const response = await request(app)
      .post('/csp-report')
      .set('Content-Type', 'application/csp-report')
      .send(JSON.stringify(violationReport));

    expect(response.status).toBe(204);
  },

  // CORS preflight test helpers
  async testCORSPreflight(app: Express, origin: string, shouldAllow: boolean) {
    const response = await request(app)
      .options('/api/test')
      .set('Origin', origin)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type');

    if (shouldAllow) {
      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe(origin);
    } else {
      expect(response.status).toBe(500); // CORS error
    }
  },
};

// CRITICAL: Comprehensive security test suite
describe('API Security Test Suite', () => {
  describe('Rate Limiting Security', () => {
    it('should persist rate limits across server restarts', async () => {
      // Make requests up to limit
      await SecurityTestUtils.testRateLimitEnforcement(app, '/api/test', 5);
      
      // Simulate server restart
      await teardownApp();
      app = await setupApp();
      
      // Verify rate limit state persists (Redis-backed)
      const response = await request(app)
        .get('/api/test')
        .set('X-Forwarded-For', '192.168.1.1');
      
      expect(response.status).toBe(429);
    });

    it('should handle Redis connection failures gracefully', async () => {
      // Simulate Redis failure
      await redis.disconnect();
      
      const response = await request(app).get('/api/test');
      
      // Should still work (fail open) but log warning
      expect(response.status).toBe(200);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Redis unavailable')
      );
    });
  });

  describe('Error Handling Security', () => {
    it('should not leak sensitive information in error messages', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrong' });

      expect(response.status).toBe(401);
      expect(response.body.error.message).not.toContain('password');
      expect(response.body.error.message).not.toContain('database');
      expect(response.body.error.correlationId).toBeDefined();
    });

    it('should include correlation IDs in all error responses', async () => {
      const correlationId = 'test-correlation-123';
      
      const response = await request(app)
        .get('/api/nonexistent')
        .set('X-Correlation-ID', correlationId);

      expect(response.status).toBe(404);
      expect(response.body.error.correlationId).toBe(correlationId);
    });
  });

  describe('Input Validation Security', () => {
    it('should sanitize and validate all input data', async () => {
      const maliciousPayload = {
        title: '<script>alert("xss")</script>',
        content: 'javascript:alert("xss")',
        tags: ['<img src="x" onerror="alert(1)">'],
      };

      const response = await request(app)
        .post('/api/content')
        .send(maliciousPayload);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

## API Documentation Standards (LOW PRIORITY - QUAL-2025-003)

### OpenAPI 3.0 Security-Enhanced Specification

```typescript
// CRITICAL: Security-aware OpenAPI configuration
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Secure API Documentation',
      version: '1.0.0',
      description: 'Enterprise-grade API with comprehensive security controls',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'API Server',
      },
    ],
    // CRITICAL: Security schemes documentation
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          required: ['success', 'error', 'meta'],
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                code: { type: 'string' },
                correlationId: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
            meta: {
              type: 'object',
              properties: {
                requestId: { type: 'string' },
                version: { type: 'string' },
                path: { type: 'string' },
                method: { type: 'string' },
              },
            },
          },
        },
      },
    },
    // CRITICAL: Global security requirements
    security: [
      { bearerAuth: [] },
      { apiKey: [] },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const setupAPIDocumentation = (app: Express) => {
  const specs = swaggerJsdoc(swaggerOptions);
  
  // Security headers for documentation endpoint
  app.use('/api-docs', (req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Secure API Documentation',
  }));
};
```

## Success Metrics & Monitoring

### Security Monitoring Dashboard
```typescript
export const SecurityMetrics = {
  trackRateLimitViolations: (ip: string, endpoint: string) => {
    logger.warn('Rate limit violation', {
      event: 'RATE_LIMIT_EXCEEDED',
      ip,
      endpoint,
      timestamp: new Date().toISOString(),
    });
  },

  trackErrorRates: (endpoint: string, statusCode: number) => {
    if (statusCode >= 500) {
      logger.error('Server error occurred', {
        event: 'SERVER_ERROR',
        endpoint,
        statusCode,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackSecurityEvents: (event: string, details: Record<string, unknown>) => {
    logger.warn('Security event detected', {
      event: `SECURITY_${event}`,
      ...details,
      timestamp: new Date().toISOString(),
    });
  },
};
```

---

**Configuration Version**: 2.0.0 (Security Audit Compliance)  
**Audit Findings**: Addresses SEC-2025-001, QUAL-2025-001, SEC-2025-003, QUAL-2025-002, QUAL-2025-003  
**Security Level**: Enterprise-grade with comprehensive monitoring  
**Next Review**: Weekly security assessment required
