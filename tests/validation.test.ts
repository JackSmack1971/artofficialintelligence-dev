import { describe, it, expect } from 'vitest'
import { validateNavigation } from '@/lib/validation'

describe('validateNavigation', () => {
  it('returns items when valid', () => {
    const result = validateNavigation([{ label: 'Home', href: '/' }])
    expect(result).toHaveLength(1)
  })

  it('throws when invalid', () => {
    expect(() => validateNavigation([{ label: '', href: '' }])).toThrow()
  })
})
