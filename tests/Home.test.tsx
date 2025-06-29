import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Home from '@/pages/Home'

import { render, screen, waitFor } from './utils/test-utils'

const mockArticles = [
  {
    id: '1',
    title: 'One',
    excerpt: 'Ex',
    author: { id: 'a1', name: 'A', avatar: 'a.png' },
    image: 'img'
  }
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

  it('sets page title', async () => {
    mockFetch()
    render(<Home />)
    await screen.findByRole('heading', { name: /artofficial intelligence/i })
    await waitFor(() =>
      expect(document.title).toBe('ArtOfficial Intelligence')
    )
  })
})
