import React, { useEffect, useState } from 'react'
import { fetchWithRetry } from '@/lib/api'

const Home: React.FC = () => {
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await fetchWithRetry('/api/health')
        const data = await res.json()
        setStatus(data.status)
      } catch (error) {
        setStatus('error')
      }
    }

    void getStatus()
  }, [])

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold">
        Welcome to ArtOfficial Intelligence
      </h2>
      {status && <p data-testid="status">Status: {status}</p>}
    </section>
  )
}

export default Home
