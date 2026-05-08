import { cn } from '@/lib/utils'
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7'
}

const Card: React.FC<CardProps> = ({ children, className, padding = 'md', hover = false, clickable = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick?.()
            }
          : undefined
      }
      className={cn(
        'rounded-xl border border-(--color-card-border) bg-(--color-card-bg) transition-all duration-200',
        paddingStyles[padding],
        hover && 'hover:-translate-y-0.5 hover:shadow-md',
        clickable && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('border-b border-(--color-border) px-5 py-4', className)}>{children}</div>
)

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('px-5 py-4', className)}>{children}</div>
)

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('border-t border-(--color-border) px-5 py-4', className)}>{children}</div>
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardBody.displayName = 'CardBody'
CardFooter.displayName = 'CardFooter'

export { Card, CardBody, CardFooter, CardHeader, type CardProps }
