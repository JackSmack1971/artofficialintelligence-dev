import { expect } from 'vitest'

export function validateSecurityHeaders(headers: Record<string, string>): void {
  expect(headers['x-frame-options']).toBe('DENY')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('no-referrer')
  expect(headers['x-permitted-cross-domain-policies']).toBe('none')
  expect(headers['cross-origin-opener-policy']).toBe('same-origin')
  expect(headers['permissions-policy']).toBe('geolocation=(), microphone=()')
}
