import '@testing-library/jest-dom/vitest'
import { render, waitFor } from './utils/test-utils'
import { describe, expect, it } from 'vitest'

import SEOHead from '@/components/SEOHead'

describe('SEOHead', () => {
  it('sets title and description meta', async () => {
    render(<SEOHead title="Test" description="desc" />)
    await waitFor(() => expect(document.title).toBe('Test'))
    const meta = document.querySelector('meta[name="description"]')
    expect(meta).toHaveAttribute('content', 'desc')
  })
})
