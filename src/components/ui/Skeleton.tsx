import React from 'react'

import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of skeleton blocks to render */
  count?: number
}

/**
 * Generic loading skeleton.
 * Renders animated placeholder blocks.
 */
const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  className,
  ...props
}) => (
  <div data-testid="skeleton-wrapper" {...props}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        data-testid="skeleton-block"
        className={cn(
          'mb-2 h-4 w-full animate-pulse rounded-md bg-gray-200 last:mb-0 dark:bg-gray-700',
          className
        )}
      />
    ))}
  </div>
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
