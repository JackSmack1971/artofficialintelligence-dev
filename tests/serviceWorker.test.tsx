import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ServiceWorkerProvider from '@/components/ServiceWorkerProvider'

const noop = () => {}

describe('ServiceWorkerProvider', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    delete (navigator as unknown as Record<string, unknown>).serviceWorker
  })
  it('registers service worker', async () => {
    const register = vi.fn().mockResolvedValue({
      addEventListener: noop,
      unregister: vi.fn().mockResolvedValue(true)
    })
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: { register, controller: {} },
      configurable: true
    })

    render(
      <ServiceWorkerProvider>
        <div>child</div>
      </ServiceWorkerProvider>
    )
    expect(register).toHaveBeenCalledWith('/sw.js')
  })

  it('shows update notice when update found', async () => {
    let updateCb: () => void = noop
    const worker: Record<string, unknown> = {}
    const register = vi.fn().mockResolvedValue({
      addEventListener: (_: string, cb: () => void) => {
        updateCb = cb
      },
      installing: worker,
      unregister: vi.fn().mockResolvedValue(true)
    })
    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: { register, controller: {} },
      configurable: true
    })

    render(
      <ServiceWorkerProvider>
        <div>child</div>
      </ServiceWorkerProvider>
    )

    const stateHandlers: Record<string, () => void> = {}
    worker.addEventListener = vi.fn((_: string, cb: () => void) => {
      stateHandlers.change = cb
    })

    updateCb()
    worker.state = 'installed'
    stateHandlers.change?.()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})
