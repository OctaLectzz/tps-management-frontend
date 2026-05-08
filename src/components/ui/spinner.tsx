import { cn } from '@/lib/utils'
import React from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

const sizeStyles: Record<string, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]'
}

const colorStyles: Record<string, string> = {
  primary: 'border-[#1E40AF]/30 border-t-[#1E40AF] dark:border-[#3B82F6]/30 dark:border-t-[#3B82F6]',
  white: 'border-white/30 border-t-white',
  gray: 'border-gray-300/30 border-t-gray-400 dark:border-gray-600/30 dark:border-t-gray-400'
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary', className }) => {
  return <div role="status" aria-label="Loading" className={cn('animate-spin rounded-full', sizeStyles[size], colorStyles[color], className)} />
}

Spinner.displayName = 'Spinner'

export { Spinner, type SpinnerProps }
