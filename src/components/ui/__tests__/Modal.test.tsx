import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from '../Modal'

describe('Modal component', () => {
  const renderModal = (open = true, onClose = vi.fn()) =>
    render(
      <Modal open={open} onClose={onClose} aria-label="dialog">
        <div>Content</div>
      </Modal>
    )

  it('renders when open', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('calls onClose on overlay click', async () => {
    const onClose = vi.fn()
    renderModal(true, onClose)
    await userEvent.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalled()
  })

  it('closes on Escape key', async () => {
    const onClose = vi.fn()
    renderModal(true, onClose)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
