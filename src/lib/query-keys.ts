import type { AssignmentFilters, MapDataFilters, OfficerFilters, PollingStationFilters, VoteResultFilters } from '@/types'

export const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const
  },
  pollingStations: {
    all: ['polling-stations'] as const,
    list: (filters?: PollingStationFilters) => [...queryKeys.pollingStations.all, 'list', filters] as const,
    detail: (id: number) => [...queryKeys.pollingStations.all, 'detail', id] as const,
    mapData: (filters?: MapDataFilters) => [...queryKeys.pollingStations.all, 'map-data', filters] as const
  },
  districts: {
    all: ['districts'] as const,
    list: () => [...queryKeys.districts.all, 'list'] as const
  },
  villages: {
    all: ['villages'] as const,
    list: (districtId?: number) => [...queryKeys.villages.all, 'list', districtId] as const
  },
  officers: {
    all: ['officers'] as const,
    list: (filters?: OfficerFilters) => [...queryKeys.officers.all, 'list', filters] as const,
    detail: (id: number) => [...queryKeys.officers.all, 'detail', id] as const
  },
  assignments: {
    all: ['assignments'] as const,
    list: (filters?: AssignmentFilters) => [...queryKeys.assignments.all, 'list', filters] as const,
    detail: (id: number) => [...queryKeys.assignments.all, 'detail', id] as const
  },
  voteResults: {
    all: ['vote-results'] as const,
    list: (filters?: VoteResultFilters) => [...queryKeys.voteResults.all, 'list', filters] as const,
    aggregation: () => [...queryKeys.voteResults.all, 'aggregation'] as const,
    detail: (id: number) => [...queryKeys.voteResults.all, 'detail', id] as const
  }
} as const
