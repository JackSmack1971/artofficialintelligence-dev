import { ApiResponseSchema, type Article, ArticleSchema } from '@/types/article'

export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number
  retries?: number
}

export async function fetchWithRetry(
  path: string,
  { timeout = 5000, retries = 3, ...options }: FetchOptions = {}
): Promise<Response> {
  const base = import.meta.env?.VITE_API_URL ?? process.env.VITE_API_URL
  const url = new URL(path, base).toString()
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(id)
      if (!res.ok) {
        throw new ApiError(
          `Request failed with status ${res.status}`,
          res.status
        )
      }
      return res
    } catch (error) {
      clearTimeout(id)
      if (attempt === retries) {
        if (error instanceof ApiError) throw error
        if ((error as Error).name === 'AbortError') {
          throw new ApiError('Request timed out')
        }
        throw new ApiError((error as Error).message)
      }
    }
  }
  throw new ApiError('Unknown error')
}

interface ArticleOptions {
  timeout?: number
  retries?: number
}

export async function getArticles({
  timeout = 5000,
  retries = 3
}: ArticleOptions = {}): Promise<Article[]> {
  try {
    const res = await fetchWithRetry('/articles', { timeout, retries })
    const schema = ApiResponseSchema(ArticleSchema.array())
    const parsed = schema.parse(await res.json())
    if (!parsed.success || !parsed.data) {
      throw new ApiError(parsed.error ?? 'Invalid response')
    }
    return parsed.data
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error')
  }
}
