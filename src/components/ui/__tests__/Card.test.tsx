import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Card, CardContent, CardHeader, CardTitle } from '../Card'

describe('Card component', () => {
  it('applies variant classes', () => {
    const { container } = render(
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('is focusable when interactive', async () => {
    const onClick = userEvent.setup()
    const handle = vi.fn()
    render(
      <Card interactive onClick={handle}>
        Clickable
      </Card>
    )
    const card = screen.getByRole('button')
    await onClick.click(card)
    expect(handle).toHaveBeenCalled()
  })
})
