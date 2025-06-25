import { afterEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

afterEach(cleanup)

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('shows loading text when loading', () => {
    render(<Button loading>Action</Button>)
    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument()
  })
})
