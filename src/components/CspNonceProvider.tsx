import React, { createContext, useContext } from 'react'

interface Props {
  nonce: string
  children: React.ReactNode
}

class CspNonceError extends Error {
  constructor() {
    super('CSP nonce not available')
    this.name = 'CspNonceError'
  }
}

const CspNonceContext = createContext<string | undefined>(undefined)

export const useCspNonce = (): string => {
  const nonce = useContext(CspNonceContext)
  if (!nonce) throw new CspNonceError()
  return nonce
}

export const CspNonceProvider: React.FC<Props> = ({ nonce, children }) => (
  <CspNonceContext.Provider value={nonce}>{children}</CspNonceContext.Provider>
)

export default CspNonceProvider
