import React, { Suspense, useEffect } from 'react'

import { Route, Routes } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import LoadingSpinner from '@/components/LoadingSpinner'

import { NAVIGATION } from '@/data/navigation'
import { lazyWithPreload } from '@/lib/lazyWithPreload'
import { validateNavigation } from '@/lib/validation'

const Home = lazyWithPreload(() => import('@/pages/Home'))
const About = lazyWithPreload(() => import('@/pages/About'))
const NotFound = lazyWithPreload(() => import('@/pages/NotFound'))

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
