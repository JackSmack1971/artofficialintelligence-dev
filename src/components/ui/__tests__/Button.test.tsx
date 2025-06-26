import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '../Button'

describe('Button component', () => {
  it.each([
    ['default', 'default', 'bg-ai-primary'],
    ['ghost', 'sm', 'bg-transparent']
  ] as const)('renders %s variant and %s size', (variant, size, className) => {
    render(
      <Button variant={variant} size={size}>
        Test
      </Button>
    )
    const btn = screen.getByRole('button', { name: /test/i })
    expect(btn).toHaveClass(className)
  })

  it('forwards ref and handles clicks', async () => {
    const onClick = vi.fn()
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Button ref={ref} onClick={onClick}>
        Click
      </Button>
    )
    await userEvent.click(screen.getByRole('button', { name: /click/i }))
    expect(onClick).toHaveBeenCalled()
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('prevents interaction when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    )
    const btn = screen.getByRole('button', { name: /disabled/i })
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('merges custom className', () => {
    render(<Button className="mx-2">Class</Button>)
    expect(screen.getByRole('button')).toHaveClass('mx-2')
  })
})
