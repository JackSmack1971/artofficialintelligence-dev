import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught', {
      timestamp: new Date().toISOString(),
      message: error.message,
      componentStack: errorInfo.componentStack
    })
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  private renderFallback() {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-ai-primary text-white text-xl font-bold">
              AI
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our systems ran into an issue. Try again or refresh the page.
          </p>
          <div className="space-y-3">
            <Button onClick={this.resetError} className="w-full">
              Try Again
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return (
          <Fallback error={this.state.error!} resetError={this.resetError} />
        )
      }

      return this.renderFallback()
    }

    return this.props.children
  }
}

export default ErrorBoundary
