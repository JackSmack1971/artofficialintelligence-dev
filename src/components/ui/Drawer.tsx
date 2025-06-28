import React from 'react'

import { createPortal } from 'react-dom'

import { useFocusTrap } from '@/hooks/useFocusTrap'

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  toggleRef?: React.RefObject<HTMLElement>
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  toggleRef
}) => {
  const ref = useFocusTrap(open, toggleRef, onClose)

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
        ref={ref}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="relative w-64 max-w-full h-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300"
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

Drawer.displayName = 'Drawer'
