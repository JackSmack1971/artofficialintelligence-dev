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
  url: string,
  { timeout = 5000, retries = 3, ...options }: FetchOptions = {}
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(id)
      if (!response.ok) {
        throw new ApiError(
          `Request failed with status ${response.status}`,
          response.status
        )
      }
      return response
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
