import { describe, expect, it, vi } from 'vitest'
import * as routing from 'workbox-routing'
vi.mock('workbox-routing', async () => {
  const actual = await vi.importActual<typeof import('workbox-routing')>('workbox-routing')
  return {
    ...actual,
    registerRoute: vi.fn()
  }
})

describe('service worker setup', () => {
  it('registers runtime caching routes', async () => {
    await import('../src/sw')
    expect(routing.registerRoute).toHaveBeenCalledTimes(2)
  })
})
