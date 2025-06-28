import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'

import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { logger } from '../src/lib/logger'
import { createServer, startServer } from '../src/server'

let tmpDir: string

afterEach(async () => {
  if (tmpDir) await fs.rm(tmpDir, { recursive: true, force: true })
})

beforeEach(() => {
  process.env.CORS_ORIGIN = 'http://localhost'
})

describe('server nonce', () => {
  it('replaces __CSP_NONCE__ and sets CSP', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    await fs.writeFile(
      path.join(tmpDir, 'index.html'),
      '<!DOCTYPE html><script nonce="__CSP_NONCE__"></script>'
    )
    const app = createServer(tmpDir)
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    const csp = res.headers['content-security-policy'] as string
    const nonceMatch = csp.match(/nonce-([^';]+)/)
    expect(nonceMatch).toBeTruthy()
    const nonce = nonceMatch![1]
    expect(res.text).toContain(`nonce="${nonce}"`)
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain('https://cdn.jsdelivr.net')
    expect(csp).toContain('https://fonts.googleapis.com')
    expect(csp).toContain('https://fonts.gstatic.com')
    expect(csp).toContain('https://api.artofficial-intelligence.com')
  })

  it('returns 500 when index load fails', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    const app = createServer(tmpDir)
    const res = await request(app).get('/')
    expect(res.status).toBe(500)
  })

  it('startServer returns http.Server', async () => {
    const server = startServer(0)
    expect(server).toBeTruthy()
    await new Promise((resolve) => server.close(resolve))
  })

  it('logs server start', async () => {
    const spy = vi.spyOn(logger, 'info').mockImplementation(() => {})
    const server = startServer(0)
    await new Promise((r) => setTimeout(r, 20))
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Server running'))
    server.close()
    spy.mockRestore()
  })

  it('includes meta tags in served HTML', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    const rootIndex = await fs.readFile(
      path.join(process.cwd(), 'index.html'),
      'utf8'
    )
    await fs.writeFile(path.join(tmpDir, 'index.html'), rootIndex)
    const app = createServer(tmpDir)
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    const csp = res.headers['content-security-policy'] as string
    const nonce = csp.match(/nonce-([^';]+)/)![1]
    expect(res.text).toContain(`nonce="${nonce}"`)
    expect(res.text).toContain('<meta name="description"')
    expect(res.text).toContain('og:title')
    expect(res.text).toContain('twitter:card')
  })

  it('injects analytics script with nonce', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    const rootIndex = await fs.readFile(
      path.join(process.cwd(), 'index.html'),
      'utf8'
    )
    await fs.writeFile(path.join(tmpDir, 'index.html'), rootIndex)
    const app = createServer(tmpDir)
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    const csp = res.headers['content-security-policy'] as string
    const nonce = csp.match(/nonce-([^';]+)/)![1]
    expect(res.text).toContain('data-domain="%VITE_PLAUSIBLE_DOMAIN%"')
    expect(res.text).toContain('src="https://plausible.io/js/script.js"')
    expect(res.text).toContain(`nonce="${nonce}"`)
  })

  it('accepts CSP violation reports', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    await fs.writeFile(path.join(tmpDir, 'index.html'), '<!doctype html>')
    const app = createServer(tmpDir)
    const res = await request(app)
      .post('/csp-report')
      .set('Content-Type', 'application/csp-report')
      .send('{}')
    expect(res.status).toBe(204)
  })

  it('sets security headers', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    await fs.writeFile(path.join(tmpDir, 'index.html'), '<!doctype html>')
    const app = createServer(tmpDir)
    const res = await request(app).get('/')
    expect(res.headers['x-frame-options']).toBe('DENY')
    expect(res.headers['x-content-type-options']).toBe('nosniff')
    expect(res.headers['referrer-policy']).toBe('no-referrer')
    expect(res.headers['x-permitted-cross-domain-policies']).toBe('none')
    expect(res.headers['cross-origin-opener-policy']).toBe('same-origin')
    expect(res.headers['permissions-policy']).toBe(
      'geolocation=(), microphone=()'
    )
  })

  it('throws if CORS_ORIGIN is missing', () => {
    delete process.env.CORS_ORIGIN
    expect(() => createServer()).toThrow('CORS_ORIGIN is not defined')
  })

  it('rejects requests from invalid origins', async () => {
    process.env.CORS_ORIGIN = 'http://allowed.com'
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    await fs.writeFile(path.join(tmpDir, 'index.html'), '<!doctype html>')
    const app = createServer(tmpDir)
    const res = await request(app).get('/').set('Origin', 'http://bad.com')
    expect(res.status).toBe(500)
  })
})
