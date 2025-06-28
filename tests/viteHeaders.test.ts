import config, { createDevHeaders, createDevNoncePlugin } from '../vite.config'
import { describe, expect, it } from 'vitest'
import type { UserConfig } from 'vite'

describe('vite dev security config', () => {
  it('adds security headers in development', () => {
    const cfg = (config as (env: { mode: string; command: string }) => UserConfig)({ mode: 'development', command: 'serve' })
    const headers = cfg.server.headers
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
    expect(headers['Strict-Transport-Security']).toContain('max-age')
    expect(headers['Content-Security-Policy']).toContain('script-src')
  })

  it('does not add headers in production', () => {
    const cfg = (config as (env: { mode: string; command: string }) => UserConfig)({ mode: 'production', command: 'build' })
    expect(cfg.server.headers).toBeUndefined()
  })

  it('replaces nonce placeholder', () => {
    const html = '<script nonce="__CSP_NONCE__"></script>'
    const plugin = createDevNoncePlugin('abc')
    const result = plugin.transformIndexHtml!(html)
    expect(result).toContain('nonce="abc"')
  })

  it('creates headers with nonce', () => {
    const h = createDevHeaders('xyz')
    expect(h['Content-Security-Policy']).toContain('nonce-xyz')
  })
})
