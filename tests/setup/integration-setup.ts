import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'
import { afterEach, expect, vi } from 'vitest'

expect.extend(toHaveNoViolations)

afterEach(() => {
  cleanup()
})

// Mock canvas to prevent errors in tests
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  writable: true,
  value: vi.fn()
})

process.env.VITE_API_URL = 'http://localhost'
