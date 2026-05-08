import { queryKeys } from '@/lib/query-keys'
import { officerService } from '@/services/officer.service'
import type { OfficerFilters } from '@/types'
import type { OfficerFormData } from '@/types/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useOfficers(filters?: OfficerFilters) {
  return useQuery({
    queryKey: queryKeys.officers.list(filters),
    queryFn: () => officerService.getList(filters)
  })
}

export function useCreateOfficer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OfficerFormData) => officerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.officers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}

export function useUpdateOfficer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<OfficerFormData> }) => officerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.officers.all })
    }
  })
}

export function useDeleteOfficer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => officerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.officers.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}
