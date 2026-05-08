import { Button, Card, Input, Select, Spinner } from '@/components/ui'
import { usePollingStations } from '@/hooks/use-polling-stations'
import { useCreateVoteResult, useUpdateVoteResult } from '@/hooks/use-vote-results'
import type { VoteResult } from '@/types'
import { voteResultSchema, type VoteResultFormData } from '@/types/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface VoteResultFormProps {
  initialData?: VoteResult | null
  onSuccess?: () => void
  onCancel?: () => void
}

export const VoteResultForm: React.FC<VoteResultFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { t } = useTranslation()
  const { data: pollingStations, isLoading: isLoadingStations } = usePollingStations({ per_page: 1000 })

  const createMutation = useCreateVoteResult()
  const updateMutation = useUpdateVoteResult()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<VoteResultFormData>({
    resolver: zodResolver(voteResultSchema) as any,
    defaultValues: initialData
      ? {
          polling_station_id: initialData.polling_station.id,
          party_votes: initialData.party_votes,
          total_votes: initialData.total_votes,
          dpt: initialData.dpt,
          voters_present: initialData.voters_present
        }
      : {
          polling_station_id: 0,
          party_votes: 0,
          total_votes: 0,
          dpt: 0,
          voters_present: 0
        }
  })

  const selectedStationId = watch('polling_station_id')

  const onSubmit = async (data: VoteResultFormData) => {
    try {
      if (initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save vote result', error)
    }
  }

  const stationOptions =
    pollingStations?.data.map((ps) => ({
      value: String(ps.id),
      label: `TPS ${ps.station_number} - ${ps.venue_name} (${ps.district.name})`
    })) || []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card padding="lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-(--color-text)">{t('assignments.station')}</label>
            {isLoadingStations ? (
              <div className="flex items-center gap-2 text-sm text-(--color-text-muted)">
                <Spinner size="sm" /> {t('common.loading')}
              </div>
            ) : (
              <Select
                options={stationOptions}
                value={String(selectedStationId || '')}
                onChange={(val) => setValue('polling_station_id', Number(val), { shouldValidate: true })}
                placeholder={t('assignments.selectStation')}
                error={errors.polling_station_id?.message ? t(errors.polling_station_id.message as any) : undefined}
                searchable
              />
            )}
          </div>

          <Input
            label={t('voteResults.partyVotes')}
            type="number"
            {...register('party_votes')}
            error={errors.party_votes?.message ? t(errors.party_votes.message as any) : undefined}
          />

          <Input
            label={t('voteResults.totalVotes')}
            type="number"
            {...register('total_votes')}
            error={errors.total_votes?.message ? t(errors.total_votes.message as any) : undefined}
          />

          <Input
            label={t('voteResults.dpt')}
            type="number"
            {...register('dpt')}
            error={errors.dpt?.message ? t(errors.dpt.message as any) : undefined}
          />

          <Input
            label={t('voteResults.votersPresent')}
            type="number"
            {...register('voters_present')}
            error={errors.voters_present?.message ? t(errors.voters_present.message as any) : undefined}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  )
}
