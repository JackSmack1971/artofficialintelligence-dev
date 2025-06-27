import React from 'react'

export interface ArticleCardProps {
  id?: string
  title: string
  excerpt: string
  author: string
  image: string
  'data-testid'?: string
}

export const ArticleCard: React.FC<ArticleCardProps> = React.memo(
  ({
    title,
    excerpt,
    author,
    image,
    'data-testid': testId = 'article-card'
  }) => (
    <article
      className="rounded-md overflow-hidden border shadow-sm bg-white"
      data-testid={testId}
    >
      <img
        src={image}
        alt={`Illustration for ${title}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 mb-2">{excerpt}</p>
        <p className="text-sm text-gray-500">By {author}</p>
      </div>
    </article>
  )
)

ArticleCard.displayName = 'ArticleCard'

export default ArticleCard
