import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'

const ProblemChild = () => {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  it('renders fallback when child throws', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument()
  })

  it('resets error when resetError is called', () => {
    const Wrapper = () => {
      const [shouldThrow, setShouldThrow] = useState(true)
      const Fallback = ({
        resetError
      }: {
        error: Error
        resetError: () => void
      }) => (
        <button
          onClick={() => {
            setShouldThrow(false)
            resetError()
          }}
        >
          retry
        </button>
      )

      return (
        <ErrorBoundary fallback={Fallback}>
          {shouldThrow ? <ProblemChild /> : <div>safe</div>}
        </ErrorBoundary>
      )
    }

    render(<Wrapper />)
    const button = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(button)
    expect(screen.getByText('safe')).toBeInTheDocument()
  })

  it('logs timestamp, message, and stack when error occurs', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    )
    expect(spy).toHaveBeenCalledWith(
      'ErrorBoundary caught',
      expect.objectContaining({
        timestamp: expect.any(String),
        message: 'boom',
        componentStack: expect.any(String)
      })
    )
    spy.mockRestore()
  })
})
