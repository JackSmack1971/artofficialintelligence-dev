import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Skeleton from '../Skeleton'

describe('Skeleton component', () => {
  it('renders default skeleton', () => {
    render(<Skeleton />)
    expect(screen.getAllByTestId('skeleton-block').length).toBe(1)
  })

  it('renders multiple skeleton blocks', () => {
    render(<Skeleton count={3} />)
    expect(screen.getAllByTestId('skeleton-block').length).toBe(3)
  })

  it('merges custom className', () => {
    render(<Skeleton className="h-8" />)
    const block = screen.getByTestId('skeleton-block')
    expect(block).toHaveClass('h-8')
  })
})
