import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import App from '@/App'

import { render, screen } from './utils/test-utils'

afterEach(cleanup)

describe('App routing', () => {
  it('renders home page', async () => {
    render(<App />, { initialEntries: ['/'] })
    expect(
      await screen.findByRole('heading', { name: /artofficial intelligence/i })
    ).toBeInTheDocument()
  })

  it('navigates to articles page', async () => {
    render(<App />, { initialEntries: ['/articles'] })
    expect(
      await screen.findByRole('heading', { name: /articles/i })
    ).toBeInTheDocument()
  })

  it('shows not found page for unknown route', async () => {
    render(<App />, { initialEntries: ['/missing'] })
    expect(await screen.findByText(/Page Not Found/)).toBeInTheDocument()
  })
})
