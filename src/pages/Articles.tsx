import React, { useEffect, useState } from 'react'

import ArticleCard from '@/components/features/ArticleCard'
import LoadingSpinner from '@/components/LoadingSpinner'

import { fetchWithRetry } from '@/lib/api'
import type { Article } from '@/types/article'

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchWithRetry('/articles.json')
        setArticles((await res.json()) as Article[])
      } catch {
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4">Articles</h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <li key={article.id}>
            <ArticleCard {...article} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Articles
