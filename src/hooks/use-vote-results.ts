import { queryKeys } from '@/lib/query-keys'
import { voteResultService } from '@/services/vote-result.service'
import type { VoteResultFilters } from '@/types'
import type { VoteResultFormData } from '@/types/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useVoteResults(filters?: VoteResultFilters) {
  return useQuery({
    queryKey: queryKeys.voteResults.list(filters),
    queryFn: () => voteResultService.getList(filters)
  })
}

export function useVoteResultAggregation() {
  return useQuery({
    queryKey: queryKeys.voteResults.aggregation(),
    queryFn: voteResultService.getAggregation
  })
}

export function useCreateVoteResult() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: VoteResultFormData) => voteResultService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.voteResults.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    }
  })
}

export function useUpdateVoteResult() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VoteResultFormData> }) => voteResultService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.voteResults.all })
    }
  })
}
