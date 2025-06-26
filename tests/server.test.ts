import { afterEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { createServer } from '../src/server'

let tmpDir: string

afterEach(async () => {
  if (tmpDir) await fs.rm(tmpDir, { recursive: true, force: true })
})

describe('server nonce', () => {
  it('replaces __NONCE__ and sets CSP', async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nonce-test-'))
    await fs.writeFile(
      path.join(tmpDir, 'index.html'),
      '<!DOCTYPE html><script nonce="__NONCE__"></script>'
    )
    const app = createServer(tmpDir)
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    const csp = res.headers['content-security-policy'] as string
    const nonceMatch = csp.match(/nonce-([^';]+)/)
    expect(nonceMatch).toBeTruthy()
    const nonce = nonceMatch![1]
    expect(res.text).toContain(`nonce="${nonce}"`)
  })
})
