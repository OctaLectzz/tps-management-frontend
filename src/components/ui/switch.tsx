import { cn } from '@/lib/utils'
import React, { useId } from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  error?: string
  className?: string
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, description, disabled = false, error, className }) => {
  const id = useId()

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200',
          checked ? 'bg-[#1E40AF] dark:bg-[#3B82F6]' : 'bg-gray-300 dark:bg-gray-600',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'cursor-pointer'
        )}
      >
        <span
          className={cn(
            'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      {(label || description) && (
        <div>
          {label && (
            <label htmlFor={id} className={cn('text-sm font-medium text-(--color-text)', !disabled && 'cursor-pointer')}>
              {label}
            </label>
          )}
          {description && <p className="text-xs text-(--color-text-muted)">{description}</p>}
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  )
}

Switch.displayName = 'Switch'

export { Switch, type SwitchProps }
