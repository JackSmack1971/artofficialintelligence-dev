import React, { Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { lazyWithPreload } from '@/lib/lazyWithPreload'
import LoadingSpinner from '@/components/LoadingSpinner'
const Home = lazyWithPreload(() => import('@/pages/Home'))
const About = lazyWithPreload(() => import('@/pages/About'))
const NotFound = lazyWithPreload(() => import('@/pages/NotFound'))
import { Header } from '@/components/layout/Header'
import { NAVIGATION } from '@/data/navigation'
import { validateNavigation } from '@/lib/validation'

export const App: React.FC = () => {
  const navigation = validateNavigation(NAVIGATION)

  useEffect(() => {
    void Home.preload()
  }, [])

  return (
    <>
      <Header navigation={navigation} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
