import { afterEach, describe, expect, it, vi } from 'vitest'

import { validateEnv } from '@/config/environment'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('environment validation', () => {
  const base = {
    NODE_ENV: 'development',
    PORT: '3000',
    CORS_ORIGIN: 'http://localhost:3000',
    REDIS_URL: 'redis://localhost:6379',
    JWT_SECRET: 'a'.repeat(32),
    CSP_REPORT_URI: 'https://csp.example.com/report'
  }

  it('throws when required variable missing', () => {
    Object.entries(base).forEach(([k, v]) => vi.stubEnv(k, v))
    vi.stubEnv('REDIS_URL', undefined as unknown as string)
    expect(() => validateEnv()).toThrow('REDIS_URL')
  })

  it('throws on invalid CORS_ORIGIN format', () => {
    Object.entries(base).forEach(([k, v]) => vi.stubEnv(k, v))
    vi.stubEnv('CORS_ORIGIN', 'not-a-url')
    expect(() => validateEnv()).toThrow('Invalid URL')
  })

  it('enforces https in production', () => {
    Object.entries(base).forEach(([k, v]) => vi.stubEnv(k, v))
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('CORS_ORIGIN', 'http://localhost')
    expect(() => validateEnv()).toThrow('https')
  })

  it('returns parsed values when valid', () => {
    Object.entries(base).forEach(([k, v]) => vi.stubEnv(k, v))
    const env = validateEnv()
    expect(env.PORT).toBe(3000)
    expect(env.CORS_ORIGIN).toEqual(['http://localhost:3000'])
    expect(env.CSP_REPORT_URI).toBe('https://csp.example.com/report')
  })
})
