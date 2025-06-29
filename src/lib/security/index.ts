import { webcrypto } from 'crypto'

export interface CspDirectives {
  defaultSrc: string[]
  scriptSrc: string[]
  scriptSrcElem?: string[]
  styleSrc: string[]
  fontSrc: string[]
  imgSrc: string[]
  connectSrc: string[]
  requireSriFor?: ("script" | "style")[]
}

export function generateNonce(): string {
  const arr = new Uint8Array(16)
  webcrypto.getRandomValues(arr)
  return Buffer.from(arr).toString('base64')
}

export function createCspDirectives(nonce: string): CspDirectives {
  return {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", `'nonce-${nonce}'`],
    scriptSrcElem: [
      "'self'",
      'https://cdn.jsdelivr.net',
      'https://plausible.io',
      `'nonce-${nonce}'`
    ],
    styleSrc: ["'self'", `'nonce-${nonce}'`, 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'https://api.artofficial-intelligence.com', 'ws:'],
    requireSriFor: ['script', 'style']
  } as const
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
