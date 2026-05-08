import type { ApiResponse, DashboardStats } from '@/types'
import api from './api'

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard')
    return data.data
  }
}
