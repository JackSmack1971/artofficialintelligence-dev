import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import { Header } from '@/components/layout/Header'
import { NAVIGATION } from '@/data/navigation'
import { validateNavigation } from '@/lib/validation'

export const App: React.FC = () => {
  const navigation = validateNavigation(NAVIGATION)

  return (
    <BrowserRouter>
      <Header navigation={navigation} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
