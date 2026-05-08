import { cn } from '@/lib/utils'
import React, { useId } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconPosition = 'left', wrapperClassName, className, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId

    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-(--color-text-secondary)">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && <div className="absolute top-1/2 left-3 -translate-y-1/2 text-(--color-text-muted)">{icon}</div>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-10 w-full rounded-lg px-3 text-sm transition-all duration-200',
              'border border-(--color-input-border) bg-(--color-input-bg)',
              'text-(--color-text) placeholder:text-(--color-text-muted)',
              'focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 focus:outline-none',
              'dark:focus:border-[#3B82F6] dark:focus:ring-[#3B82F6]/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {icon && iconPosition === 'right' && <div className="absolute top-1/2 right-3 -translate-y-1/2 text-(--color-text-muted)">{icon}</div>}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-(--color-text-muted)">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, type InputProps }
