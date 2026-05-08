import { queryKeys } from '@/lib/query-keys'
import { regionService } from '@/services/region.service'
import { useQuery } from '@tanstack/react-query'

export function useDistricts() {
  return useQuery({
    queryKey: queryKeys.districts.list(),
    queryFn: regionService.getDistricts,
    staleTime: 5 * 60 * 1000 // 5 minutes — districts rarely change
  })
}

export function useVillages(districtId?: number) {
  return useQuery({
    queryKey: queryKeys.villages.list(districtId),
    queryFn: () => regionService.getVillages(districtId),
    enabled: !!districtId,
    staleTime: 5 * 60 * 1000
  })
}
