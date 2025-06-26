import type { FC, ReactElement } from 'react'

import { MemoryRouter } from 'react-router-dom'

import { render as rtlRender, screen, waitFor, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

interface WrapperProps {
  initialEntries?: string[]
}

const Providers: FC<WrapperProps> = ({ children, initialEntries }) => (
  <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
)

export const customRender = (
  ui: ReactElement,
  { initialEntries = ['/'], ...options }: WrapperProps & RenderOptions = {}
) =>
  rtlRender(ui, {
    wrapper: (props) => (
      <Providers initialEntries={initialEntries} {...props} />
    ),
    ...options
  })
export { screen, waitFor }
export { customRender as render, userEvent }

