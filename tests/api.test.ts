import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError, fetchWithRetry, getArticles } from '@/lib/api'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('fetchWithRetry', () => {
  it('returns response on success', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200 }))
    const res = await fetchWithRetry('/api')
    expect(res.ok).toBe(true)
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      'https://api/api',
      expect.anything()
    )
  })

  it('retries and throws ApiError on failure', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api')
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
    vi.stubEnv('VITE_API_URL', 'https://api')
    vi.stubGlobal(
      'fetch',
      (_url: string, opts: { signal: AbortSignal }) =>
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

describe('getArticles', () => {
  const mockData = {
    success: true,
    data: [
      {
        id: '1',
        title: 't',
        excerpt: 'e',
        author: { id: 'a', name: 'x', avatar: 'https://ex.com/a.png' },
        image: 'https://ex.com/img.png'
      }
    ]
  }

  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'https://api')
  })

  it('returns articles on success', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockData })
    vi.stubGlobal('fetch', fetchMock)
    const res = await getArticles()
    expect(res.length).toBe(1)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api/articles',
      expect.anything()
    )
  })

  it('throws ApiError on api error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false, error: 'bad' })
      })
    )
    await expect(getArticles()).rejects.toBeInstanceOf(ApiError)
  })

  it('throws ApiError on invalid json', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    )
    await expect(getArticles()).rejects.toBeInstanceOf(ApiError)
  })

  it('throws ApiError on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')))
    await expect(getArticles({ retries: 0 })).rejects.toBeInstanceOf(ApiError)
  })
})
