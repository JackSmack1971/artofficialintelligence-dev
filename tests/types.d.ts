import 'vitest'
import type { IToHaveNoViolations, JestAxe } from 'jest-axe'

declare module 'jest-axe' {
  export const axe: JestAxe
  export const toHaveNoViolations: {
    toHaveNoViolations: IToHaveNoViolations
  }
}

declare module 'vitest' {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): T
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void
  }
}
