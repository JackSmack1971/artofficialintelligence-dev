import { describe, expect, it } from 'vitest'

import { ApiResponseSchema, ArticleSchema, AuthorSchema } from '@/types/article'

const validAuthor = {
  id: 'a1',
  name: 'Jane Doe',
  avatar: 'https://example.com/avatar.png'
}

const validArticle = {
  id: '1',
  title: 'Test',
  excerpt: 'Example',
  author: validAuthor,
  image: 'https://example.com/img.png'
}

describe('Article and Author schemas', () => {
  it('parses valid author', () => {
    const parsed = AuthorSchema.parse(validAuthor)
    expect(parsed.name).toBe('Jane Doe')
  })

  it('parses valid article', () => {
    const parsed = ArticleSchema.parse(validArticle)
    expect(parsed.id).toBe('1')
  })

  it('throws on invalid article', () => {
    expect(() => ArticleSchema.parse({})).toThrow()
  })
})

describe('ApiResponseSchema', () => {
  it('parses response with data', () => {
    const schema = ApiResponseSchema(ArticleSchema)
    const parsed = schema.parse({ success: true, data: validArticle })
    expect(parsed.data.title).toBe('Test')
  })
})
