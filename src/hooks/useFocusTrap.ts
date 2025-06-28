import { useEffect, useRef } from 'react'

export function useFocusTrap(
  active: boolean,
  returnRef?: React.RefObject<HTMLElement>,
  onEscape?: () => void
) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!active || !el) return
    const prev = document.activeElement as HTMLElement | null
    const restore = returnRef?.current
    const nodes = el.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
    )
    const firstNode = nodes[0]
    const lastNode = nodes[nodes.length - 1]
    const first = firstNode ?? el
    const last = lastNode ?? el
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (
            document.activeElement === first ||
            document.activeElement === el
          ) {
            e.preventDefault()
            last.focus()
          }
        } else if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onEscape?.()
      }
    }
    el.focus()
    document.addEventListener('keydown', handle)
    return () => {
      document.removeEventListener('keydown', handle)
      ;(restore ?? prev)?.focus()
    }
  }, [active, returnRef, onEscape])
  return ref
}
