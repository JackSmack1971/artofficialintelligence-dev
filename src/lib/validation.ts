import { z } from 'zod'

import type { NavigationItem } from '@/types/navigation'

export const navigationItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().regex(/^\/[\w-]*$/)
})

const navigationSchema = z.array(navigationItemSchema)

export function validateNavigation(items: unknown): NavigationItem[] {
  return navigationSchema.parse(items)
}

