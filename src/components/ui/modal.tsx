import { cn } from '@/lib/utils'
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children: React.ReactNode
  footer?: React.ReactNode
}

const sizeStyles: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]'
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, description, size = 'md', children, footer }) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // ESC to close
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Focus trap
  useEffect(() => {
    if (!open || !contentRef.current) return
    const focusable = contentRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    if (focusable.length > 0) focusable[0].focus()
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-(--color-overlay) backdrop-blur-sm" />

      {/* Content */}
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'animate-scale-in relative z-10 w-full rounded-2xl border border-(--color-card-border) bg-(--color-surface) shadow-2xl',
          sizeStyles[size]
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-(--color-border) px-6 py-4">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-(--color-text)">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm text-(--color-text-muted)">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-(--color-text-muted) transition-colors hover:bg-(--color-surface-hover) hover:text-(--color-text)"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="scrollbar-custom max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && <div className="flex items-center justify-end gap-3 border-t border-(--color-border) px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

/* ===== Confirm Modal ===== */

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  variant?: 'danger' | 'warning' | 'info'
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}

const variantConfig = {
  danger: { icon: AlertCircle, iconClass: 'text-red-500', bgClass: 'bg-red-50 dark:bg-red-950', buttonVariant: 'danger' as const },
  warning: { icon: AlertTriangle, iconClass: 'text-amber-500', bgClass: 'bg-amber-50 dark:bg-amber-950', buttonVariant: 'primary' as const },
  info: { icon: Info, iconClass: 'text-blue-500', bgClass: 'bg-blue-50 dark:bg-blue-950', buttonVariant: 'primary' as const }
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'danger',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false
}) => {
  const config = variantConfig[variant]
  const IconComponent = config.icon

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-full', config.bgClass)}>
          <IconComponent className={cn('h-6 w-6', config.iconClass)} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-(--color-text)">{title}</h3>
        <p className="mb-6 text-sm text-(--color-text-muted)">{message}</p>
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={config.buttonVariant} className="flex-1" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

Modal.displayName = 'Modal'
ConfirmModal.displayName = 'ConfirmModal'

export { ConfirmModal, Modal, type ConfirmModalProps, type ModalProps }
