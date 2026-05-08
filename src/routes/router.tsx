import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuthStore } from '@/stores/auth.store'
import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Lazy-loaded pages
const LoginPage = React.lazy(() => import('@/pages/login'))
const DashboardPage = React.lazy(() => import('@/pages/dashboard'))
const PollingStationManagementPage = React.lazy(() => import('@/pages/polling-station-management'))
const MapViewPage = React.lazy(() => import('@/pages/map-view'))
const OfficersPage = React.lazy(() => import('@/pages/officers'))
const AssignmentsPage = React.lazy(() => import('@/pages/assignments'))
const VoteResultsPage = React.lazy(() => import('@/pages/vote-results'))
const VoteResultInputPage = React.lazy(() => import('@/pages/vote-result-input'))

// Auth guard component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

// Suspense wrapper
function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#1E40AF]/30 border-t-[#1E40AF]" />
        </div>
      }
    >
      {children}
    </React.Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <SuspenseWrap>
          <LoginPage />
        </SuspenseWrap>
      </PublicRoute>
    )
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrap>
            <DashboardPage />
          </SuspenseWrap>
        )
      },
      {
        path: 'polling-stations',
        element: (
          <SuspenseWrap>
            <PollingStationManagementPage />
          </SuspenseWrap>
        )
      },
      {
        path: 'map',
        element: (
          <SuspenseWrap>
            <MapViewPage />
          </SuspenseWrap>
        )
      },
      {
        path: 'officers',
        element: (
          <SuspenseWrap>
            <OfficersPage />
          </SuspenseWrap>
        )
      },
      {
        path: 'assignments',
        element: (
          <SuspenseWrap>
            <AssignmentsPage />
          </SuspenseWrap>
        )
      },
      {
        path: 'vote-results',
        element: (
          <SuspenseWrap>
            <VoteResultsPage />
          </SuspenseWrap>
        )
      },
      {
        path: 'vote-result-input',
        element: (
          <SuspenseWrap>
            <VoteResultInputPage />
          </SuspenseWrap>
        )
      }
    ]
  }
])
