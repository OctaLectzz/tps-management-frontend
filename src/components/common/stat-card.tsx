import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import React from 'react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtitle?: string
  trend?: { value: number; label: string }
  color?: 'blue' | 'green' | 'red' | 'amber' | 'purple'
  className?: string
}

const colorConfig: Record<string, { bg: string; icon: string; trend: string }> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    icon: 'text-[#1E40AF] dark:text-blue-400',
    trend: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950',
    icon: 'text-green-600 dark:text-green-400',
    trend: 'text-green-600'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950',
    icon: 'text-red-600 dark:text-red-400',
    trend: 'text-red-600'
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    icon: 'text-amber-600 dark:text-amber-400',
    trend: 'text-amber-600'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    icon: 'text-purple-600 dark:text-purple-400',
    trend: 'text-purple-600'
  }
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, subtitle, color = 'blue', className }) => {
  const c = colorConfig[color]

  return (
    <div
      className={cn(
        'rounded-xl border border-(--color-card-border) bg-(--color-card-bg) p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-(--color-text-muted)">{label}</p>
          <p className="mt-2 text-3xl font-bold text-(--color-text)">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-(--color-text-muted)">{subtitle}</p>}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', c.bg)}>
          <Icon className={cn('h-6 w-6', c.icon)} />
        </div>
      </div>
    </div>
  )
}

StatCard.displayName = 'StatCard'

export { StatCard, type StatCardProps }
