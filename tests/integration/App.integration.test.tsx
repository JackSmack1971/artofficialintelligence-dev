import { axe } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'

import ErrorBoundary from '@/components/ErrorBoundary'

import App from '@/App'

import { render, screen, userEvent, waitFor } from '../utils/test-utils'

const mockFetch = () => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const base = process.env.VITE_API_URL
      if (url === `${base}/api/health`) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'ok' })
        })
      }
      if (url === `${base}/articles.json`) {
        return Promise.resolve({ ok: true, json: async () => [] })
      }
      return Promise.resolve({ ok: true, json: async () => ({}) })
    })
  )
}

describe('App integration', () => {
  it('renders home page and navigates', async () => {
    mockFetch()
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )
    expect(
      await screen.findByRole('heading', { name: /artofficial intelligence/i })
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('menuitem', { name: /about/i }))
    expect(
      await screen.findByText(/about artofficial intelligence/i)
    ).toBeInTheDocument()
  })

  it('navigates with keyboard without page reload', async () => {
    mockFetch()
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )
    await screen.findByRole('heading', { name: /artofficial intelligence/i })
    const link = screen.getByRole('menuitem', { name: /about/i })
    link.focus()
    await userEvent.keyboard(' ')
    expect(
      await screen.findByText(/about artofficial intelligence/i)
    ).toBeInTheDocument()
  })

  it('shows not found on unknown route', async () => {
    mockFetch()
    render(<App />, { initialEntries: ['/missing'] })
    expect(await screen.findByText(/page not found/i)).toBeInTheDocument()
  })

  it('is accessible', async () => {
    mockFetch()
    const { container } = render(<App />)
    await waitFor(() =>
      screen.getByRole('heading', { name: /artofficial intelligence/i })
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
