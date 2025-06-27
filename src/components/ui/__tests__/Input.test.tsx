import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Input } from '../Input'

describe('Input component', () => {
  it('renders label and helper text', () => {
    render(<Input label="Email" helperText="info" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByText('info')).toBeInTheDocument()
  })

  it('displays error state', () => {
    render(<Input label="Name" error="Required" />)
    const input = screen.getByLabelText(/name/i)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('shows character count', () => {
    render(
      <Input
        label="Bio"
        showCharCount
        maxLength={10}
        value="hello"
        onChange={() => {}}
      />
    )
    expect(screen.getByText('5/10')).toBeInTheDocument()
  })
})
