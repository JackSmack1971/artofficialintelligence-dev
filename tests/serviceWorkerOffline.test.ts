import { describe, expect, it, vi } from 'vitest'
vi.mock('workbox-recipes', () => ({ offlineFallback: vi.fn() }))
import { offlineFallback } from 'workbox-recipes'

describe('service worker offline fallback', () => {
  it('configures offline page', async () => {
    await import('../src/sw')
    expect(offlineFallback).toHaveBeenCalledWith({ pageFallback: '/offline.html' })
  })
})
