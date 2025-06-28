import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
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

  it('traps focus and restores to toggle button', async () => {
    const Example = () => {
      const [open, setOpen] = React.useState(false)
      const btnRef = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <button ref={btnRef} onClick={() => setOpen(true)}>
            toggle
          </button>
          <Drawer open={open} onClose={() => setOpen(false)} toggleRef={btnRef}>
            <button>inside</button>
          </Drawer>
        </>
      )
    }

    render(<Example />)
    const user = userEvent.setup()
    const toggle = screen.getByText('toggle')
    await user.click(toggle)
    const dialog = screen.getByRole('dialog')
    const inside = screen.getByText('inside')
    inside.focus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(inside).toHaveFocus()
    fireEvent.keyDown(dialog, { key: 'Escape' })
  })
})
