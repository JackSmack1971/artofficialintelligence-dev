import { z } from 'zod'

export interface Author {
  id: string
  name: string
  avatar: string
}

export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  avatar: z.string().url()
})
export type AuthorFromSchema = z.infer<typeof AuthorSchema>

export interface Article {
  id: string
  title: string
  excerpt: string
  author: Author
  image: string
}

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  author: AuthorSchema,
  image: z.string().url()
})
export type ArticleFromSchema = z.infer<typeof ArticleSchema>

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional()
  })
export type ApiResponseFromSchema<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof ApiResponseSchema<T>>
>

export interface LoadingState<T> {
  data: T
  loading: boolean
  error?: string
}
