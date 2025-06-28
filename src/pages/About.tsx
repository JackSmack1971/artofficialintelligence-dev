import React from 'react'

import SEOHead from '@/components/SEOHead'

const About: React.FC = () => (
  <main
    id="main-content"
    tabIndex={-1}
    className="max-w-4xl mx-auto px-4 py-8 space-y-6"
  >
    <SEOHead
      title="About - ArtOfficial Intelligence"
      description="Learn more about ArtOfficial Intelligence"
    />
    <header className="text-center">
      <h1 className="text-3xl font-bold text-ai-primary mb-2">
        About ArtOfficial Intelligence
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg">
        Your trusted source for AI creativity and innovation
      </p>
    </header>
    <section className="space-y-4 leading-relaxed">
      <p>
        ArtOfficial Intelligence delivers curated stories on machine learning,
        robotics and digital art. We translate complex breakthroughs into clear,
        engaging narratives for creators and technologists alike.
      </p>
      <p>
        Our team blends editorial expertise with modern AI tools to surface the
        ideas shaping tomorrow. Join us as we explore the frontier of artificial
        intelligence.
      </p>
    </section>
  </main>
)

export default About
