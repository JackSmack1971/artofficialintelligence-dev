import { MemoryRouter } from 'react-router-dom'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { NAVIGATION } from '@/data/navigation'

import { Header } from '../Header'

const renderHeader = (initial: string[] = ['/']) =>
  render(
    <MemoryRouter initialEntries={initial}>
      <Header navigation={NAVIGATION} />
    </MemoryRouter>
  )

describe('Header component', () => {
  it('renders navigation with active item', () => {
    renderHeader(['/about'])
    const about = screen.getByRole('menuitem', { name: /about/i })
    expect(about).toHaveAttribute('aria-current', 'page')
  })

  it('has accessible navigation structure', () => {
    renderHeader()
    const banner = screen.getByRole('banner')
    const nav = within(banner).getByRole('navigation')
    expect(within(nav).getAllByRole('menuitem')).toHaveLength(NAVIGATION.length)
  })

  it('includes responsive menu button', () => {
    renderHeader()
    const button = screen.getByRole('button', { name: /open navigation menu/i })
    expect(button).toHaveClass('md:hidden')
  })

  it('toggles menu with keyboard', async () => {
    renderHeader()
    const button = screen.getByRole('button', { name: /open navigation menu/i })
    button.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await userEvent.keyboard(' ')
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
