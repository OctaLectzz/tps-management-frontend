import type { ApiResponse, ImportResult, MapDataFilters, MapMarker, PaginatedResponse, PollingStation, PollingStationFilters } from '@/types'
import type { PollingStationFormData } from '@/types/schemas'
import api from './api'

export const pollingStationService = {
  getList: async (filters?: PollingStationFilters): Promise<PaginatedResponse<PollingStation>> => {
    const { data } = await api.get<PaginatedResponse<PollingStation>>('/polling-stations', {
      params: filters
    })
    return data
  },

  getById: async (id: number): Promise<PollingStation> => {
    const { data } = await api.get<ApiResponse<PollingStation>>(`/polling-stations/${id}`)
    return data.data
  },

  create: async (payload: PollingStationFormData): Promise<PollingStation> => {
    const { data } = await api.post<ApiResponse<PollingStation>>('/polling-stations', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<PollingStationFormData>): Promise<PollingStation> => {
    const { data } = await api.put<ApiResponse<PollingStation>>(`/polling-stations/${id}`, payload)
    return data.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/polling-stations/${id}`)
  },

  import: async (file: File): Promise<ImportResult> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<ApiResponse<ImportResult>>('/polling-stations/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data.data
  },

  getMapData: async (filters?: MapDataFilters): Promise<MapMarker[]> => {
    const { data } = await api.get<ApiResponse<MapMarker[]>>('/polling-stations/map-data', {
      params: filters
    })
    return data.data
  },

  export: async (filters?: PollingStationFilters): Promise<Blob> => {
    const { data } = await api.get('/polling-stations/export', {
      params: filters,
      responseType: 'blob'
    })
    return data
  }
}
