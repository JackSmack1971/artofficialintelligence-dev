import React, { useEffect, useState } from 'react'

interface Props {
  children: React.ReactNode
}

class ServiceWorkerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ServiceWorkerError'
  }
}

const registerServiceWorker = async (
  onUpdate: () => void
): Promise<ServiceWorkerRegistration | undefined> => {
  if (!('serviceWorker' in navigator)) return undefined
  try {
    const r = await navigator.serviceWorker.register('/sw.js')
    r.addEventListener('updatefound', () => {
      const worker = r.installing
      if (!worker) return
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller)
          onUpdate()
      })
    })
    return r
  } catch {
    console.error(new ServiceWorkerError('Registration failed'))
    return undefined
  }
}

export const ServiceWorkerProvider: React.FC<Props> = ({ children }) => {
  const [update, setUpdate] = useState(false)
  useEffect(() => {
    let reg: ServiceWorkerRegistration | undefined
    void registerServiceWorker(() => setUpdate(true)).then((r) => {
      reg = r
    })
    return () => {
      reg?.unregister().catch(() => {})
    }
  }, [])
  const reload = (): void => {
    navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' })
    window.location.reload()
  }
  const notice = update ? (
    <div role="alert" className="fixed bottom-4 right-4 bg-ai-primary text-white p-4 rounded">
      <button onClick={reload} className="underline">Update available - reload</button>
    </div>
  ) : null
  return (
    <>
      {children}
      {notice}
    </>
  )
}

export default ServiceWorkerProvider
