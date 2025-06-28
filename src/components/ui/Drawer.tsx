import React, { useEffect, useState } from 'react'

import { createPortal } from 'react-dom'

import { useFocusTrap } from '@/hooks/useFocusTrap'

interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  toggleRef?: React.RefObject<HTMLElement>
  ariaLabel?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  toggleRef,
  ariaLabel
}) => {
  const ref = useFocusTrap(open, toggleRef, onClose)
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    if (open) setVisible(true)
  }, [open])

  const handleTransitionEnd = () => {
    if (!open) setVisible(false)
  }

  if (!visible) return null
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
        aria-label={ariaLabel}
        tabIndex={-1}
        onTransitionEnd={handleTransitionEnd}
        className={`relative w-64 max-w-full h-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

Drawer.displayName = 'Drawer'
