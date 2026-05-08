import { Button, Input, Select, Textarea, useToast } from '@/components/ui'
import { useCreatePollingStation, useUpdatePollingStation } from '@/hooks/use-polling-stations'
import { useDistricts, useVillages } from '@/hooks/use-regions'
import type { PollingStation } from '@/types'
import { pollingStationSchema, type PollingStationFormData } from '@/types/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MapPicker } from './map-picker'

interface PollingStationFormProps {
  station?: PollingStation | null
  onSuccess: () => void
  onCancel: () => void
}

const PollingStationForm: React.FC<PollingStationFormProps> = ({ station, onSuccess, onCancel }) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const createMutation = useCreatePollingStation()
  const updateMutation = useUpdatePollingStation()
  const { data: districts } = useDistricts()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PollingStationFormData>({
    resolver: zodResolver(pollingStationSchema) as any,
    defaultValues: station
      ? {
          district_id: station.district.id,
          village_id: station.village.id,
          station_number: station.station_number,
          venue_name: station.venue_name,
          address: station.address,
          latitude: station.latitude,
          longitude: station.longitude,
          status: station.status,
          notes: station.notes
        }
      : { status: 'active' }
  })

  const watchDistrictId = watch('district_id')
  const watchLat = watch('latitude')
  const watchLng = watch('longitude')
  const { data: villages } = useVillages(watchDistrictId)

  const districtOptions = districts?.map((d) => ({ value: String(d.id), label: d.name })) || []
  const villageOptions = villages?.map((v) => ({ value: String(v.id), label: v.name })) || []
  const statusOptions = [
    { value: 'active', label: t('status.active') },
    { value: 'inactive', label: t('status.inactive') },
    { value: 'review', label: t('status.review') }
  ]

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onSubmit = async (data: PollingStationFormData) => {
    try {
      if (station) {
        await updateMutation.mutateAsync({ id: station.id, data })
        toast({ type: 'success', title: t('pollingStations.updateSuccess') })
      } else {
        await createMutation.mutateAsync(data)
        toast({ type: 'success', title: t('pollingStations.createSuccess') })
      }
      onSuccess()
    } catch {
      toast({ type: 'error', title: t('notifications.error'), message: t('notifications.unexpectedError') })
    }
  }

  const handleLocationChange = (lat: number, lng: number) => {
    setValue('latitude', lat)
    setValue('longitude', lng)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label={t('pollingStations.district')}
          options={districtOptions}
          value={String(watchDistrictId || '')}
          onChange={(v) => {
            setValue('district_id', Number(v))
            setValue('village_id', 0)
          }}
          error={errors.district_id?.message ? t(errors.district_id.message) : undefined}
          searchable
        />
        <Select
          label={t('pollingStations.village')}
          options={villageOptions}
          value={String(watch('village_id') || '')}
          onChange={(v) => setValue('village_id', Number(v))}
          error={errors.village_id?.message ? t(errors.village_id.message) : undefined}
          disabled={!watchDistrictId}
          searchable
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={t('pollingStations.stationNumber')}
          type="number"
          error={errors.station_number?.message ? t(errors.station_number.message) : undefined}
          {...register('station_number')}
        />
        <Input
          label={t('pollingStations.venueName')}
          error={errors.venue_name?.message ? t(errors.venue_name.message) : undefined}
          {...register('venue_name')}
        />
      </div>

      <Textarea
        label={t('pollingStations.address')}
        error={errors.address?.message ? t(errors.address.message) : undefined}
        {...register('address')}
      />

      {/* Leaflet Map Picker for coordinates */}
      <MapPicker latitude={watchLat} longitude={watchLng} onChange={handleLocationChange} height="220px" />

      <Select
        label={t('common.status')}
        options={statusOptions}
        value={watch('status') || 'active'}
        onChange={(v) => setValue('status', v as 'active' | 'inactive' | 'review')}
      />

      <Textarea label={t('pollingStations.notes')} {...register('notes')} />

      <div className="flex justify-end gap-3 border-t border-(--color-border) pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  )
}

PollingStationForm.displayName = 'PollingStationForm'

export { PollingStationForm }
