import React from 'react'

import { ArticleCard } from '@/components/ui'

import { cn } from '@/lib/utils'
import { type Article } from '@/types/article'

export interface ArticleGridProps {
  articles: Article[]
  className?: string
  'data-testid'?: string
}

export const ArticleGrid: React.FC<ArticleGridProps> = React.memo(
  ({ articles, className = '', 'data-testid': testId = 'article-grid' }) => (
    <ul
      className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}
      data-testid={testId}
      role="list"
    >
      {articles.map((article) => (
        <li key={article.id} role="listitem">
          <ArticleCard {...article} author={article.author.name} />
        </li>
      ))}
    </ul>
  )
)

ArticleGrid.displayName = 'ArticleGrid'

export default ArticleGrid
