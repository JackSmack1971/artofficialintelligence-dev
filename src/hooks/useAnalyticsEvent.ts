import { useCallback } from 'react'

export interface AnalyticsOptions {
  props?: Record<string, unknown>
  callback?: () => void
}

export class AnalyticsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AnalyticsError'
  }
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: AnalyticsOptions) => void
  }
}

export function useAnalyticsEvent() {
  const safeCall = useCallback(
    (eventName: string, options?: AnalyticsOptions) => {
      try {
        window.plausible?.(eventName, options)
      } catch (error) {
        throw new AnalyticsError(
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
    },
    []
  )

  const trackPageview = useCallback(() => safeCall('pageview'), [safeCall])

  const trackEvent = useCallback(
    (eventName: string, options?: AnalyticsOptions) =>
      safeCall(eventName, options),
    [safeCall]
  )

  return { trackPageview, trackEvent }
}
