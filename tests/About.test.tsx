import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from './utils/test-utils'
import { describe, expect, it } from 'vitest'

import About from '@/pages/About'

describe('About page', () => {
  it('renders site identity content', () => {
    render(<About />)
    expect(
      screen.getByRole('heading', { name: /about artofficial intelligence/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/trusted source for ai creativity/i)
    ).toBeInTheDocument()
  })

  it('sets page title', async () => {
    render(<About />)
    await waitFor(() =>
      expect(document.title).toBe('About - ArtOfficial Intelligence')
    )
  })
})
