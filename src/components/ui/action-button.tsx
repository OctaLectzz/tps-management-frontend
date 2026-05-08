import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import React from 'react'

interface ActionButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  variant?: 'default' | 'danger' | 'success' | 'warning'
  disabled?: boolean
  className?: string
}

const variantStyles: Record<string, string> = {
  default: 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[#1E40AF] dark:hover:text-[#3B82F6]',
  danger: 'text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400',
  success: 'text-[var(--color-text-muted)] hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400',
  warning: 'text-[var(--color-text-muted)] hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950 dark:hover:text-amber-400'
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, onClick, variant = 'default', disabled = false, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

/* ===== Action Button Group ===== */
interface ActionGroupProps {
  children: React.ReactNode
  className?: string
}

const ActionGroup: React.FC<ActionGroupProps> = ({ children, className }) => {
  return <div className={cn('flex items-center gap-0.5', className)}>{children}</div>
}

ActionButton.displayName = 'ActionButton'
ActionGroup.displayName = 'ActionGroup'

export { ActionButton, ActionGroup, type ActionButtonProps }
