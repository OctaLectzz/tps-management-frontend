import { cn } from '@/lib/utils'
import React from 'react'

interface SkeletonProps {
  width?: string
  height?: string
  rounded?: boolean
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height = '1rem', rounded = false, className }) => {
  return (
    <div
      className={cn('relative overflow-hidden bg-(--color-skeleton)', rounded ? 'rounded-full' : 'rounded-md', className)}
      style={{ width, height }}
    >
      <div className="animate-shimmer absolute inset-0 bg-linear-to-r from-transparent via-(--color-skeleton-shine) to-transparent" />
    </div>
  )
}

const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className }) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="0.75rem" width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  )
}

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('rounded-xl border border-(--color-card-border) bg-(--color-card-bg) p-5', className)}>
      <div className="mb-4 flex items-center gap-3">
        <Skeleton width="2.5rem" height="2.5rem" rounded />
        <div className="flex-1">
          <Skeleton height="0.875rem" width="60%" className="mb-2" />
          <Skeleton height="0.625rem" width="40%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}

const SkeletonTable: React.FC<{ rows?: number; cols?: number; className?: string }> = ({ rows = 5, cols = 5, className }) => {
  return (
    <div className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex gap-4 border-b border-(--color-border) px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="0.75rem" width={`${100 / cols - 2}%`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 border-b border-(--color-border) px-4 py-3">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="0.75rem" width={`${100 / cols - 2}%`} />
          ))}
        </div>
      ))}
    </div>
  )
}

Skeleton.displayName = 'Skeleton'
SkeletonText.displayName = 'SkeletonText'
SkeletonCard.displayName = 'SkeletonCard'
SkeletonTable.displayName = 'SkeletonTable'

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonText, type SkeletonProps }
