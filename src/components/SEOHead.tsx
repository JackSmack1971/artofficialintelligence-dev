import React from 'react'

import { Helmet } from 'react-helmet-async'

export interface SEOHeadProps {
  title: string
  description?: string
  children?: React.ReactNode
}

const SEOHead: React.FC<SEOHeadProps> = React.memo(
  ({ title, description, children }) => (
    <Helmet>
      <title>{title}</title>
      {description ? (
        <meta name="description" content={description} />
      ) : null}
      {children}
    </Helmet>
  )
)

SEOHead.displayName = 'SEOHead'

export default SEOHead
