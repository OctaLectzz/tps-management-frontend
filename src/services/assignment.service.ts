import type { ApiResponse, Assignment, AssignmentFilters, PaginatedResponse } from '@/types'
import type { AssignmentFormData } from '@/types/schemas'
import api from './api'

export const assignmentService = {
  getList: async (filters?: AssignmentFilters): Promise<PaginatedResponse<Assignment>> => {
    const { data } = await api.get<PaginatedResponse<Assignment>>('/assignments', { params: filters })
    return data
  },

  getById: async (id: number): Promise<Assignment> => {
    const { data } = await api.get<ApiResponse<Assignment>>(`/assignments/${id}`)
    return data.data
  },

  create: async (payload: AssignmentFormData): Promise<Assignment> => {
    const { data } = await api.post<ApiResponse<Assignment>>('/assignments', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<AssignmentFormData>): Promise<Assignment> => {
    const { data } = await api.put<ApiResponse<Assignment>>(`/assignments/${id}`, payload)
    return data.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/assignments/${id}`)
  },

  confirm: async (id: number): Promise<Assignment> => {
    const { data } = await api.patch<ApiResponse<Assignment>>(`/assignments/${id}/confirm`)
    return data.data
  }
}
