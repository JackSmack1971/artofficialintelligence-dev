import { useState } from 'react'

import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import ErrorBoundary from '@/components/ErrorBoundary'
import { logger } from '../src/lib/logger'

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
    const spy = vi.spyOn(logger, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    )

    const [msg, errArg, context] = spy.mock.calls[0]
    expect(msg).toBe('ErrorBoundary caught')
    expect(errArg).toBeInstanceOf(Error)
    expect(errArg.message).toBe('boom')
    expect(context).toEqual(
      expect.objectContaining({ componentStack: expect.any(String) })
    )

    spy.mockRestore()
  })
})
