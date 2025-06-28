import { describe, expect, it } from 'vitest'

import { validateSecurityHeaders } from './security-headers'

describe('validateSecurityHeaders', () => {
  it('passes when headers match', () => {
    const headers = {
      'x-frame-options': 'DENY',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      'x-permitted-cross-domain-policies': 'none',
      'cross-origin-opener-policy': 'same-origin',
      'permissions-policy': 'geolocation=(), microphone=()'
    }
    expect(() => validateSecurityHeaders(headers)).not.toThrow()
  })
})
