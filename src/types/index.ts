/* ===== Enums/Constants ===== */
export const PollingStationStatus = {
  Active: 'active',
  Inactive: 'inactive',
  Review: 'review'
} as const
export type PollingStationStatus = (typeof PollingStationStatus)[keyof typeof PollingStationStatus]

export const OfficerRole = {
  Coordinator: 'coordinator',
  Kpps: 'kpps',
  Witness: 'witness',
  Observer: 'observer'
} as const
export type OfficerRole = (typeof OfficerRole)[keyof typeof OfficerRole]

export const OfficerStatus = {
  Active: 'active',
  Inactive: 'inactive'
} as const
export type OfficerStatus = (typeof OfficerStatus)[keyof typeof OfficerStatus]

export const ConfirmationStatus = {
  Confirmed: 'confirmed',
  Pending: 'pending',
  Absent: 'absent'
} as const
export type ConfirmationStatus = (typeof ConfirmationStatus)[keyof typeof ConfirmationStatus]

/* ===== Domain Models ===== */
export interface District {
  id: number
  code: string
  name: string
  geojson_key?: string
}

export interface Village {
  id: number
  district_id: number
  code: string
  name: string
}

export interface PollingStation {
  id: number
  station_number: number
  venue_name: string
  address: string
  district: {
    id: number
    name: string
  }
  village: {
    id: number
    name: string
  }
  status: PollingStationStatus
  latitude: number | null
  longitude: number | null
  notes: string | null
  officer_count?: number
  officers?: { id: number; name: string; phone: string; role: string }[]
  assignments?: Assignment[]
  vote_result?: VoteResult | null
  created_at: string
  updated_at: string
}

export interface Officer {
  id: number
  name: string
  phone: string
  email: string | null
  role: OfficerRole
  district: {
    id: number
    name: string
  }
  status: OfficerStatus
  assignments_count?: number
  created_at: string
}

export interface Assignment {
  id: number
  polling_station: {
    id: number
    station_number: number
    venue_name: string
  }
  officer: {
    id: number
    name: string
  }
  role: OfficerRole
  confirmation_status: ConfirmationStatus
  notes: string | null
  assigned_at: string
  confirmed_at: string | null
  created_at: string
}

export interface VoteResult {
  id: number
  polling_station: {
    id: number
    station_number: number
    venue_name: string
  }
  party_votes: number
  total_votes: number
  dpt: number
  voters_present: number
  submitter: {
    id: number
    name: string
  }
  submitted_at: string
  verified: boolean
  created_at: string
}

export interface DashboardStats {
  total_tps: number
  active_tps: number
  covered_tps: number
  total_officers: number
  assignment_completion_rate: number
  by_district: DistrictStats[]
}

export interface DistrictStats {
  name: string
  total: number
  covered: number
  officers: number
}

export interface VoteResultAggregation {
  district_id: number
  district_name: string
  total_stations: number
  stations_reported: number
  total_party_votes: number
  total_votes: number
  total_dpt: number
  total_voters_present: number
}

/* ===== Map Data ===== */
export interface MapMarker {
  id: number
  station_number: number
  venue_name: string
  address: string
  district_name: string
  village_name: string
  latitude: number
  longitude: number
  status: PollingStationStatus
  officer_count: number
}

/* ===== API Response Wrappers ===== */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

/* ===== Filter Types ===== */
export interface PollingStationFilters {
  district_id?: number
  village_id?: number
  status?: PollingStationStatus
  search?: string
  per_page?: number
  page?: number
}

export interface OfficerFilters {
  district_id?: number
  role?: OfficerRole
  status?: OfficerStatus
  search?: string
  per_page?: number
  page?: number
}

export interface AssignmentFilters {
  polling_station_id?: number
  officer_id?: number
  confirmation_status?: ConfirmationStatus
  per_page?: number
  page?: number
}

export interface VoteResultFilters {
  district_id?: number
  verified?: boolean
  per_page?: number
  page?: number
}

export interface MapDataFilters {
  district_id?: number
  status?: PollingStationStatus
}

/* ===== Import Result ===== */
export interface ImportResult {
  imported: number
  skipped: number
  errors: number
  details?: string[]
}

/* ===== User / Auth ===== */
export interface User {
  id: number
  name: string
  email: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}
