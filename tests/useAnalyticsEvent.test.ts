import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AnalyticsError, useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

describe('useAnalyticsEvent', () => {
  it('logs pageview', () => {
    const plausible = vi.fn()
    Object.defineProperty(window, 'plausible', {
      value: plausible,
      writable: true
    })

    const { result } = renderHook(() => useAnalyticsEvent())

    result.current.trackPageview()

    expect(plausible).toHaveBeenCalledWith('pageview', undefined)
  })

  it('logs custom event', () => {
    const plausible = vi.fn()
    Object.defineProperty(window, 'plausible', {
      value: plausible,
      writable: true
    })

    const { result } = renderHook(() => useAnalyticsEvent())

    result.current.trackEvent('Signup')

    expect(plausible).toHaveBeenCalledWith('Signup', undefined)
  })

  it('throws AnalyticsError when call fails', () => {
    const plausible = vi.fn(() => {
      throw new Error('fail')
    })
    Object.defineProperty(window, 'plausible', {
      value: plausible,
      writable: true
    })

    const { result } = renderHook(() => useAnalyticsEvent())

    expect(() => result.current.trackEvent('Test')).toThrow(AnalyticsError)
  })
})
