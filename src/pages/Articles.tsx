import React from 'react'

import LoadingSpinner from '@/components/LoadingSpinner'
import ArticleCard from '@/components/ui/ArticleCard'

import { useArticles } from '@/hooks/useArticles'

const Articles: React.FC = () => {
  const { data, loading, error } = useArticles()

  if (loading) return <LoadingSpinner />

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4">Articles</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="grid gap-4 md:grid-cols-2">
        {data.map((article) => (
          <li key={article.id}>
            <ArticleCard
              {...article}
              author={
                typeof article.author === 'string'
                  ? article.author
                  : article.author.name
              }
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Articles
