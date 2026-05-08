import { queryKeys } from '@/lib/query-keys'
import { pollingStationService } from '@/services/polling-station.service'
import type { MapDataFilters, PollingStationFilters } from '@/types'
import type { PollingStationFormData } from '@/types/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function usePollingStations(filters?: PollingStationFilters) {
  return useQuery({
    queryKey: queryKeys.pollingStations.list(filters),
    queryFn: () => pollingStationService.getList(filters)
  })
}

export function usePollingStation(id: number) {
  return useQuery({
    queryKey: queryKeys.pollingStations.detail(id),
    queryFn: () => pollingStationService.getById(id),
    enabled: id > 0
  })
}

export function useCreatePollingStation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PollingStationFormData) => pollingStationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pollingStations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}

export function useUpdatePollingStation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PollingStationFormData> }) => pollingStationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pollingStations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}

export function useDeletePollingStation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => pollingStationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pollingStations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}

export function useImportPollingStations() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => pollingStationService.import(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pollingStations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}

export function useMapData(filters?: MapDataFilters) {
  return useQuery({
    queryKey: queryKeys.pollingStations.mapData(filters),
    queryFn: () => pollingStationService.getMapData(filters)
  })
}

export function useExportPollingStations() {
  return useMutation({
    mutationFn: (filters?: PollingStationFilters) => pollingStationService.export(filters)
  })
}
