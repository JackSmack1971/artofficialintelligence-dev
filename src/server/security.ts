import helmet from 'helmet'

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
        directives: createCspDirectives(res.locals.nonce as string)
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
