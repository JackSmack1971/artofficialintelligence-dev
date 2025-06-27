import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Home from '@/pages/Home'

const mockArticles = [
  { id: '1', title: 'One', excerpt: 'Ex', author: 'A', image: 'img' }
]

const mockFetch = () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      if (url === '/api/health') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'ok' })
        })
      }
      return Promise.resolve({ ok: true, json: async () => mockArticles })
    })
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Home page', () => {
  it('displays hero and articles', async () => {
    mockFetch()
    render(<Home />)
    expect(
      screen.getByRole('heading', { name: /artofficial intelligence/i })
    ).toBeInTheDocument()
    expect(await screen.findByText('One')).toBeInTheDocument()
  })
})
