import '@testing-library/jest-dom/vitest'
import { MemoryRouter } from 'react-router-dom'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Header } from '@/components/layout/Header'

import { NAVIGATION } from '@/data/navigation'

afterEach(cleanup)

describe('Header', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <Header navigation={NAVIGATION} />
      </MemoryRouter>
    )
    expect(screen.getByRole('menuitem', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /about/i })).toHaveAttribute('aria-current', 'page')
  })
})
