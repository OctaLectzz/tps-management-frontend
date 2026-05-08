import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import { ClipboardList, Edit3, LayoutDashboard, LogOut, Map, MapPin, Users, Vote, X, Zap } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  path: string
  icon: any
  labelKey: string
}

interface NavCategory {
  titleKey: string
  items: NavItem[]
}

const categorizedNavItems: NavCategory[] = [
  {
    titleKey: 'nav.categories.main',
    items: [{ path: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' }]
  },
  {
    titleKey: 'nav.categories.data',
    items: [
      { path: '/polling-stations', icon: MapPin, labelKey: 'nav.pollingStations' },
      { path: '/officers', icon: Users, labelKey: 'nav.officers' },
      { path: '/assignments', icon: ClipboardList, labelKey: 'nav.assignments' },
      { path: '/vote-result-input', icon: Edit3, labelKey: 'nav.inputVoteResult' }
    ]
  },
  {
    titleKey: 'nav.categories.operations',
    items: [
      { path: '/vote-results', icon: Vote, labelKey: 'nav.voteResults' },
      { path: '/map', icon: Map, labelKey: 'nav.mapView' }
    ]
  }
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-screen w-[280px] flex-col border-r border-(--color-sidebar-border) bg-(--color-sidebar-bg) transition-transform duration-300 lg:z-30 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-(--color-border) px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E40AF]">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-(--color-text)">ELECTRA</h1>
              <p className="text-[10px] font-medium tracking-wider text-[#F59E0B] uppercase">PAN Sukoharjo</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-(--color-text-muted) hover:bg-(--color-surface-hover) lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="scrollbar-custom flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-6">
            {categorizedNavItems.map((category) => (
              <div key={category.titleKey} className="flex flex-col gap-1">
                <h2 className="px-3 text-[10px] font-bold tracking-wider text-(--color-text-muted) uppercase">{t(category.titleKey)}</h2>
                <div className="mt-1 flex flex-col gap-1">
                  {category.items.map((item) => {
                    const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'border-l-3 border-[#1E40AF] bg-[#1E40AF]/10 text-[#1E40AF] dark:border-[#3B82F6] dark:bg-[#3B82F6]/10 dark:text-[#3B82F6]'
                            : 'text-(--color-text-secondary) hover:bg-(--color-surface-hover) hover:text-(--color-text)'
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {t(item.labelKey)}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-(--color-border) p-4">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-(--color-text)">{user?.name || 'Administrator'}</p>
              <p className="truncate text-xs text-(--color-text-muted)">{user?.email || 'admin@electra.id'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-(--color-text-muted) transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              title={t('auth.logout')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

Sidebar.displayName = 'Sidebar'

export { Sidebar }
