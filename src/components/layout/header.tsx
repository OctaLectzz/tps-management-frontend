import { Avatar } from '@/components/ui'
import { useTheme } from '@/hooks/use-theme'
import { useAuthStore } from '@/stores/auth.store'
import { Menu, Moon, Sun } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './language-switcher'
import { NotificationPanel } from './notification-panel'

interface HeaderProps {
  title: string
  description?: string
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ title, description, onMenuClick }) => {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-(--color-header-border) bg-(--color-header-bg) px-4 lg:px-6">
      {/* Left: Mobile menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-(--color-text-muted) hover:bg-(--color-surface-hover) lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-(--color-text)">{title}</h1>
          {description && <p className="hidden text-xs text-(--color-text-muted) sm:block">{description}</p>}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <LanguageSwitcher />

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-hover) hover:text-(--color-text)"
          aria-label={isDark ? t('theme.light') : t('theme.dark')}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Functional Notification Panel */}
        <NotificationPanel />

        <div className="ml-2 hidden items-center gap-2 border-l border-(--color-border) pl-3 sm:flex">
          <Avatar name={user?.name || 'User'} size="sm" />
          <span className="text-sm font-medium text-(--color-text)">{user?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  )
}

Header.displayName = 'Header'

export { Header }
