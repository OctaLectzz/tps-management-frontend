import { cn, getInitials, stringToColor } from '@/lib/utils'
import React from 'react'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  online?: boolean
  className?: string
}

const sizeStyles: Record<string, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg'
}

const dotSizes: Record<string, string> = {
  sm: 'h-2 w-2 border',
  md: 'h-2.5 w-2.5 border-2',
  lg: 'h-3 w-3 border-2'
}

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', online, className }) => {
  const initials = getInitials(name)
  const bgColor = stringToColor(name)

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img src={src} alt={name} className={cn('rounded-full object-cover', sizeStyles[size])} />
      ) : (
        <div
          className={cn('flex items-center justify-center rounded-full font-semibold text-white', sizeStyles[size])}
          style={{ backgroundColor: bgColor }}
          aria-label={name}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            'absolute right-0 bottom-0 rounded-full border-white dark:border-(--color-surface)',
            dotSizes[size],
            online ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  )
}

Avatar.displayName = 'Avatar'

export { Avatar, type AvatarProps }
