import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, Inbox } from 'lucide-react'
import React, { useState } from 'react'
import { Skeleton } from './skeleton'

interface Column<T> {
  key: keyof T | string
  header: string
  width?: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  stickyHeader?: boolean
  className?: string
}

function Table<T extends any>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  stickyHeader = false,
  className
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const getValue = (row: any, key: string): any => {
    return key.split('.').reduce<any>((obj, k) => {
      if (obj && typeof obj === 'object' && k in obj) {
        return (obj as any)[k]
      }
      return undefined
    }, row)
  }

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = getValue(a, sortKey)
        const bVal = getValue(b, sortKey)
        if (aVal == null) return 1
        if (bVal == null) return -1
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal
        }
        return 0
      })
    : data

  if (loading) {
    return (
      <div className={cn('w-full overflow-hidden rounded-xl border border-(--color-card-border)', className)}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface-hover)">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase"
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-(--color-border)">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3">
                    <Skeleton height="0.75rem" width="80%" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-(--color-card-border) bg-(--color-card-bg) py-16',
          className
        )}
      >
        <Inbox className="mb-3 h-12 w-12 text-(--color-text-muted)" />
        <p className="text-sm text-(--color-text-muted)">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-(--color-card-border)', className)}>
      <table className="w-full">
        <thead className={stickyHeader ? 'sticky top-0 z-10 shadow-sm' : ''}>
          <tr className="border-b border-(--color-border) bg-(--color-surface-hover)">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase',
                  col.sortable && 'cursor-pointer select-none hover:text-(--color-text)'
                )}
                style={{ width: col.width }}
                onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable &&
                    sortKey === String(col.key) &&
                    (sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'border-b border-(--color-border) bg-(--color-card-bg) transition-colors',
                rowIdx % 2 === 1 && 'bg-(--color-surface-hover)/50',
                'hover:bg-(--color-surface-hover)',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-(--color-text)">
                  {col.render ? col.render(getValue(row, String(col.key)), row) : String(getValue(row, String(col.key)) ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { Table, type Column, type TableProps }
