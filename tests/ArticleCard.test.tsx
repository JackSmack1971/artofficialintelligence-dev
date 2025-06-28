import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { vi } from 'vitest'

import ArticleCard from '@/components/ui/ArticleCard'

describe('ArticleCard', () => {
  it('renders provided article information', () => {
    render(
      <ArticleCard
        title="Test Title"
        excerpt="Test excerpt"
        author="Tester"
        image="test.jpg"
        imageAlt="Alt text"
      />
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByAltText('Alt text')).toBeInTheDocument()
    expect(screen.getByTestId('article-card')).toBeInTheDocument()
  })

  it('uses default alt text when none provided', () => {
    render(
      <ArticleCard
        title="Default Alt"
        excerpt="Test"
        author="Tester"
        image="test.jpg"
      />
    )
    expect(
      screen.getByAltText('Illustration for Default Alt')
    ).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const onClick = vi.fn()
    render(
      <ArticleCard
        id="1"
        title="Click Test"
        excerpt="Test"
        author="Tester"
        image="test.jpg"
        onClick={onClick}
      />
    )
    await userEvent.click(screen.getByTestId('article-card'))
    expect(onClick).toHaveBeenCalledWith('1')
  })
})
