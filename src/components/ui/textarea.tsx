import { cn } from '@/lib/utils'
import React, { useId } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  wrapperClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, hint, wrapperClassName, className, id, ...props }, ref) => {
  const generatedId = useId()
  const textareaId = id || generatedId

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-(--color-text-secondary)">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          'min-h-[80px] w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
          'border border-(--color-input-border) bg-(--color-input-bg)',
          'text-(--color-text) placeholder:text-(--color-text-muted)',
          'focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 focus:outline-none',
          'dark:focus:border-[#3B82F6] dark:focus:ring-[#3B82F6]/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${textareaId}-hint`} className="text-xs text-(--color-text-muted)">
          {hint}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export { Textarea, type TextareaProps }
