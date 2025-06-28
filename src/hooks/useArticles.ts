import { useEffect, useState } from 'react'

import { ApiError, fetchWithRetry } from '@/lib/api'
import { ArticleSchema, type Article, type LoadingState } from '@/types/article'

interface Options {
  url?: string
  timeout?: number
  retries?: number
}

export function useArticles({
  url = '/articles.json',
  timeout = 5000,
  retries = 3
}: Options = {}): LoadingState<Article[]> {
  const [state, setState] = useState<LoadingState<Article[]>>({ data: [], loading: true })

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const res = await fetchWithRetry(url, { timeout, retries })
        const data = ArticleSchema.array().parse(await res.json())
        if (!cancelled) setState({ data, loading: false })
      } catch (e) {
        const err = e instanceof ApiError ? e : new ApiError(e instanceof Error ? e.message : 'Unknown error')
        if (!cancelled) setState({ data: [], loading: false, error: err.message })
      }
    }
    void fetchData()
    return () => {
      cancelled = true
    }
  }, [url, timeout, retries])

  return state
}
