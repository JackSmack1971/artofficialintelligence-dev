import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import CspNonceProvider, { useCspNonce } from '../CspNonceProvider'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CspNonceProvider nonce="test-nonce">{children}</CspNonceProvider>
)

describe('CspNonceProvider', () => {
  it('provides nonce via context', () => {
    const { result } = renderHook(() => useCspNonce(), { wrapper })
    expect(result.current).toBe('test-nonce')
  })

  it('throws when nonce missing', () => {
    const { result } = renderHook(() => {
      try {
        return useCspNonce()
      } catch (e) {
        return e
      }
    })
    expect(result.current).toBeInstanceOf(Error)
  })
})
