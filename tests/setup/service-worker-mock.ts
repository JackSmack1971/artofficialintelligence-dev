import { vi } from 'vitest'

Object.assign(globalThis, {
  self: {
    skipWaiting: vi.fn(),
    clientsClaim: vi.fn(),
    addEventListener: vi.fn(),
    __WB_MANIFEST: []
  }
})

vi.mock(
  'workbox-recipes/warmStrategyCache',
  () => ({ warmStrategyCache: vi.fn() }),
  { virtual: true }
)
vi.mock(
  'workbox-recipes/warmStrategyCache.js',
  () => ({ warmStrategyCache: vi.fn() }),
  { virtual: true }
)
