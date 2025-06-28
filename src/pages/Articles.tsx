import React from 'react'

import ArticleCard from '@/components/ui/ArticleCard'
import Skeleton from '@/components/ui/Skeleton'

import { useArticles } from '@/hooks/useArticles'

const Articles: React.FC = () => {
  const { data, loading, error } = useArticles()

  if (loading) return <Skeleton count={6} className="h-48" />

  return (
    <main id="main-content" tabIndex={-1} className="p-4">
      <section>
        <h2 className="text-xl font-semibold mb-4">Articles</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="grid gap-4 md:grid-cols-2">
          {data.map((article) => (
            <li key={article.id}>
              <ArticleCard {...article} author={article.author.name} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default Articles
