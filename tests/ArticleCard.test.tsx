import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ArticleCard from '@/components/features/ArticleCard'

describe('ArticleCard', () => {
  it('renders article information', () => {
    render(
      <ArticleCard
        title="Test Title"
        excerpt="Test excerpt"
        author="Tester"
        image="test.jpg"
      />
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test excerpt')).toBeInTheDocument()
    expect(screen.getByText(/Tester/)).toBeInTheDocument()
  })
})
