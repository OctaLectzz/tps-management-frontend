import { queryKeys } from '@/lib/query-keys'
import { dashboardService } from '@/services/dashboard.service'
import { useQuery } from '@tanstack/react-query'

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: dashboardService.getStats,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000
  })
}
