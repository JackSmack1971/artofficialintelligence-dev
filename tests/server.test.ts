import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'

import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { logger } from '../src/lib/logger'
import { createServer, startServer } from '../src/server'
import { validateSecurityHeaders } from './utils/security-headers'

let tmpDir: string

afterEach(async () => {
  if (tmpDir) await fs.rm(tmpDir, { recursive: true, force: true })
})

beforeEach(() => {
  process.env.CORS_ORIGIN = 'http://localhost'
  process.env.REDIS_URL = 'redis://localhost:6379'
})

describe('server nonce', () => {
  it('replaces __CSP_NONCE__ and sets CSP', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    await fs.writeFile(
      path.join(tmpDir, 'index.html'),
      '<!DOCTYPE html><script nonce="__CSP_NONCE__"></script>'
    )
    const app = await createServer(tmpDir)
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.headers['x-correlation-id']).toBeTruthy()
    const csp = res.headers['content-security-policy'] as string
    const nonceMatch = csp.match(/nonce-([^';]+)/)
    expect(nonceMatch).toBeTruthy()
    const nonce = nonceMatch![1]
    expect(res.text).toContain(`nonce="${nonce}"`)
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain('https://cdn.jsdelivr.net')
    expect(csp).toContain('https://plausible.io')
    expect(csp).toContain('https://fonts.googleapis.com')
    expect(csp).toContain('https://fonts.gstatic.com')
    expect(csp).toContain('https://api.artofficial-intelligence.com')
  })

  it('returns 500 when index load fails', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    const app = await createServer(tmpDir)
    const res = await request(app).get('/')
    expect(res.status).toBe(500)
    expect(res.body.success).toBe(false)
    expect(res.body.meta.correlationId).toBeTruthy()
  })

  it('startServer returns http.Server', async () => {
    const server = await startServer(0)
    expect(server).toBeTruthy()
    await new Promise((resolve) => server.close(resolve))
  })

  it('logs server start', async () => {
    const spy = vi.spyOn(logger, 'info').mockImplementation(() => {})
    const server = await startServer(0)
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
    const app = await createServer(tmpDir)
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
    const app = await createServer(tmpDir)
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    const csp = res.headers['content-security-policy'] as string
    const nonce = csp.match(/nonce-([^';]+)/)![1]
    expect(res.text).toContain('data-domain="%VITE_PLAUSIBLE_DOMAIN%"')
    expect(res.text).toContain('src="https://plausible.io/js/script.js"')
    expect(res.text).toContain('integrity="sha384-CDEDrer5PucbuvsrRyDyemt/nH82CYOEO7G6KNCqPoHpss5tU/bGhbY6TFdDfMqE"')
    expect(res.text).toContain(`nonce="${nonce}"`)
    expect(res.text).toContain('onerror="loadLocalPlausible()"')
  })

  it('accepts CSP violation reports', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    await fs.writeFile(path.join(tmpDir, 'index.html'), '<!doctype html>')
    const app = await createServer(tmpDir)
    const res = await request(app)
      .post('/csp-report')
      .set('Content-Type', 'application/csp-report')
      .send('{}')
    expect(res.status).toBe(204)
  })

  it('sets security headers', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    await fs.writeFile(path.join(tmpDir, 'index.html'), '<!doctype html>')
    const app = await createServer(tmpDir)
    const res = await request(app).get('/')
    validateSecurityHeaders(res.headers as Record<string, string>)
  })

  it('throws if CORS_ORIGIN is missing', () => {
    delete process.env.CORS_ORIGIN
    expect(() => createServer()).toThrow('CORS_ORIGIN is not defined')
  })

  it('rejects requests from invalid origins', async () => {
    process.env.CORS_ORIGIN = 'http://allowed.com'
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    await fs.writeFile(path.join(tmpDir, 'index.html'), '<!doctype html>')
    const app = await createServer(tmpDir)
    const res = await request(app).get('/').set('Origin', 'http://bad.com')
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('INVALID_ORIGIN')
  })
})

describe('rate limiter', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production'
    process.env.CORS_ORIGIN = 'http://localhost'
    process.env.REDIS_URL = 'redis://localhost:6379'
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('persists counts across restarts using redis-mock', async () => {
    vi.mock('redis', async () => {
      const redis = await import('redis-mock')
      const client = redis.createClient()
      return { createClient: () => client }
    })
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'rl-redis-'))
    await fs.writeFile(path.join(tmpDir, 'index.html'), '<!doctype html>')
    const { createServer: create } = await import('../src/server')
    const app1 = await create(tmpDir)
    for (let i = 0; i < 100; i++) {
      await request(app1).get('/').set('X-Forwarded-Proto', 'https')
    }
    const app2 = await create(tmpDir)
    const res = await request(app2).get('/').set('X-Forwarded-Proto', 'https')
    expect(res.status).toBe(429)
  })

  it('denies requests when redis fails', async () => {
    vi.mock('redis', () => ({
      createClient: () => ({
        connect: () => Promise.reject(new Error('fail')),
        on: () => {},
        sendCommand: () => Promise.reject(new Error('fail'))
      })
    }))
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {})
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'rl-fail-'))
    await fs.writeFile(path.join(tmpDir, 'index.html'), '<!doctype html>')
    const { createServer: create } = await import('../src/server')
    const app = await create(tmpDir)
    const res = await request(app).get('/')
    expect(res.status).toBe(503)
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
