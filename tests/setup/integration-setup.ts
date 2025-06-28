import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'
import { afterEach, expect } from 'vitest'

expect.extend(toHaveNoViolations)

afterEach(() => {
  cleanup()
})

process.env.VITE_API_URL = 'http://localhost'
