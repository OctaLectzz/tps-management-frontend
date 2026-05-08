import { cn } from '@/lib/utils'
import React from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  outline: 'border border-(--color-border) text-(--color-text-secondary) bg-transparent'
}

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  outline: 'bg-gray-400'
}

const sizeStyles: Record<'sm' | 'md', string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs'
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', size = 'sm', dot = false, children, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'

export { Badge, type BadgeProps, type BadgeVariant }
