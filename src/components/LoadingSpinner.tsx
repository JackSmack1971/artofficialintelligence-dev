import React from 'react'

interface LoadingSpinnerProps {
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Loading...'
}) => (
  <div role="status" aria-live="polite" className="flex justify-center p-4">
    <svg
      className="w-8 h-8 animate-spin text-ai-primary"
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
    <span className="sr-only">{text}</span>
  </div>
)

export default LoadingSpinner
