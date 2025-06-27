import React, { forwardRef, useId } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const inputVariants = cva(
  [
    'flex w-full rounded-md border bg-transparent px-3 py-2 text-sm',
    'placeholder:text-gray-500 dark:placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-ai-primary focus:border-transparent',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-all duration-200'
  ],
  {
    variants: {
      variant: {
        default: [
          'border-gray-300 dark:border-gray-600',
          'hover:border-gray-400 dark:hover:border-gray-500'
        ],
        error: [
          'border-red-500 dark:border-red-400',
          'focus:ring-red-500 focus:border-red-500',
          'text-red-900 dark:text-red-100'
        ],
        success: [
          'border-green-500 dark:border-green-400',
          'focus:ring-green-500 focus:border-green-500'
        ]
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showCharCount?: boolean
  maxLength?: number
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      showCharCount = false,
      maxLength,
      id,
      value,
      required,
      ...props
    },
    ref
  ) => {
    const autoId = useId()
    const inputId = id || autoId
    const hasError = Boolean(error)
    const actualVariant = hasError ? 'error' : variant
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="Required field">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm" aria-hidden="true">
                {leftIcon}
              </span>
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputVariants({ variant: actualVariant, size }),
              { 'pl-10': leftIcon, 'pr-10': rightIcon },
              className
            )}
            aria-invalid={hasError}
            aria-describedby={cn(
              hasError && `${inputId}-error`,
              helperText && `${inputId}-helper`,
              showCharCount && maxLength && `${inputId}-char-count`
            )}
            maxLength={maxLength}
            value={value}
            required={required}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm" aria-hidden="true">
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-start min-h-[1.25rem]">
          <div className="flex-1">
            {error && (
              <p
                id={`${inputId}-error`}
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}
            {helperText && !error && (
              <p
                id={`${inputId}-helper`}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {helperText}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <span
              id={`${inputId}-char-count`}
              className={cn(
                'text-xs ml-2 shrink-0',
                currentLength > maxLength * 0.9
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
              aria-label={`${currentLength} of ${maxLength} characters used`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
