import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement, FC, ReactNode } from 'react'

interface WrapperProps {
  initialEntries?: string[]
}

const Providers: FC<WrapperProps> = ({ children, initialEntries }) => (
  <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
)

export const customRender = (
  ui: ReactElement,
  { initialEntries = ['/'], ...options }: WrapperProps & RenderOptions = {}
) => render(ui, { wrapper: (props) => <Providers initialEntries={initialEntries} {...props} />, ...options })

export * from '@testing-library/react'
export { customRender as render, userEvent }
