import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import React, { useId } from 'react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  error?: string
  hint?: string
  disabled?: boolean
  className?: string
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, error, hint, disabled = false, className }) => {
  const id = useId()

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2.5">
        <button
          id={id}
          type="button"
          role="checkbox"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
            checked ? 'border-[#1E40AF] bg-[#1E40AF] dark:border-[#3B82F6] dark:bg-[#3B82F6]' : 'border-(--color-input-border) bg-(--color-input-bg)',
            disabled && 'cursor-not-allowed opacity-50',
            !disabled && 'cursor-pointer',
            error && !checked && 'border-red-500'
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </button>
        {label && (
          <label htmlFor={id} className={cn('text-sm text-(--color-text)', !disabled && 'cursor-pointer')}>
            {label}
          </label>
        )}
      </div>
      {error && <p className="ml-7 text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="ml-7 text-xs text-(--color-text-muted)">{hint}</p>}
    </div>
  )
}

Checkbox.displayName = 'Checkbox'

export { Checkbox, type CheckboxProps }
