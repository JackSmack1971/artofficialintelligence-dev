import { StrictMode, Suspense } from 'react'

import ReactDOM from 'react-dom/client'

import { BrowserRouter } from 'react-router-dom'

import { HelmetProvider } from 'react-helmet-async'

import ErrorBoundary from '@/components/ErrorBoundary'
import LoadingSpinner from '@/components/LoadingSpinner'
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <ServiceWorkerProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <App />
            </Suspense>
          </ServiceWorkerProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
)
