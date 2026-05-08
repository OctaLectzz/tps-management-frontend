import { cn } from '@/lib/utils'
import React from 'react'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  variant?: 'line' | 'pill'
  className?: string
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, variant = 'line', className }) => {
  return (
    <div
      role="tablist"
      className={cn(
        'flex',
        variant === 'line' && 'gap-0 border-b border-(--color-border)',
        variant === 'pill' && 'gap-1 rounded-lg bg-(--color-surface-hover) p-1',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 text-sm font-medium transition-all duration-200',
              variant === 'line' && [
                'relative border-b-2 px-4 py-2.5',
                isActive
                  ? 'border-[#1E40AF] text-[#1E40AF] dark:border-[#3B82F6] dark:text-[#3B82F6]'
                  : 'border-transparent text-(--color-text-muted) hover:border-(--color-border) hover:text-(--color-text)'
              ],
              variant === 'pill' && [
                'rounded-md px-3 py-1.5',
                isActive ? 'bg-(--color-surface) text-(--color-text) shadow-sm' : 'text-(--color-text-muted) hover:text-(--color-text)'
              ]
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                className={cn(
                  'ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                  isActive ? 'bg-[#1E40AF] text-white dark:bg-[#3B82F6]' : 'bg-(--color-surface-hover) text-(--color-text-muted)'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

Tabs.displayName = 'Tabs'

export { Tabs, type Tab, type TabsProps }
