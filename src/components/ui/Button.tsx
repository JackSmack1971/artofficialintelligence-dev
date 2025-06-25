import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium',
    'transition-all duration-200 focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ai-primary',
    'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-ai-primary text-white shadow-sm',
          'hover:bg-ai-primary/90 active:bg-ai-primary/80'
        ],
        ghost: [
          'bg-transparent text-ai-primary',
          'hover:bg-ai-primary/10 active:bg-ai-primary/20'
        ]
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base'
      },
      fullWidth: {
        true: 'w-full'
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
  ({ className, variant, size, fullWidth, disabled, loading = false, children, ...props }, ref) => {
    const isDisabled = disabled || loading
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
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
