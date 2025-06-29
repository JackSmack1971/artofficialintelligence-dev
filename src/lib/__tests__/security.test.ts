import { describe, expect, it } from 'vitest'

import { createCspDirectives, generateNonce } from '../security'

describe('security utilities', () => {
  it('generates a unique base64 nonce', () => {
    const a = generateNonce()
    const b = generateNonce()
    expect(a).toMatch(/^[a-zA-Z0-9+/]+={0,2}$/)
    expect(a).not.toBe(b)
  })

  it('creates CSP directives with provided options', () => {
    const directives = createCspDirectives('abc', {
      env: 'development',
      reportUri: 'https://csp.example.com'
    })
    expect(directives.scriptSrc).toContain("'nonce-abc'")
    expect(directives.connectSrc).toContain('ws:')
    expect(directives.reportUri).toEqual(['https://csp.example.com'])
  })
})
