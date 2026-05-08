import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './header'
import { Sidebar } from './sidebar'

const routeTitles: Record<string, { titleKey: string; descKey?: string }> = {
  '/': { titleKey: 'dashboard.title', descKey: 'dashboard.description' },
  '/polling-stations': { titleKey: 'pollingStations.title', descKey: 'pollingStations.description' },
  '/map': { titleKey: 'map.title', descKey: 'map.description' },
  '/officers': { titleKey: 'officers.title', descKey: 'officers.description' },
  '/assignments': { titleKey: 'assignments.title', descKey: 'assignments.description' },
  '/vote-results': { titleKey: 'voteResults.title', descKey: 'voteResults.description' }
}

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()

  const routeInfo = routeTitles[location.pathname] || { titleKey: 'common.appName' }

  return (
    <div className="flex h-screen overflow-hidden bg-(--color-bg)">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:ml-[280px]">
        <Header
          title={t(routeInfo.titleKey)}
          description={routeInfo.descKey ? t(routeInfo.descKey) : undefined}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="scrollbar-custom flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

DashboardLayout.displayName = 'DashboardLayout'

export { DashboardLayout }
