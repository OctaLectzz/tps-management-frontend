import { cn } from '@/lib/utils'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import React from 'react'

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  dismissible?: boolean
  onDismiss?: () => void
  icon?: boolean
  className?: string
}

const config = {
  info: { icon: Info, border: 'border-l-blue-500', bg: 'bg-(--color-info-bg)', text: 'text-blue-700 dark:text-blue-400' },
  success: { icon: CheckCircle, border: 'border-l-green-500', bg: 'bg-(--color-success-bg)', text: 'text-green-700 dark:text-green-400' },
  warning: { icon: AlertTriangle, border: 'border-l-amber-500', bg: 'bg-(--color-warning-bg)', text: 'text-amber-700 dark:text-amber-400' },
  error: { icon: AlertCircle, border: 'border-l-red-500', bg: 'bg-(--color-danger-bg)', text: 'text-red-700 dark:text-red-400' }
}

const Alert: React.FC<AlertProps> = ({ type, title, message, dismissible = false, onDismiss, icon = true, className }) => {
  const c = config[type]
  const IconComponent = c.icon

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border-l-4 p-4', c.border, c.bg, className)} role="alert">
      {icon && <IconComponent className={cn('mt-0.5 h-5 w-5 shrink-0', c.text)} />}
      <div className="min-w-0 flex-1">
        {title && <p className={cn('text-sm font-semibold', c.text)}>{title}</p>}
        <p className={cn('text-sm', title ? 'mt-0.5' : '', c.text, 'opacity-90')}>{message}</p>
      </div>
      {dismissible && (
        <button onClick={onDismiss} className={cn('shrink-0 rounded p-0.5 transition-opacity hover:opacity-70', c.text)}>
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

Alert.displayName = 'Alert'

export { Alert, type AlertProps }
