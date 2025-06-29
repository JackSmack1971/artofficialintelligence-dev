import { randomBytes } from 'crypto'

export interface CspDirectives {
  defaultSrc: string[]
  scriptSrc: string[]
  styleSrc: string[]
  fontSrc: string[]
  imgSrc: string[]
  connectSrc: string[]
  objectSrc: string[]
  baseUri: string[]
  formAction: string[]
  reportUri?: string[]
}

export function generateNonce(): string {
  return randomBytes(16).toString('base64')
}

export interface CreateCspOptions {
  env?: 'development' | 'production' | 'test'
  reportUri?: string
}

export function createCspDirectives(
  nonce: string,
  opts: CreateCspOptions = {}
): CspDirectives {
  const env = opts.env ?? process.env.NODE_ENV ?? 'production'
  const directives: CspDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", `'nonce-${nonce}'`, 'https://cdn.jsdelivr.net', 'https://plausible.io'],
    styleSrc: ["'self'", `'nonce-${nonce}'`, 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.artofficial-intelligence.com'],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  }

  if (env !== 'production') directives.connectSrc.push('ws:')
  if (opts.reportUri) directives.reportUri = [opts.reportUri]

  return directives
}

export interface SecurityHeaders {
  'Content-Security-Policy': string
  'X-Frame-Options': string
  'X-Content-Type-Options': string
  'Strict-Transport-Security': string
  'Referrer-Policy'?: string
  'X-Permitted-Cross-Domain-Policies'?: string
  'Cross-Origin-Opener-Policy'?: string
  'Permissions-Policy'?: string
}
