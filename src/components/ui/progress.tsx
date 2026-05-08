import { cn } from '@/lib/utils'
import React from 'react'

interface ProgressProps {
  value: number
  max?: number
  label?: string
  showPercent?: boolean
  color?: 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

const colorStyles: Record<string, string> = {
  primary: 'bg-[#1E40AF] dark:bg-[#3B82F6]',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500'
}

const Progress: React.FC<ProgressProps> = ({ value, max = 100, label, showPercent = false, color = 'primary', className }) => {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-sm font-medium text-(--color-text-secondary)">{label}</span>}
          {showPercent && <span className="text-sm font-semibold text-(--color-text)">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-(--color-skeleton)">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', colorStyles[color])}
          style={{ width: `${percent}%`, animation: 'progress-fill 0.8s ease-out' }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

Progress.displayName = 'Progress'

export { Progress, type ProgressProps }
