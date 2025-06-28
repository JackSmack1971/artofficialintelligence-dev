import React, { useEffect } from 'react'

import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'

import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useRouteFocus } from '@/hooks/useRouteFocus'

function TestComponent() {
  useRouteFocus()
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/about')
  }, [navigate])
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main id="main-content" tabIndex={-1}>
            Home
          </main>
        }
      />
      <Route
        path="/about"
        element={
          <main id="main-content" tabIndex={-1}>
            About
          </main>
        }
      />
    </Routes>
  )
}

describe('useRouteFocus', () => {
  it('focuses main element on route change', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TestComponent />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByText('About'))
    })
  })
})
