import { describe, expect, it } from 'vitest'

import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('p-2', false && 'hidden', 'text-center')).toBe('p-2 text-center')
  })

  it('deduplicates tailwind classes', () => {
    expect(cn('p-2', 'p-3').split(' ').pop()).toBe('p-3')
  })
})
