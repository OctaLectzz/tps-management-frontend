import type { ApiResponse, District, Village } from '@/types'
import api from './api'

export const regionService = {
  getDistricts: async (): Promise<District[]> => {
    const { data } = await api.get<ApiResponse<District[]>>('/districts')
    return data.data
  },

  getVillages: async (districtId?: number): Promise<Village[]> => {
    const { data } = await api.get<ApiResponse<Village[]>>('/villages', {
      params: districtId ? { district_id: districtId } : undefined
    })
    return data.data
  }
}
