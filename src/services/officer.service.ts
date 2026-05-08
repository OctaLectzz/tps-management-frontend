import type { ApiResponse, Officer, OfficerFilters, PaginatedResponse } from '@/types'
import type { OfficerFormData } from '@/types/schemas'
import api from './api'

export const officerService = {
  getList: async (filters?: OfficerFilters): Promise<PaginatedResponse<Officer>> => {
    const { data } = await api.get<PaginatedResponse<Officer>>('/officers', { params: filters })
    return data
  },

  getById: async (id: number): Promise<Officer> => {
    const { data } = await api.get<ApiResponse<Officer>>(`/officers/${id}`)
    return data.data
  },

  create: async (payload: OfficerFormData): Promise<Officer> => {
    const { data } = await api.post<ApiResponse<Officer>>('/officers', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<OfficerFormData>): Promise<Officer> => {
    const { data } = await api.put<ApiResponse<Officer>>(`/officers/${id}`, payload)
    return data.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/officers/${id}`)
  }
}
