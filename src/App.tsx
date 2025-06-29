import React, { Suspense, useEffect } from 'react'

import { Route, Routes } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import LoadingSpinner from '@/components/LoadingSpinner'

import { NAVIGATION } from '@/data/navigation'
import { useRouteFocus } from '@/hooks/useRouteFocus'
import { lazyWithPreload } from '@/lib/lazyWithPreload'
import { validateNavigation } from '@/lib/validation'

const Home = lazyWithPreload(() =>
  import('@/pages/Home').then((m) => ({
    default: m.default as React.ComponentType<unknown>
  }))
)
const About = lazyWithPreload(() =>
  import('@/pages/About').then((m) => ({
    default: m.default as React.ComponentType<unknown>
  }))
)
const Articles = lazyWithPreload(() =>
  import('@/pages/Articles').then((m) => ({
    default: m.default as React.ComponentType<unknown>
  }))
)
const NotFound = lazyWithPreload(() =>
  import('@/pages/NotFound').then((m) => ({
    default: m.default as React.ComponentType<unknown>
  }))
)

export const App: React.FC = () => {
  const navigation = validateNavigation(NAVIGATION)

  useRouteFocus()

  useEffect(() => {
    void Home.preload()
    void Articles.preload()
  }, [])

  return (
    <>
      <Header navigation={navigation} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
