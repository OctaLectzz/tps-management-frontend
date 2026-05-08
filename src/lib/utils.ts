import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with locale-aware separators.
 */
export function formatNumber(value: number, locale: string = 'id-ID'): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format a date string to a readable locale format.
 */
export function formatDate(date: string | Date | null | undefined, locale: string = 'id-ID', options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  })
}

/**
 * Format a date string to a readable datetime format.
 */
export function formatDateTime(date: string | Date | null | undefined, locale: string = 'id-ID'): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Calculate percentage and return formatted string.
 */
export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

/**
 * Generate a consistent color from a string (for avatar backgrounds).
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = ['#1E40AF', '#7C3AED', '#059669', '#DC2626', '#D97706', '#2563EB', '#9333EA', '#0891B2', '#C2410C', '#4F46E5', '#0D9488', '#BE185D']
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Get initials from a name (max 2 characters).
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Debounce function.
 */
export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
