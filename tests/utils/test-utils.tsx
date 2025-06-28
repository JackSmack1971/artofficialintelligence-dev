import type { FC, PropsWithChildren, ReactElement } from 'react'

import { MemoryRouter } from 'react-router-dom'

import {
  type RenderOptions,
  render as rtlRender,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'

interface WrapperProps {
  initialEntries?: string[]
}

const Providers: FC<PropsWithChildren<WrapperProps>> = ({
  children,
  initialEntries
}) => (
  <HelmetProvider context={{}}>
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  </HelmetProvider>
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
