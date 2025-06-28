import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useArticles } from '@/hooks/useArticles'

const mockArticles = [
  {
    id: '1',
    title: 'One',
    excerpt: 'Ex',
    author: { id: 'a1', name: 'Jane', avatar: 'https://example.com/a.png' },
    image: 'https://example.com/img.png'
  }
]

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('useArticles', () => {
  it('initializes with loading state', () => {
    const { result } = renderHook(() => useArticles({ retries: 0 }))
    expect(result.current.loading).toBe(true)
  })
  it('returns data on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => mockArticles })
    )
    const { result } = renderHook(() => useArticles())
    await waitFor(() => !result.current.loading)
    expect(result.current.data.length).toBe(1)
    expect(result.current.error).toBeUndefined()
  })

  it('sets error on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    )
    const { result } = renderHook(() => useArticles({ retries: 0 }))
    await waitFor(() => result.current.error !== undefined)
    expect(result.current.error).toMatch('500')
    expect(result.current.data).toEqual([])
  })

  it('handles fetch rejection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')))
    const { result } = renderHook(() => useArticles({ retries: 0 }))
    await waitFor(() => result.current.error !== undefined)
    expect(result.current.error).toBe('boom')
  })

  it('handles timeout', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError'))
    )
    const { result } = renderHook(() => useArticles({ retries: 0 }))
    await waitFor(() => result.current.error !== undefined)
    expect(result.current.error).toBe('Request timed out')
  })
})
