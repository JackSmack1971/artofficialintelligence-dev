import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner component', () => {
  it('renders default spinner text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('supports custom text', () => {
    render(<LoadingSpinner label="Please wait" />)
    expect(screen.getByText('Please wait')).toBeInTheDocument()
  })

  it.each([
    ['sm', 'h-4 w-4'],
    ['default', 'h-8 w-8'],
    ['lg', 'h-12 w-12']
  ] as const)('applies %s size classes', (size, className) => {
    const { container } = render(<LoadingSpinner size={size} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass(className)
  })

  it('sets accessibility attributes', () => {
    render(<LoadingSpinner />)
    const wrapper = screen.getByRole('status')
    expect(wrapper).toHaveAttribute('aria-live', 'polite')
  })

  it('merges custom className', () => {
    const { container } = render(<LoadingSpinner className="mt-2" />)
    expect(container.firstChild).toHaveClass('flex', 'mt-2')
  })
})
