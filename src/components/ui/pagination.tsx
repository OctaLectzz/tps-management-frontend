import { Button } from '@/components/ui'
import { formatNumber } from '@/lib/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  onPageChange: (page: number) => void
  className?: string
  showSummary?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  className = '',
  showSummary = true
}) => {
  const { t } = useTranslation()

  if (total === 0) return null

  return (
    <div className={`flex items-center justify-between rounded-xl border border-(--color-card-border) bg-(--color-card-bg) px-4 py-3 ${className}`}>
      {showSummary && (
        <span className="text-sm text-(--color-text-muted)">
          {t('common.showing')} {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, total)} {t('common.of')} {formatNumber(total)}{' '}
          {t('common.results')}
        </span>
      )}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          {t('common.previous')}
        </Button>
        <Button variant="outline" size="sm" disabled={currentPage >= lastPage} onClick={() => onPageChange(currentPage + 1)}>
          {t('common.next')}
        </Button>
      </div>
    </div>
  )
}
