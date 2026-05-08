import { z } from 'zod'

/* ===== Polling Station Schema ===== */
export const pollingStationSchema = z.object({
  district_id: z.coerce.number({ message: 'validation.required' }).min(1, 'validation.required'),
  village_id: z.coerce.number({ message: 'validation.required' }).min(1, 'validation.required'),
  station_number: z.coerce.number({ message: 'validation.required' }).int('validation.integer').min(1, 'validation.minValue'),
  venue_name: z.string({ message: 'validation.required' }).min(1, 'validation.required').max(200, 'validation.maxLength'),
  address: z.string({ message: 'validation.required' }).min(1, 'validation.required'),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  status: z.enum(['active', 'inactive', 'review']),
  notes: z.string().optional().nullable()
})

export type PollingStationFormData = z.infer<typeof pollingStationSchema>

/* ===== Officer Schema ===== */
export const officerSchema = z.object({
  name: z.string({ message: 'validation.required' }).min(1, 'validation.required').max(255, 'validation.maxLength'),
  phone: z.string({ message: 'validation.required' }).min(1, 'validation.required').max(20, 'validation.maxLength'),
  email: z.string().email('validation.email').optional().nullable().or(z.literal('')),
  role: z.enum(['coordinator', 'kpps', 'witness', 'observer'], {
    message: 'validation.required'
  }),
  district_id: z.coerce.number().optional().nullable(),
  status: z.enum(['active', 'inactive'])
})

export type OfficerFormData = z.infer<typeof officerSchema>

/* ===== Assignment Schema ===== */
export const assignmentSchema = z.object({
  polling_station_id: z.coerce.number({ message: 'validation.required' }).min(1, 'validation.required'),
  officer_id: z.coerce.number({ message: 'validation.required' }).min(1, 'validation.required'),
  role: z.enum(['coordinator', 'kpps', 'witness', 'observer'], {
    message: 'validation.required'
  }),
  confirmation_status: z.enum(['confirmed', 'pending', 'absent']),
  notes: z.string().optional().nullable(),
  assigned_at: z.string({ message: 'validation.required' }).min(1, 'validation.required')
})

export type AssignmentFormData = z.infer<typeof assignmentSchema>

/* ===== Vote Result Schema ===== */
export const voteResultSchema = z.object({
  polling_station_id: z.coerce.number({ message: 'validation.required' }).min(1, 'validation.required'),
  party_votes: z.coerce.number({ message: 'validation.required' }).int().min(0, 'validation.minValue'),
  total_votes: z.coerce.number({ message: 'validation.required' }).int().min(0, 'validation.minValue'),
  dpt: z.coerce.number({ message: 'validation.required' }).int().min(0, 'validation.minValue'),
  voters_present: z.coerce.number({ message: 'validation.required' }).int().min(0, 'validation.minValue')
})

export type VoteResultFormData = z.infer<typeof voteResultSchema>

/* ===== Login Schema ===== */
export const loginSchema = z.object({
  email: z.string({ message: 'validation.required' }).min(1, 'validation.required').email('validation.email'),
  password: z.string({ message: 'validation.required' }).min(1, 'validation.required')
})

export type LoginFormData = z.infer<typeof loginSchema>
