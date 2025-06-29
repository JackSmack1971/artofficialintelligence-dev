import { z } from 'zod'

const redisUrlSchema = z.string().regex(/^redis(?:s)?:\/\/.+$/, 'Invalid Redis URL')

const corsOriginSchema = z
  .string()
  .nonempty()
  .transform((val) => val.split(',').map((s) => s.trim()))
  .superRefine((list, ctx) => {
    for (const url of list) {
      try {
        new URL(url)
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid URL', path: [] })
      }
    }
  })

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  REDIS_URL: redisUrlSchema,
  CORS_ORIGIN: corsOriginSchema,
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters')
})

export type Env = z.infer<typeof baseSchema>

export function validateEnv(raw: Record<string, unknown> = process.env): Env {
  const parsed = baseSchema.safeParse(raw)
  if (!parsed.success) {
    const issues = parsed.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ')
    throw new Error(`Invalid environment variables: ${issues}`)
  }

  if (
    parsed.data.NODE_ENV === 'production' &&
    parsed.data.CORS_ORIGIN.some((u) => !u.startsWith('https://'))
  ) {
    throw new Error('CORS_ORIGIN must use https URLs in production')
  }

  return parsed.data
}

export let env: Env

export function loadEnv(raw: Record<string, unknown> = process.env): Env {
  env = validateEnv(raw)
  return env
}
