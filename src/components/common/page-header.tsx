import { cn } from '@/lib/utils'
import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, className }) => {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h2 className="text-xl font-bold text-(--color-text)">{title}</h2>
        {description && <p className="mt-1 text-sm text-(--color-text-muted)">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

PageHeader.displayName = 'PageHeader'

export { PageHeader, type PageHeaderProps }
