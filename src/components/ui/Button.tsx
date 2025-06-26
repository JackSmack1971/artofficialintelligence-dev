import React, { forwardRef } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-ai-primary text-white hover:bg-ai-primary/90',
        ghost: 'bg-transparent text-ai-primary hover:bg-ai-primary/10'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading = false, disabled, children, ...props },
    ref
  ) => {
    const isDisabled = disabled || loading
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
