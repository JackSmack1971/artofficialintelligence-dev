# Components - Production-Grade React 18 + TypeScript

Build enterprise-quality components using modern React patterns, strict TypeScript, and performance optimization.

## 🎯 Component Design Principles

### Performance-First Architecture
- **React.memo**: Wrap expensive components to prevent unnecessary re-renders
- **useCallback**: Memoize event handlers passed to child components
- **useMemo**: Cache expensive computations and derived state
- **Lazy Loading**: Use React.lazy() for route-based code splitting
- **Bundle Optimization**: Tree-shakeable exports, minimal dependencies

### Type Safety & Developer Experience
- **Strict TypeScript**: No `any` types, comprehensive interfaces
- **Generic Components**: Reusable with proper type constraints
- **Prop Validation**: Runtime + compile-time validation
- **Developer Tools**: displayName, helpful error messages
- **Documentation**: JSDoc comments for public APIs

### Accessibility by Default
- **Semantic HTML**: Use proper HTML elements (nav, main, article)
- **ARIA Support**: Labels, roles, states when needed
- **Keyboard Navigation**: Tab order, focus management, escape handling
- **Screen Reader**: Tested with NVDA, JAWS, VoiceOver
- **Color Contrast**: WCAG AA compliant (4.5:1 ratio)

## 📦 Component Architecture

### Layout Components

#### Header.tsx
```typescript
import React, { useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import type { NavigationItem } from '@/types'

interface HeaderProps {
  navigation: NavigationItem[]
  className?: string
  'data-testid'?: string
}

export const Header: React.FC<HeaderProps> = React.memo(({ 
  navigation, 
  className = '',
  'data-testid': testId = 'header'
}) => {
  const location = useLocation()
  
  // Memoize navigation items with active state
  const navigationWithActiveState = useMemo(() => 
    navigation.map(item => ({
      ...item,
      isActive: location.pathname === item.href
    })), [navigation, location.pathname]
  )
  
  // Memoized keyboard handler for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // Handle navigation programmatically
    }
  }, [])

  return (
    <header 
      className={`bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 ${className}`}
      role="banner"
      aria-label="Site header"
      data-testid={testId}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav role="navigation" aria-label="Main navigation">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl font-bold text-ai-primary focus:outline-none focus:ring-2 focus:ring-ai-primary focus:ring-offset-2 rounded-md"
              aria-label="ArtOfficial Intelligence home"
            >
              ArtOfficial Intelligence
            </Link>
            
            {/* Navigation */}
            <ul role="menubar" className="hidden md:flex space-x-8">
              {navigationWithActiveState.map(({ href, label, isActive }) => (
                <li key={href} role="none">
                  <Link
                    to={href}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium transition-colors
                      focus:outline-none focus:ring-2 focus:ring-ai-primary focus:ring-offset-2
                      ${isActive 
                        ? 'text-ai-primary bg-ai-primary/10' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-ai-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    onKeyDown={(e) => handleKeyDown(e, href)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Mobile menu button - implement when needed */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              aria-label="Open navigation menu"
              aria-expanded="false"
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
})

Header.displayName = 'Header'
```

#### Layout.tsx
```typescript
import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { NAVIGATION } from '@/data/siteContent'
import { useScrollToTop } from '@/hooks/useScrollToTop'

interface LayoutProps {
  showHeader?: boolean
  showFooter?: boolean
  className?: string
}

export const Layout: React.FC<LayoutProps> = React.memo(({ 
  showHeader = true,
  showFooter = true,
  className = ''
}) => {
  const location = useLocation()
  
  // Scroll to top on route change
  useScrollToTop()
  
  // Update page title and meta tags based on route
  useEffect(() => {
    // This would be enhanced with proper metadata management
    document.title = `Page - ArtOfficial Intelligence`
  }, [location])

  return (
    <div className={`min-h-screen flex flex-col bg-white dark:bg-gray-900 ${className}`}>
      {showHeader && (
        <Header 
          navigation={NAVIGATION}
          className="sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95"
        />
      )}
      
      <main 
        className="flex-1"
        role="main"
        id="main-content"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      
      {showFooter && <Footer />}
    </div>
  )
})

Layout.displayName = 'Layout'
```

### Content Components

#### ArticleCard.tsx
```typescript
import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'featured' | 'compact'
  showCategory?: boolean
  showReadingTime?: boolean
  onArticleClick?: (articleId: string) => void
  className?: string
  'data-testid'?: string
}

export const ArticleCard: React.FC<ArticleCardProps> = React.memo(({
  article,
  variant = 'default',
  showCategory = true,
  showReadingTime = true,
  onArticleClick,
  className = '',
  'data-testid': testId = 'article-card'
}) => {
  // Memoize expensive computations
  const readingTime = useMemo(() => 
    article.readingTime || calculateReadingTime(article.content), 
    [article.content, article.readingTime]
  )
  
  const formattedDate = useMemo(() => 
    formatDate(article.publishedAt), 
    [article.publishedAt]
  )
  
  // Memoized click handler
  const handleClick = useCallback((event: React.MouseEvent) => {
    onArticleClick?.(article.id)
    // Allow default Link navigation
  }, [article.id, onArticleClick])
  
  // Memoized keyboard handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onArticleClick?.(article.id)
    }
  }, [article.id, onArticleClick])

  const cardContent = (
    <Card
      variant={variant === 'featured' ? 'elevated' : 'default'}
      className={`
        group cursor-pointer transition-all duration-200 hover:shadow-lg
        ${variant === 'featured' ? 'ring-2 ring-ai-primary/20 bg-gradient-to-br from-ai-primary/5 to-transparent' : ''}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-labelledby={`article-title-${article.id}`}
      aria-describedby={`article-excerpt-${article.id}`}
      data-testid={testId}
    >
      <div className="p-6">
        {/* Category Badge */}
        {showCategory && variant === 'featured' && (
          <div className="mb-3">
            <Badge variant="primary" size="sm">
              {article.featured && '⭐ '}Featured
            </Badge>
          </div>
        )}
        
        {/* Article Title */}
        <h3 
          id={`article-title-${article.id}`}
          className={`
            font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-ai-primary transition-colors
            ${variant === 'compact' ? 'text-base' : 'text-lg lg:text-xl'}
          `}
        >
          {article.title}
        </h3>
        
        {/* Article Excerpt */}
        <p 
          id={`article-excerpt-${article.id}`}
          className={`
            text-gray-600 dark:text-gray-300 mb-4 line-clamp-3
            ${variant === 'compact' ? 'text-sm' : 'text-base'}
          `}
        >
          {article.excerpt}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span aria-label={`Author: ${article.author}`}>
              By {article.author}
            </span>
            {showCategory && (
              <Badge variant="outline" size="xs">
                {article.category}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <time 
              dateTime={article.publishedAt}
              aria-label={`Published ${formattedDate}`}
              title={formattedDate}
            >
              {formattedDate}
            </time>
            {showReadingTime && (
              <span aria-label={`${readingTime} minute read`}>
                {readingTime} min read
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

  // Wrap in Link for proper navigation
  return (
    <Link 
      to={`/articles/${article.slug || article.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-ai-primary focus:ring-offset-2 rounded-lg"
      aria-describedby={`article-card-${article.id}`}
    >
      {cardContent}
      <span id={`article-card-${article.id}`} className="sr-only">
        Click to read full article: {article.title}
      </span>
    </Link>
  )
})

ArticleCard.displayName = 'ArticleCard'
```

### Error Boundary Implementation

#### src/components/ErrorBoundary.tsx

This file logs errors with structured data and displays an AI-themed fallback UI.
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Log error for monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo)
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, LogRocket, etc.
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return (
        <div 
          className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <Button onClick={this.resetError} className="w-full">
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Wrapper component for functional component usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}
```

## 🎭 Component Guidelines

### Performance Optimization Patterns
```typescript
// 1. Memoize expensive components
const ExpensiveComponent = React.memo<Props>(({ data, onUpdate }) => {
  // Memoize expensive computations
  const processedData = useMemo(() => 
    expensiveProcessing(data), [data]
  )
  
  // Memoize event handlers
  const handleUpdate = useCallback((id: string) => {
    onUpdate(id)
  }, [onUpdate])
  
  return <div>{/* Component JSX */}</div>
})

// 2. Use proper dependency arrays
useEffect(() => {
  // Effect logic
}, [specificDependency]) // Only re-run when specific dependency changes

// 3. Lazy load heavy components
const LazyHeavyComponent = React.lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyHeavyComponent />
    </Suspense>
  )
}
```

### TypeScript Best Practices
```typescript
// 1. Prefer interfaces for component props
interface ComponentProps {
  title: string
  optional?: boolean
  children?: React.ReactNode
}

// 2. Use generic types for reusable components
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}

// 3. Use utility types for prop transformations
type RequiredProps = Required<Pick<ComponentProps, 'title'>>
type OptionalProps = Partial<Omit<ComponentProps, 'title'>>
```

### Accessibility Implementation
```typescript
// 1. Semantic HTML foundation
const NavigationMenu = () => (
  <nav role="navigation" aria-label="Main navigation">
    <ul role="menubar">
      <li role="none">
        <a href="/home" role="menuitem">Home</a>
      </li>
    </ul>
  </nav>
)

// 2. Keyboard navigation support
const useKeyboardNavigation = (onEscape: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape()
          break
        case 'Tab':
          // Handle tab navigation
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEscape])
}

// 3. Screen reader support
const AccessibleButton = ({ children, onClick, ...props }) => (
  <button
    onClick={onClick}
    aria-describedby="button-description"
    {...props}
  >
    {children}
    <span id="button-description" className="sr-only">
      Click to perform action
    </span>
  </button>
)
```

### Error Handling & Recovery
```typescript
// 1. Error boundaries for UI protection
const FeatureWithErrorBoundary = () => (
  <ErrorBoundary fallback={FeatureErrorFallback}>
    <ComplexFeature />
  </ErrorBoundary>
)

// 2. Graceful degradation
const EnhancedComponent = ({ fallback = <BasicComponent /> }) => {
  const [hasError, setHasError] = useState(false)
  
  if (hasError) {
    return fallback
  }
  
  return <AdvancedFeature onError={() => setHasError(true)} />
}

// 3. Loading and error states
const AsyncComponent = () => {
  const { data, loading, error } = useAsyncData(fetchData)
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  if (!data) return <EmptyState />
  
  return <DataDisplay data={data} />
}
```

### Testing Support
```typescript
// 1. Test-friendly component design
const TestableComponent = ({ 
  onSubmit, 
  'data-testid': testId = 'component' 
}) => (
  <form onSubmit={onSubmit} data-testid={testId}>
    <input data-testid={`${testId}-input`} />
    <button data-testid={`${testId}-submit`}>Submit</button>
  </form>
)

// 2. Mock-friendly props
interface ComponentProps {
  apiClient?: ApiClient // Injected dependency for testing
  onError?: (error: Error) => void // Error callback for testing
  testMode?: boolean // Test-specific behavior
}

// 3. Component factories for testing
export const createMockComponent = (overrides = {}) => ({
  id: 'test-1',
  title: 'Test Component',
  ...overrides
})
```

## 🧪 Testing Patterns

### Component Testing Examples
```typescript
// ArticleCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ArticleCard } from './ArticleCard'
import { createMockArticle } from '@/lib/test-utils'

const renderWithRouter = (component: React.ReactElement) => 
  render(<MemoryRouter>{component}</MemoryRouter>)

describe('ArticleCard', () => {
  const mockArticle = createMockArticle({
    title: 'Test Article',
    excerpt: 'Test excerpt',
    author: 'Test Author'
  })

  it('renders article information correctly', () => {
    renderWithRouter(<ArticleCard article={mockArticle} />)
    
    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('Test excerpt')).toBeInTheDocument()
    expect(screen.getByText(/By Test Author/)).toBeInTheDocument()
  })

  it('handles click events properly', () => {
    const onArticleClick = jest.fn()
    renderWithRouter(
      <ArticleCard article={mockArticle} onArticleClick={onArticleClick} />
    )
    
    fireEvent.click(screen.getByRole('article'))
    expect(onArticleClick).toHaveBeenCalledWith(mockArticle.id)
  })

  it('supports keyboard navigation', () => {
    const onArticleClick = jest.fn()
    renderWithRouter(
      <ArticleCard article={mockArticle} onArticleClick={onArticleClick} />
    )
    
    const card = screen.getByRole('article')
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(onArticleClick).toHaveBeenCalledWith(mockArticle.id)
  })

  it('displays featured badge when featured', () => {
    const featuredArticle = { ...mockArticle, featured: true }
    renderWithRouter(
      <ArticleCard article={featuredArticle} variant="featured" />
    )
    
    expect(screen.getByText(/Featured/)).toBeInTheDocument()
  })
})
```

### Performance Testing
```typescript
// Performance.test.tsx
import { render } from '@testing-library/react'
import { measureRenderTime } from '@/lib/performance-utils'

describe('Component Performance', () => {
  it('renders large lists efficiently', async () => {
    const largeDataSet = Array.from({ length: 1000 }, (_, i) => 
      createMockArticle({ id: `article-${i}` })
    )
    
    const renderTime = await measureRenderTime(() => 
      render(<ArticleList articles={largeDataSet} />)
    )
    
    expect(renderTime).toBeLessThan(100) // 100ms threshold
  })
})
```
```

---
