import React, { useEffect, useState } from 'react'

import ArticleCard from '@/components/features/ArticleCard'
import LoadingSpinner from '@/components/LoadingSpinner'

import { fetchWithRetry } from '@/lib/api'
import type { Article } from '@/types/article'

const Home: React.FC = () => {
  const [status, setStatus] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [healthRes, articlesRes] = await Promise.all([
          fetchWithRetry('/api/health'),
          fetchWithRetry('/articles.json')
        ])
        setStatus((await healthRes.json()).status)
        setArticles((await articlesRes.json()) as Article[])
      } catch {
        setStatus('error')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <main>
      <section
        className="py-16 text-center bg-ai-primary text-white"
        data-testid="hero"
      >
        <h1 className="text-3xl font-bold">ArtOfficial Intelligence</h1>
        <p className="text-lg">Latest news in artificial intelligence</p>
      </section>
      <section className="p-4">
        {status && <p data-testid="status">Status: {status}</p>}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ul className="grid gap-4 md:grid-cols-3" data-testid="articles">
            {articles.slice(0, 3).map((article) => (
              <li key={article.id}>
                <ArticleCard {...article} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default Home
