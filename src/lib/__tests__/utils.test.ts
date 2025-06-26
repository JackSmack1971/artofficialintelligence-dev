import { describe, expect, it } from 'vitest'

import { cn } from '../utils'

describe('cn utility', () => {
  it('combines multiple classes', () => {
    expect(cn('p-2', 'text-center')).toBe('p-2 text-center')
  })

  it('handles conditional classes', () => {
    expect(cn('p-2', false && 'hidden', 'block')).toBe('p-2 block')
  })

  it('resolves tailwind conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('ignores undefined values', () => {
    expect(cn('p-2', undefined, 'text-sm')).toBe('p-2 text-sm')
  })
})
