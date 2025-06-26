import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import LoadingSpinner from '@/components/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders spinner with status role', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('h-4 w-4')
  })

  it('allows custom label', () => {
    render(<LoadingSpinner label="Please wait" />)
    expect(screen.getByText('Please wait')).toBeInTheDocument()
  })
})
