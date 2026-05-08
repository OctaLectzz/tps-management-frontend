import { queryKeys } from '@/lib/query-keys'
import { assignmentService } from '@/services/assignment.service'
import type { AssignmentFilters } from '@/types'
import type { AssignmentFormData } from '@/types/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useAssignments(filters?: AssignmentFilters) {
  return useQuery({
    queryKey: queryKeys.assignments.list(filters),
    queryFn: () => assignmentService.getList(filters)
  })
}

export function useCreateAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AssignmentFormData) => assignmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.pollingStations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}

export function useConfirmAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => assignmentService.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => assignmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.pollingStations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}
