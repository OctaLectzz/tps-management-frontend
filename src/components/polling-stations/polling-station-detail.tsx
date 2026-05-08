import { StatusBadge } from '@/components/common/status-badge'
import { Badge, Modal } from '@/components/ui'
import type { PollingStation } from '@/types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Building, FileText, MapPin, Navigation, Users } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

interface PollingStationDetailProps {
  station: PollingStation | null
  open: boolean
  onClose: () => void
}

// Marker icon
const createSvgIcon = (fillColor: string, strokeColor: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5"/>
    <circle cx="12" cy="11" r="5" fill="white" opacity="0.9"/>
  </svg>`
  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -36]
  })
}

const getMarkerIcon = (officerCount: number, status: string) => {
  if (status === 'review') return createSvgIcon('#F59E0B', '#D97706') // yellow
  if (officerCount > 0) return createSvgIcon('#16A34A', '#15803D') // green
  return createSvgIcon('#DC2626', '#B91C1C') // red
}

const PollingStationDetail: React.FC<PollingStationDetailProps> = ({ station, open, onClose }) => {
  const { t } = useTranslation()

  if (!station) return null

  const infoItems = [
    { icon: Building, label: t('pollingStations.district'), value: station.district?.name || '-' },
    { icon: MapPin, label: t('pollingStations.village'), value: station.village?.name || '-' },
    { icon: FileText, label: t('pollingStations.venueName'), value: station.venue_name || '-' },
    { icon: Navigation, label: t('pollingStations.address'), value: station.address || '-' }
  ]

  const hasCoordinates = station.latitude !== null && station.longitude !== null
  const position: [number, number] = hasCoordinates ? [station.latitude!, station.longitude!] : [-7.6855, 110.8419]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`TPS ${station.station_number}`}
      description={`${station.district?.name || ''} — ${station.village?.name || ''}`}
      size="lg"
    >
      <div className="scrollbar-custom flex max-h-[80vh] flex-col gap-5 overflow-y-auto pr-2">
        {/* Status + Officers Header */}
        <div className="flex items-center justify-between rounded-xl bg-(--color-surface-hover) p-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={station.status} type="station" />
            <span className="text-sm text-(--color-text-muted)">·</span>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-(--color-text-muted)" />
              <span className={`text-sm font-medium ${(station.officer_count ?? 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {station.officer_count ?? 0} {t('pollingStations.officerCount')}
              </span>
            </div>
          </div>
          {hasCoordinates && (
            <a
              href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E40AF]/10 px-3 py-1.5 text-xs font-medium text-[#1E40AF] transition-colors hover:bg-[#1E40AF]/20 dark:text-blue-400"
            >
              <Navigation className="h-3.5 w-3.5" />
              Google Maps
            </a>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {infoItems.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--color-surface-hover)">
                <item.icon className="h-4 w-4 text-(--color-text-muted)" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-(--color-text-muted)">{item.label}</p>
                <p className="mt-0.5 text-sm text-(--color-text)">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map View */}
        {hasCoordinates && (
          <div className="overflow-hidden rounded-xl border border-(--color-border)">
            <div className="border-b border-(--color-border) bg-(--color-surface-hover) px-4 py-2">
              <p className="flex items-center justify-between text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">
                <span>{t('pollingStations.coordinates')}</span>
                <span className="font-mono tracking-normal text-(--color-text) lowercase">
                  {station.latitude}, {station.longitude}
                </span>
              </p>
            </div>
            <div className="h-[200px] w-full">
              <MapContainer center={position} zoom={16} className="h-full w-full" scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={getMarkerIcon(station.officer_count ?? 0, station.status)} />
              </MapContainer>
            </div>
          </div>
        )}

        {/* Notes */}
        {station.notes && (
          <div className="rounded-xl border border-(--color-border) p-4">
            <p className="mb-2 text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">{t('pollingStations.notes')}</p>
            <p className="text-sm text-(--color-text-secondary)">{station.notes}</p>
          </div>
        )}

        {/* Officers list */}
        {station.officers && station.officers.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">{t('officers.title')}</p>
            <div className="space-y-2">
              {station.officers.map((officer) => (
                <div key={officer.id} className="flex items-center justify-between rounded-lg border border-(--color-border) p-3">
                  <div>
                    <p className="text-sm font-medium text-(--color-text)">{officer.name}</p>
                    <p className="text-xs text-(--color-text-muted)">{officer.phone}</p>
                  </div>
                  <Badge variant="info" size="sm">
                    {t(`roles.${officer.role}`)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="flex gap-6 border-t border-(--color-border) pt-4 text-xs text-(--color-text-muted)">
          <span>
            {t('common.createdAt')}: {station.created_at ? new Date(station.created_at).toLocaleDateString('id-ID') : '-'}
          </span>
          <span>
            {t('common.updatedAt')}: {station.updated_at ? new Date(station.updated_at).toLocaleDateString('id-ID') : '-'}
          </span>
        </div>
      </div>
    </Modal>
  )
}

PollingStationDetail.displayName = 'PollingStationDetail'

export { PollingStationDetail }
