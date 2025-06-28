import { describe, expect, it } from 'vitest'

import { createCspDirectives, generateNonce } from '../security'

describe('security utilities', () => {
  it('generates a base64 nonce', () => {
    const nonce = generateNonce()
    expect(nonce).toMatch(/^[a-zA-Z0-9+/]+={0,2}$/)
    expect(nonce.length).toBeGreaterThan(0)
  })

  it('creates CSP directives with provided nonce', () => {
    const directives = createCspDirectives('abc')
    expect(directives.scriptSrc).toContain("'nonce-abc'")
  })
})
