import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchWithRetry, ApiError } from '@/lib/api'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchWithRetry', () => {
  it('returns response on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
    const res = await fetchWithRetry('/api')
    expect(res.ok).toBe(true)
  })

  it('retries and throws ApiError on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    )
    await expect(
      fetchWithRetry('/api', { retries: 1, timeout: 10 })
    ).rejects.toBeInstanceOf(ApiError)
  })

  it('throws ApiError on timeout', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      (_url, opts: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) =>
          opts.signal.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError'))
          )
        )
    )
    const promise = fetchWithRetry('/api', { timeout: 10, retries: 0 })
    vi.runAllTimers()
    await expect(promise).rejects.toBeInstanceOf(ApiError)
    vi.useRealTimers()
  })
})
