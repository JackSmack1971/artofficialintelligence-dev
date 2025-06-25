# UI Components - Design System Foundation

Build a comprehensive, accessible design system with strict TypeScript and performance optimization.

## 🎯 Design System Principles

### Consistency & Scalability
- **Design Tokens**: Centralized color, spacing, typography system
- **Component Variants**: Systematic approach to component variations
- **Composition**: Build complex components from simple primitives
- **Theming**: Support for light/dark modes with CSS variables
- **Responsive**: Mobile-first, adaptive design patterns

### Performance & Developer Experience
- **Tree Shaking**: Optimized exports for minimal bundle impact
- **Type Safety**: Comprehensive TypeScript interfaces
- **Documentation**: Self-documenting components with JSDoc
- **Testing**: Unit tested with accessibility assertions
- **Storybook Ready**: Isolated component development

## 📦 Core Design System Components

### Button.tsx (Production-Grade)
```typescript
import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles - accessibility and UX focused
  [
    'inline-flex items-center justify-center rounded-md text-sm font-medium',
    'transition-all duration-200 focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ai-primary',
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
    'active:scale-[0.98] relative overflow-hidden'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-ai-primary text-white shadow-sm',
          'hover:bg-ai-primary/90 hover:shadow-md',
          'active:bg-ai-primary/80'
        ],
        destructive: [
          'bg-red-500 text-white shadow-sm',
          'hover:bg-red-600 hover:shadow-md',
          'active:bg-red-700'
        ],
        outline: [
          'border border-ai-primary text-ai-primary bg-transparent',
          'hover:bg-ai-primary hover:text-white hover:shadow-sm',
          'active:bg-ai-primary/90'
        ],
        secondary: [
          'bg-gray-100 text-gray-900 shadow-sm',
          'hover:bg-gray-200 hover:shadow-md',
          'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
        ],
        ghost: [
          'bg-transparent text-ai-primary',
          'hover:bg-ai-primary/10 hover:text-ai-primary',
          'active:bg-ai-primary/20'
        ],
        link: [
          'bg-transparent text-ai-primary underline-offset-4',
          'hover:underline hover:text-ai-primary/80',
          'active:text-ai-primary/70'
        ]
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10 p-0'
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
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Primary button component for user interactions
 * 
 * @example
 * <Button variant="default" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    disabled, 
    loading = false,
    loadingText = 'Loading...',
    leftIcon,
    rightIcon,
    children, 
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        data-loading={loading}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
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
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        <span>
          {loading ? loadingText : children}
        </span>
        
        {!loading && rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
```

### Input.tsx (Form Foundation)
```typescript
import React, { forwardRef, useState, useId } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
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

/**
 * Input component with built-in validation and accessibility
 * 
 * @example
 * <Input 
 *   label="Email Address"
 *   type="email"
 *   error={errors.email}
 *   helperText="We'll never share your email"
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
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
  }, ref) => {
    const autoId = useId()
    const inputId = id || autoId
    const hasError = Boolean(error)
    const actualVariant = hasError ? 'error' : variant
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="space-y-1">
        {/* Label */}
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
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm" aria-hidden="true">
                {leftIcon}
              </span>
            </div>
          )}
          
          {/* Input Field */}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputVariants({ variant: actualVariant, size }),
              {
                'pl-10': leftIcon,
                'pr-10': rightIcon
              },
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
          
          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm" aria-hidden="true">
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        
        {/* Footer: Error, Helper Text, Character Count */}
        <div className="flex justify-between items-start min-h-[1.25rem]">
          <div className="flex-1">
            {/* Error Message */}
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
            
            {/* Helper Text */}
            {helperText && !error && (
              <p 
                id={`${inputId}-helper`}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {helperText}
              </p>
            )}
          </div>
          
          {/* Character Count */}
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
```

### Card.tsx (Layout Foundation)
```typescript
import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  [
    'rounded-lg border bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-white transition-all duration-200'
  ],
  {
    variants: {
      variant: {
        default: 'border-gray-200 dark:border-gray-700 shadow-sm',
        elevated: 'border-gray-200 dark:border-gray-700 shadow-lg',
        outlined: 'border-2 border-ai-primary/20 shadow-none',
        ghost: 'border-transparent shadow-none bg-transparent'
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-6',
        lg: 'p-8'
      },
      interactive: {
        true: [
          'cursor-pointer hover:shadow-md transition-shadow',
          'focus:outline-none focus:ring-2 focus:ring-ai-primary focus:ring-offset-2'
        ]
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default'
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

/**
 * Card component for content containers
 * 
 * @example
 * <Card variant="elevated" interactive>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     Card content goes here
 *   </CardContent>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive, className }))}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...props}
    />
  )
)

Card.displayName = 'Card'

// Compound components for consistent card structure
export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
>(({ className, as: Comp = 'h3', ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'
```

### Badge.tsx (Status & Labels)
```typescript
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-ai-primary focus:ring-offset-2'
  ],
  {
    variants: {
      variant: {
        default: 'border-transparent bg-ai-primary text-white',
        secondary: 'border-transparent bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
        destructive: 'border-transparent bg-red-500 text-white',
        success: 'border-transparent bg-green-500 text-white',
        warning: 'border-transparent bg-yellow-500 text-white',
        outline: 'border-ai-primary text-ai-primary bg-transparent',
        ghost: 'border-transparent bg-ai-primary/10 text-ai-primary'
      },
      size: {
        xs: 'px-2 py-0.5 text-xs',
        sm: 'px-2.5 py-0.5 text-xs',
        default: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

/**
 * Badge component for status indicators and labels
 * 
 * @example
 * <Badge variant="success" size="sm">
 *   Published
 * </Badge>
 */
export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant, 
  size,
  icon,
  children,
  ...props 
}) => {
  return (
    <div 
      className={cn(badgeVariants({ variant, size }), className)} 
      {...props}
    >
      {icon && (
        <span className="mr-1" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </div>
  )
}

Badge.displayName = 'Badge'
```

### LoadingSpinner.tsx (Loading States)
```typescript
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-r-transparent',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
      },
      variant: {
        default: 'text-ai-primary',
        secondary: 'text-gray-500',
        white: 'text-white'
      }
    },
    defaultVariants: {
      size: 'default',
      variant: 'default'
    }
  }
)

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
  showLabel?: boolean
}

/**
 * Loading spinner with accessibility support
 * 
 * @example
 * <LoadingSpinner size="lg" label="Loading articles..." showLabel />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className,
  size,
  variant,
  label = 'Loading...',
  showLabel = false,
  ...props 
}) => {
  return (
    <div 
      className={cn('flex items-center justify-center', className)}
      role="status"
      aria-live="polite"
      {...props}
    >
      <div 
        className={cn(spinnerVariants({ size, variant }))}
        aria-hidden="true"
      />
      {showLabel ? (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  )
}

LoadingSpinner.displayName = 'LoadingSpinner'

// AI-themed loading spinner variant
export const AILoadingSpinner: React.FC<{ 
  message?: string 
  className?: string 
}> = ({ 
  message = 'Processing with AI...', 
  className 
}) => (
  <div className={cn('flex flex-col items-center gap-4 p-8', className)}>
    <div className="relative">
      {/* Outer ring */}
      <div className="w-12 h-12 border-4 border-ai-primary/20 rounded-full animate-spin border-t-ai-primary" />
      {/* Inner ring */}
      <div className="absolute inset-2 border-2 border-ai-secondary/20 rounded-full animate-spin-reverse border-r-ai-secondary" />
      {/* Center dot */}
      <div className="absolute inset-4 bg-ai-accent rounded-full animate-pulse" />
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse text-center">
      🤖 {message}
    </p>
  </div>
)
```

## 🎭 Design System Guidelines

### Design Token Integration
```typescript
// tailwind.config.ts - Design tokens
export default {
  theme: {
    extend: {
      colors: {
        'ai-primary': 'hsl(var(--ai-primary))',
        'ai-secondary': 'hsl(var(--ai-secondary))',
        'ai-accent': 'hsl(var(--ai-accent))',
        'ai-surface': 'hsl(var(--ai-surface))',
        'ai-background': 'hsl(var(--ai-background))'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'spin-reverse': 'spin 1s linear infinite reverse',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    }
  }
} satisfies Config

// CSS Variables for theming
:root {
  --ai-primary: 220 100% 60%;
  --ai-secondary: 270 100% 70%;
  --ai-accent: 145 100% 60%;
  --ai-surface: 220 15% 95%;
  --ai-background: 0 0% 100%;
}

[data-theme="dark"] {
  --ai-surface: 220 15% 10%;
  --ai-background: 220 20% 5%;
}
```

### Component Composition Patterns
```typescript
// Compound component pattern
const Modal = {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter
}

// Usage
<Modal.Root>
  <Modal.Trigger asChild>
    <Button>Open Modal</Button>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Modal Title</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Modal content goes here
    </Modal.Body>
    <Modal.Footer>
      <Button>Close</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal.Root>
```

### Accessibility Testing
```typescript
// Accessibility test helpers
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Button variant="default">Click me</Button>
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('supports screen reader navigation', () => {
    render(<Button aria-label="Submit form">Submit</Button>)
    
    const button = screen.getByRole('button', { name: /submit form/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAccessibleName('Submit form')
  })
})
```

### Performance Optimization
```typescript
// Bundle optimization
export { Button } from './Button'
export { Input } from './Input'
export { Card, CardHeader, CardContent } from './Card'
// Individual exports for tree shaking

// Lazy loading for heavy components
const DataTable = React.lazy(() => import('./DataTable'))
const Chart = React.lazy(() => import('./Chart'))

// Performance monitoring
const useComponentPerformance = (componentName: string) => {
  useEffect(() => {
    const start = performance.now()
    return () => {
      const end = performance.now()
      console.log(`${componentName} render time: ${end - start}ms`)
    }
  }, [componentName])
}
```
```
