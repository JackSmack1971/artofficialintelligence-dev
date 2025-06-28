import { useEffect } from 'react'

import { useLocation } from 'react-router-dom'

export function useRouteFocus() {
  const { pathname } = useLocation()

  useEffect(() => {
    const main = document.querySelector('main') as HTMLElement | null
    if (main) {
      if (!main.hasAttribute('tabindex')) {
        main.setAttribute('tabindex', '-1')
      }
      main.focus()
    }
  }, [pathname])
}
