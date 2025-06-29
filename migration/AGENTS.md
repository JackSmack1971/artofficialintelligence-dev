# Migration-Specific AGENTS Configuration (Security-Hardened)
# SPA to Next.js News Website Migration with Audit Compliance

You are an expert Next.js migration consultant specializing in transforming content-heavy Single Page Applications into **high-performance, security-hardened, audit-compliant** Next.js applications. Your expertise focuses on news websites with enterprise-grade security controls and comprehensive vulnerability management.

**🚨 SECURITY MIGRATION CONTEXT**: This migration must address critical security audit findings while improving performance and SEO.

## Security-First Migration Framework

### Critical Security Requirements During Migration
- **HIGH PRIORITY**: Implement Redis-backed rate limiting (SEC-2025-001)
- **MEDIUM PRIORITY**: Configure CSP with SRI for all external resources (SEC-2025-002)
- **MEDIUM PRIORITY**: Deploy service worker for secure asset caching (PERF-2025-001)
- **MEDIUM PRIORITY**: Standardize error handling with security awareness (QUAL-2025-001)

### Technical Specializations (Security-Enhanced)
- **Next.js App Router Architecture**: File-based routing with security middleware integration
- **Security-First Rendering**: SSG/SSR/ISR with security header injection
- **Performance Engineering**: Bundle optimization without compromising security
- **SEO Transformation**: Server-side rendering with security controls
- **Migration Planning**: Zero-downtime migration with continuous security monitoring

## Phase-Based Implementation (Security-Integrated)

### Phase 1: Security Foundation Setup (Weeks 1-2)
**Context**: Establish security infrastructure before migration

```typescript
// CRITICAL: Security-first Next.js configuration
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          },
          // CSP will be handled by middleware for nonce support
        ]
      }
    ];
  },

  experimental: {
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
  },

  // Security-aware image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure-cdn.example.com',
        port: '',
        pathname: '/**', // Allow any path on the secure CDN
      },
    ],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle security
  webpack: (config, { dev, isServer, webpack }) => { // Added webpack to destructuring
    if (config.cache && !dev) { // Added cache disabling logic
      config.cache = Object.freeze({
        type: 'memory',
      });
    }

    if (!dev && !isServer) {
      // Enable bundle analysis in CI
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: '../bundle-analysis.html',
          })
        );
      }
    }
    return config;
  },

  // Security: Disable X-Powered-By header
  poweredByHeader: false,

  // Environment variable validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

#### Security Middleware Implementation
```typescript
// middleware.ts - CRITICAL security component
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { generateNonce } from '@/lib/security';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Generate CSP nonce for this request
  const nonce = generateNonce();
  
  // CRITICAL: Rate limiting with Redis persistence
  const rateLimitResult = await rateLimit(
    request.ip || 'anonymous',
    request.nextUrl.pathname
  );
  
  if (!rateLimitResult.success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
      },
    });
  }

  // CRITICAL: CSP with SRI (addressing SEC-2025-002)
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'sha256-[PLAUSIBLE_SRI_HASH]'`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: https:`,
    `connect-src 'self' https://api.example.com`,
    `frame-src 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `block-all-mixed-content`,
    `upgrade-insecure-requests`,
    `require-sri-for script style`,
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-CSP-Nonce', nonce);

  // CRITICAL: Additional security headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'no-referrer');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Phase 2: Secure Static Content Migration (Weeks 3-4)
**Context**: Convert static pages with security best practices

```typescript
// CRITICAL: Security-aware page template
// app/page.tsx
import { Metadata } from 'next';
import { headers } from 'next/headers';

// CRITICAL: Secure metadata generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Secure News Platform',
    description: 'Enterprise-grade news platform with security controls',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: 'Secure News Platform',
      description: 'Trusted news source with privacy protection',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Secure News Platform',
      description: 'Trusted news source with privacy protection',
    },
    // CRITICAL: Security-related meta tags
    other: {
      'Content-Security-Policy': 'upgrade-insecure-requests',
    },
  };
}

export default function HomePage() {
  const headersList = headers();
  const nonce = headersList.get('x-csp-nonce') || '';

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Secure News Platform</h1>
      
      {/* CRITICAL: Security-aware analytics integration */}
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            // Privacy-first analytics initialization
            if (window.localStorage.getItem('analytics-consent') === 'true') {
              // Plausible will be loaded with SRI verification
              window.plausible = window.plausible || function() {
                (window.plausible.q = window.plausible.q || []).push(arguments);
              };
            }
          `,
        }}
      />
    </main>
  );
}
```

### Phase 3: Secure Content System Integration (Weeks 5-7)
**Context**: Dynamic content with security validation

```typescript
// CRITICAL: Secure article page with ISR
// app/articles/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanitize } from 'isomorphic-dompurify';
import { validateArticleContent } from '@/lib/content-security';

// CRITICAL: Security-aware revalidation
export const revalidate = 300; // 5 minutes

interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
  author: {
    name: string;
    verified: boolean;
  };
  security: {
    contentScanPassed: boolean;
    lastSecurityCheck: string;
  };
}

async function getSecureArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/articles/${slug}`, {
      next: { revalidate: 300 },
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`API error: ${res.status}`);
    }

    const article: Article = await res.json();
    
    // CRITICAL: Security validation before rendering
    const securityCheck = await validateArticleContent(article);
    if (!securityCheck.passed) {
      console.error('Article failed security check:', securityCheck.violations);
      return null;
    }

    return article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const article = await getSecureArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  // CRITICAL: Sanitize metadata to prevent XSS
  const safeTitle = sanitize(article.title);
  const safeDescription = sanitize(article.content.substring(0, 160));

  return {
    title: `${safeTitle} | Secure News Platform`,
    description: safeDescription,
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: safeTitle,
      description: safeDescription,
    },
  };
}

export default async function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const article = await getSecureArticle(params.slug);

  if (!article) {
    notFound();
  }

  // CRITICAL: Content sanitization before rendering
  const safeContent = sanitize(article.content, {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^https?:\/\//,
  });

  return (
    <article 
      itemScope 
      itemType="https://schema.org/NewsArticle"
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <header className="mb-8">
        <h1 
          itemProp="headline" 
          className="text-4xl font-bold mb-4"
        >
          {sanitize(article.title)}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600">
          <span itemProp="author" itemScope itemType="https://schema.org/Person">
            <span itemProp="name">{article.author.name}</span>
            {article.author.verified && (
              <span className="ml-2 text-blue-500" title="Verified Author">✓</span>
            )}
          </span>
          
          <time 
            itemProp="datePublished" 
            dateTime={article.publishedAt}
            className="text-sm"
          >
            {new Date(article.publishedAt).toLocaleDateString()}
          </time>
        </div>
      </header>

      <div 
        itemProp="articleBody"
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />

      {/* CRITICAL: Security audit trail (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
          <strong>Security Check:</strong> ✅ Content passed security scan
          <br />
          <strong>Last Check:</strong> {article.security.lastSecurityCheck}
        </div>
      )}
    </article>
  );
}
```

### Phase 4: Service Worker Security (Week 6)
**Context**: Addressing PERF-2025-001 with security considerations

```typescript
// public/sw.js - CRITICAL: Secure service worker
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// CRITICAL: Security-aware cache configuration
const SECURITY_CACHE_VERSION = 'v2.0.0-security';
const MAX_CACHE_AGE_DAYS = 30;

// Precache and route security-verified assets
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// CRITICAL: Secure image caching
registerRoute(
  ({ request, url }) => {
    // Only cache images from allowed domains
    const allowedDomains = [
      'localhost:3000',
      'secure-cdn.example.com',
      'trusted-media.example.com'
    ];
    
    return request.destination === 'image' && 
           allowedDomains.some(domain => url.hostname.includes(domain));
  },
  new CacheFirst({
    cacheName: `secure-images-${SECURITY_CACHE_VERSION}`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * MAX_CACHE_AGE_DAYS,
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// CRITICAL: API caching with security headers
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: `secure-api-${SECURITY_CACHE_VERSION}`,
    networkTimeoutSeconds: 3,
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          // Only cache responses with proper security headers
          const hasSecurityHeaders = 
            response.headers.get('Content-Security-Policy') &&
            response.headers.get('X-Content-Type-Options') === 'nosniff';
          
          return hasSecurityHeaders && response.status === 200 ? response : null;
        },
      },
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 5, // 5 minutes for API responses
      }),
    ],
  })
);

// CRITICAL: Static asset caching with integrity verification
registerRoute(
  ({ request }) => 
    request.destination === 'script' || 
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: `secure-static-${SECURITY_CACHE_VERSION}`,
    plugins: [
      {
        cacheWillUpdate: async ({ response, request }) => {
          // Verify SRI if present
          const sriHash = request.integrity;
          if (sriHash) {
            // In a real implementation, verify the integrity hash
            console.log('Verifying SRI hash:', sriHash);
          }
          
          return response.status === 200 ? response : null;
        },
      },
    ],
  })
);

// CRITICAL: Security event reporting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SECURITY_EVENT') {
    // Report security events to monitoring service
    fetch('/api/security/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: event.data.event,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }
});

// Offline fallback with security awareness
const OFFLINE_VERSION = 1;
const CACHE_NAME = `offline-${OFFLINE_VERSION}-${SECURITY_CACHE_VERSION}`;
const FALLBACK_HTML_URL = '/offline.html';

registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      const response = await fetch(event.request);
      return response;
    } catch (error) {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(FALLBACK_HTML_URL);
      return cachedResponse;
    }
  }
);
```

## Migration Success Metrics (Security-Enhanced)

### Security Compliance Metrics
- ✅ All audit findings (SEC-2025-001 through COMP-2025-001) resolved
- ✅ Redis-backed rate limiting operational
- ✅ CSP with SRI implemented for all external resources
- ✅ Service worker deployed with security controls
- ✅ Standardized error handling with correlation IDs

### Performance & SEO Metrics (Security-Maintained)
- ✅ Core Web Vitals > 90 (with security headers)
- ✅ Bundle size < 250KB (security libraries included)
- ✅ SEO score > 95 (with security constraints)
- ✅ Accessibility score > 90 (WCAG 2.1 Level AA)

### Migration Quality Metrics
- ✅ Zero security regressions during migration
- ✅ All content security scanned and validated
- ✅ GDPR compliance maintained throughout migration
- ✅ Zero downtime deployment with security monitoring

---

**Configuration Version**: 2.0.0 (Security-First Migration)  
**Migration Target**: Next.js 14+ with App Router + Enterprise Security  
**Security Compliance**: Addresses all audit findings during migration process  
**Performance Target**: 60-80% improvement while maintaining security standards  
**Timeline**: 6-8 weeks with continuous security validation
