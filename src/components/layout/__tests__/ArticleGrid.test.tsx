import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ArticleGrid } from '../ArticleGrid'

const articles = [
  {
    id: '1',
    title: 'First',
    excerpt: 'One',
    author: { id: 'a1', name: 'Jane', avatar: 'a.jpg' },
    image: 'img1.jpg'
  },
  {
    id: '2',
    title: 'Second',
    excerpt: 'Two',
    author: { id: 'a2', name: 'John', avatar: 'b.jpg' },
    image: 'img2.jpg'
  }
]

describe('ArticleGrid component', () => {
  it('renders list of articles with proper roles', () => {
    render(<ArticleGrid articles={articles} />)
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
  })

  it('applies responsive grid classes', () => {
    const { container } = render(<ArticleGrid articles={articles} />)
    expect(container.firstChild).toHaveClass(
      'grid',
      'gap-6',
      'sm:grid-cols-2',
      'lg:grid-cols-3'
    )
  })
})
