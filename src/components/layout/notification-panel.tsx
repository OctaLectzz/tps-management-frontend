import { cn } from '@/lib/utils'
import { useNotificationStore, type Notification } from '@/stores/notification.store'
import { AlertTriangle, Bell, CheckCheck, CheckCircle, Info, Trash2, X, XCircle } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
  success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950' }
}

const NotificationPanel: React.FC = () => {
  const { t } = useTranslation()
  const { notifications, unreadCount, isOpen, togglePanel, closePanel, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotificationStore()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closePanel()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closePanel])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return t('notifications.justNow')
    if (diffMins < 60) return `${diffMins}m`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell trigger */}
      <button
        onClick={togglePanel}
        className="relative rounded-lg p-2 text-(--color-text-secondary) transition-colors hover:bg-(--color-surface-hover) hover:text-(--color-text)"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="animate-slide-down absolute top-full right-0 z-9999 mt-2 w-80 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) shadow-xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-(--color-border) px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-(--color-text)">{t('notifications.title')}</h3>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1E40AF]/10 px-1.5 text-[10px] font-bold text-[#1E40AF] dark:text-blue-400">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    className="rounded-lg p-1.5 text-(--color-text-muted) hover:bg-(--color-surface-hover) hover:text-(--color-text)"
                    title={t('notifications.markAllRead')}
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                  <button
                    onClick={clearAll}
                    className="rounded-lg p-1.5 text-(--color-text-muted) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                    title={t('notifications.clearAll')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
              <button onClick={closePanel} className="rounded-lg p-1.5 text-(--color-text-muted) hover:bg-(--color-surface-hover)">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="scrollbar-custom max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <Bell className="mb-2 h-8 w-8 text-(--color-text-muted)" />
                <p className="text-sm text-(--color-text-muted)">{t('notifications.empty')}</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <NotificationItem key={notif.id} notification={notif} onRead={markAsRead} onRemove={removeNotification} formatTime={formatTime} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ===== Item ===== */
interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
  onRemove: (id: string) => void
  formatTime: (date: Date) => string
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead, onRemove, formatTime }) => {
  const config = typeConfig[notification.type] || typeConfig.info

  return (
    <div
      className={cn(
        'flex gap-3 border-b border-(--color-border) px-4 py-3 transition-colors last:border-0',
        !notification.read && 'bg-[#1E40AF]/5 dark:bg-[#3B82F6]/5',
        'cursor-pointer hover:bg-(--color-surface-hover)'
      )}
      onClick={() => onRead(notification.id)}
    >
      <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', config.bg)}>
        <config.icon className={cn('h-4 w-4', config.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm text-(--color-text)', !notification.read && 'font-medium')}>{notification.title}</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(notification.id)
            }}
            className="mt-0.5 shrink-0 rounded p-0.5 text-(--color-text-muted) hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        <p className="mt-0.5 text-xs text-(--color-text-muted)">{notification.message}</p>
        <p className="mt-1 text-[10px] text-(--color-text-muted)">{formatTime(notification.createdAt)}</p>
      </div>
      {!notification.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1E40AF] dark:bg-blue-400" />}
    </div>
  )
}

NotificationPanel.displayName = 'NotificationPanel'

export { NotificationPanel }
