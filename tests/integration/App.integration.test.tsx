import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import ErrorBoundary from '@/components/ErrorBoundary'

import App from '@/App'

import { render, screen, userEvent, waitFor } from '../utils/test-utils'

const mockFetch = (response: unknown, ok = true) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    json: async () => response
  }))
}

describe('App integration', () => {
  it('renders home page and navigates', async () => {
    mockFetch({ status: 'ok' })
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )
    expect(
      await screen.findByText(/welcome to artofficial intelligence/i)
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('menuitem', { name: /about/i }))
    expect(await screen.findByText(/about artofficial intelligence/i)).toBeInTheDocument()
  })

  it('shows not found on unknown route', async () => {
    mockFetch({ status: 'ok' })
    render(<App />, { initialEntries: ['/missing'] })
    expect(await screen.findByText(/page not found/i)).toBeInTheDocument()
  })


  it('is accessible', async () => {
    mockFetch({ status: 'ok' })
    const { container } = render(<App />)
    await waitFor(() => screen.getByText(/welcome to artofficial intelligence/i))
    expect(await axe(container)).toHaveNoViolations()
  })
})
