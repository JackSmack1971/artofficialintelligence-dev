import { afterEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
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
      await screen.findByText(/Welcome to ArtOfficial Intelligence/)
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
