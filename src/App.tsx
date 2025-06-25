import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import { Header } from '@/components/layout/Header'
import { NAVIGATION } from '@/data/navigation'

export const App: React.FC = () => (
  <BrowserRouter>
    <Header navigation={NAVIGATION} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default App
