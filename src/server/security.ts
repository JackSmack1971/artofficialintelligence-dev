import helmet from 'helmet'
import crypto from 'crypto'
import type { Request, Response, NextFunction } from 'express'
import type { IncomingMessage, ServerResponse } from 'http'

export function securityMiddleware() {
  const directives: Exclude<
    Parameters<typeof helmet.contentSecurityPolicy>[0],
    undefined
  >['directives'] = {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      'https://cdn.jsdelivr.net',
      (_req: IncomingMessage, res: ServerResponse) =>
        `'nonce-${(res as unknown as Response).locals.nonce}'`
    ],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.artofficial-intelligence.com', 'ws:']
  }

  return [
    (_req: Request, res: Response, next: NextFunction) => {
      res.locals.nonce = crypto.randomBytes(16).toString('base64')
      next()
    },
    helmet.contentSecurityPolicy({ useDefaults: false, directives })
  ]
}
