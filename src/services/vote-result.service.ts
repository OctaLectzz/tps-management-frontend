import type { ApiResponse, PaginatedResponse, VoteResult, VoteResultAggregation, VoteResultFilters } from '@/types'
import type { VoteResultFormData } from '@/types/schemas'
import api from './api'

export const voteResultService = {
  getList: async (filters?: VoteResultFilters): Promise<PaginatedResponse<VoteResult>> => {
    const { data } = await api.get<PaginatedResponse<VoteResult>>('/vote-results', { params: filters })
    return data
  },

  getAggregation: async (): Promise<VoteResultAggregation[]> => {
    const { data } = await api.get<ApiResponse<VoteResultAggregation[]>>('/vote-results', {
      params: { aggregate: true }
    })
    return data.data
  },

  getById: async (id: number): Promise<VoteResult> => {
    const { data } = await api.get<ApiResponse<VoteResult>>(`/vote-results/${id}`)
    return data.data
  },

  create: async (payload: VoteResultFormData): Promise<VoteResult> => {
    const { data } = await api.post<ApiResponse<VoteResult>>('/vote-results', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<VoteResultFormData>): Promise<VoteResult> => {
    const { data } = await api.put<ApiResponse<VoteResult>>(`/vote-results/${id}`, payload)
    return data.data
  },

  verify: async (id: number): Promise<VoteResult> => {
    const { data } = await api.patch<ApiResponse<VoteResult>>(`/vote-results/${id}/verify`)
    return data.data
  }
}
