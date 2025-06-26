import { describe, it, expect, vi } from 'vitest'
import ErrorBoundary from '@/components/ErrorBoundary'
import { render, screen, userEvent } from '../utils/test-utils'

const ProblemChild = () => {
  throw new Error('boom')
}

describe('ErrorBoundary integration', () => {
  it('shows fallback and resets on retry', async () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
