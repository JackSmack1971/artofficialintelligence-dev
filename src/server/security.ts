import helmet from 'helmet'

import { env } from '@/config/environment'
import { createCspDirectives, generateNonce } from '@/lib/security'

import type { NextFunction, Request, Response } from 'express'

export function securityMiddleware() {
  return [
    (_req: Request, res: Response, next: NextFunction) => {
      res.locals.nonce = generateNonce()
      next()
    },
    (req: Request, res: Response, next: NextFunction) =>
      helmet.contentSecurityPolicy({
        useDefaults: false,
        directives: createCspDirectives(res.locals.nonce as string, {
          env: env.NODE_ENV,
          reportUri: env.CSP_REPORT_URI || '/csp-report'
        }) as unknown as Record<string, string[]>
      })(req, res, next),
    helmet.referrerPolicy({ policy: 'no-referrer' }),
    helmet.permittedCrossDomainPolicies(),
    helmet.crossOriginOpenerPolicy(),
    (_req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()')
      next()
    },
    helmet.frameguard({ action: 'deny' }),
    helmet.noSniff(),
    helmet.hsts({ maxAge: 31536000 })
  ]
}
