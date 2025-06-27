import React, { useEffect } from 'react'

import { createPortal } from 'react-dom'

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Drawer: React.FC<DrawerProps> = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div
        data-testid="drawer-overlay"
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-64 max-w-full h-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300"
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

Drawer.displayName = 'Drawer'
