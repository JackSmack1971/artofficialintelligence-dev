import React, { useEffect } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

const modalVariants = cva(
  'bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        default: 'max-w-lg',
        lg: 'max-w-2xl'
      }
    },
    defaultVariants: { size: 'default' }
  }
)

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  open: boolean
  onClose: () => void
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size,
  className,
  children,
  ...aria
}) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        data-testid="modal-overlay"
        className="fixed inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(modalVariants({ size }), className, 'z-10')}
        {...aria}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

Modal.displayName = 'Modal'

export default Modal
