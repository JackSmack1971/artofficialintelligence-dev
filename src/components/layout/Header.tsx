import React, { useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { NavigationItem } from '@/types/navigation'
import { Button } from '@/components/ui/Button'

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

  const items = useMemo(
    () =>
      navigation.map((item) => ({
        ...item,
        isActive: location.pathname === item.href
      })),
    [navigation, location.pathname]
  )

  const handleKeyDown = useCallback((event: React.KeyboardEvent, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      window.location.assign(href)
    }
  }, [])

  return (
    <header
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}
      role="banner"
      aria-label="Site header"
      data-testid={testId}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav aria-label="Main navigation">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-ai-primary focus:outline-none focus:ring-2 focus:ring-ai-primary focus:ring-offset-2 rounded-md"
              aria-label="ArtOfficial Intelligence home"
            >
              ArtOfficial Intelligence
            </Link>
            <ul role="menubar" className="hidden md:flex space-x-8">
              {items.map(({ href, label, isActive }) => (
                <li key={href} role="none">
                  <Link
                    to={href}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ai-primary focus:ring-offset-2 ${isActive ? 'text-ai-primary bg-ai-primary/10' : 'text-gray-700 dark:text-gray-300 hover:text-ai-primary hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    onKeyDown={(e) => handleKeyDown(e, href)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button variant="ghost" size="sm" className="md:hidden" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu">
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
