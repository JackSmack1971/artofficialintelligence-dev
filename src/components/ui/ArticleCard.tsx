import React from 'react'

import type { Article } from '@/types/article'

export interface ArticleCardProps
  extends Pick<Article, 'id' | 'title' | 'excerpt' | 'image' | 'imageAlt'> {
  author: string
  onClick?: (id: string) => void
  'data-testid'?: string
}

export const ArticleCard: React.FC<ArticleCardProps> = React.memo(
  ({
    id,
    title,
    excerpt,
    author,
    image,
    imageAlt = `Illustration for ${title}`,
    onClick,
    'data-testid': testId = 'article-card'
  }) => {
    const handleClick = () => {
      if (id && onClick) onClick(id)
    }

    return (
      <article
        className="rounded-md overflow-hidden border shadow-sm bg-white"
        data-testid={testId}
        onClick={handleClick}
      >
        <img src={image} alt={imageAlt} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-700 mb-2">{excerpt}</p>
          <p className="text-sm text-gray-500">By {author}</p>
        </div>
      </article>
    )
  }
)

ArticleCard.displayName = 'ArticleCard'

export default ArticleCard
