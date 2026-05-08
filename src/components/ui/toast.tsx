import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react'
import React, { createContext, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toast: (params: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />
}

const bgStyles: Record<ToastType, string> = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500'
}

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast: t, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => onDismiss(t.id), 300)
  }, [t.id, onDismiss])

  React.useEffect(() => {
    const duration = t.duration || 5000
    const timer = setTimeout(handleDismiss, duration)
    return () => clearTimeout(timer)
  }, [t.duration, handleDismiss])

  return (
    <div
      role="alert"
      className={cn(
        'pointer-events-auto w-80 overflow-hidden rounded-lg border border-l-4 border-(--color-card-border) bg-(--color-surface) shadow-lg',
        bgStyles[t.type],
        isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="mt-0.5 shrink-0">{iconMap[t.type]}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-(--color-text)">{t.title}</p>
          {t.message && <p className="mt-0.5 text-xs text-(--color-text-muted)">{t.message}</p>}
        </div>
        <button onClick={handleDismiss} className="shrink-0 rounded p-0.5 text-(--color-text-muted) transition-colors hover:text-(--color-text)">
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-(--color-border)">
        <div
          className={cn(
            'h-full',
            t.type === 'success' && 'bg-green-500',
            t.type === 'error' && 'bg-red-500',
            t.type === 'warning' && 'bg-amber-500',
            t.type === 'info' && 'bg-blue-500'
          )}
          style={{ animation: `toast-progress ${t.duration || 5000}ms linear forwards` }}
        />
      </div>
    </div>
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((params: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts((prev) => [...prev.slice(-2), { ...params, id }]) // max 3
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed right-4 bottom-4 z-100 flex flex-col gap-2">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}
