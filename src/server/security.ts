import { webcrypto } from 'crypto'

import helmet from 'helmet'

import type { NextFunction, Request, Response } from 'express'

export function generateNonce() {
  const arr = new Uint8Array(16)
  webcrypto.getRandomValues(arr)
  return Buffer.from(arr).toString('base64')
}

function createDirectives(res: Response) {
  return {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      'https://cdn.jsdelivr.net',
      `'nonce-${res.locals.nonce as string}'`
    ],
    styleSrc: [
      "'self'",
      `'nonce-${res.locals.nonce as string}'`,
      'https://fonts.googleapis.com'
    ],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.artofficial-intelligence.com', 'ws:']
  } as const
}

export function securityMiddleware() {
  return [
    (_req: Request, res: Response, next: NextFunction) => {
      res.locals.nonce = generateNonce()
      next()
    },
    (req: Request, res: Response, next: NextFunction) =>
      helmet.contentSecurityPolicy({
        useDefaults: false,
        directives: createDirectives(res)
      })(req, res, next),
    helmet.frameguard({ action: 'deny' }),
    helmet.noSniff(),
    helmet.hsts({ maxAge: 31536000 })
  ]
}
