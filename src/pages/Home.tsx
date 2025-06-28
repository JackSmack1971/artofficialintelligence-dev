import React, { useEffect, useState } from 'react'

import NeuralBackground from '@/components/features/NeuralBackground'
import LoadingSpinner from '@/components/LoadingSpinner'
import ArticleCard from '@/components/ui/ArticleCard'

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
        className="relative overflow-hidden py-24 text-center bg-ai-primary text-white"
        data-testid="hero"
      >
        <NeuralBackground className="absolute inset-0 w-full h-full opacity-40" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            ArtOfficial Intelligence
          </h1>
          <p className="text-lg md:text-xl text-ai-surface">
            Latest news in artificial intelligence
          </p>
        </div>
      </section>
      <section className="p-4 max-w-6xl mx-auto">
        {status && <p data-testid="status">Status: {status}</p>}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ul
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
            data-testid="articles"
          >
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
