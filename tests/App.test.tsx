import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router-dom'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import App from '@/App'

afterEach(cleanup)

describe('App routing', () => {
  it('renders home page', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(
      await screen.findByRole('heading', { name: /artofficial intelligence/i })
    ).toBeInTheDocument()
  })

  it('navigates to articles page', async () => {
    render(
      <MemoryRouter initialEntries={['/articles']}>
        <App />
      </MemoryRouter>
    )
    expect(
      await screen.findByRole('heading', { name: /articles/i })
    ).toBeInTheDocument()
  })

  it('shows not found page for unknown route', async () => {
    render(
      <MemoryRouter initialEntries={['/missing']}>
        <App />
      </MemoryRouter>
    )
    expect(await screen.findByText(/Page Not Found/)).toBeInTheDocument()
  })
})
