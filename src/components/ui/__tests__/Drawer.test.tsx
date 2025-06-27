import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Drawer } from '../Drawer'

const renderDrawer = (open = true, onClose = vi.fn()) =>
  render(
    <Drawer open={open} onClose={onClose}>
      <div>content</div>
    </Drawer>
  )

describe('Drawer', () => {
  it('renders when open', () => {
    renderDrawer()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('calls onClose on overlay click', async () => {
    const onClose = vi.fn()
    renderDrawer(true, onClose)
    await userEvent.click(screen.getByTestId('drawer-overlay'))
    expect(onClose).toHaveBeenCalled()
  })

  it('closes on Escape key', async () => {
    const onClose = vi.fn()
    renderDrawer(true, onClose)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
