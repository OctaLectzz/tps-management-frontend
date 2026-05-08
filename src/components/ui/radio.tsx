import { cn } from '@/lib/utils'
import React, { useId } from 'react'

interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  name?: string
  label?: string
  error?: string
  direction?: 'horizontal' | 'vertical'
  className?: string
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange, label, error, direction = 'vertical', className }) => {
  const groupId = useId()

  return (
    <div className={cn('flex flex-col gap-2', className)} role="radiogroup" aria-labelledby={label ? `${groupId}-label` : undefined}>
      {label && (
        <span id={`${groupId}-label`} className="text-sm font-medium text-(--color-text-secondary)">
          {label}
        </span>
      )}
      <div className={cn('flex gap-3', direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}>
        {options.map((option) => {
          const isSelected = option.value === value
          const optionId = `${groupId}-${option.value}`

          return (
            <div key={option.value} className="flex items-center gap-2.5">
              <button
                id={optionId}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={option.disabled}
                onClick={() => !option.disabled && onChange(option.value)}
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                  isSelected ? 'border-[#1E40AF] dark:border-[#3B82F6]' : 'border-(--color-input-border)',
                  option.disabled && 'cursor-not-allowed opacity-50',
                  !option.disabled && 'cursor-pointer'
                )}
              >
                {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-[#1E40AF] dark:bg-[#3B82F6]" />}
              </button>
              <label htmlFor={optionId} className={cn('text-sm text-(--color-text)', !option.disabled && 'cursor-pointer')}>
                {option.label}
              </label>
            </div>
          )
        })}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

RadioGroup.displayName = 'RadioGroup'

export { RadioGroup, type RadioGroupProps, type RadioOption }
