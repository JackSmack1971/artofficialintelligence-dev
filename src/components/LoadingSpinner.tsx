import React from 'react'

import { cn } from '@/lib/utils'

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Text label announced by screen readers */
  label?: string
  /** Spinner size */
  size?: 'sm' | 'default' | 'lg'
}

const sizeClasses: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'h-4 w-4',
  default: 'h-8 w-8',
  lg: 'h-12 w-12'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(
  ({ label = 'Loading...', size = 'default', className, ...props }) => (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex justify-center p-4', className)}
      {...props}
    >
      <svg
        className={cn('animate-spin text-ai-primary', sizeClasses[size])}
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
          fill="currentColor"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  )
)

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner
