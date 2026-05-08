import { Badge, Card, Checkbox, Spinner, Switch } from '@/components/ui'
import { useMapData } from '@/hooks/use-polling-stations'
import { useDistricts } from '@/hooks/use-regions'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

/* ===== Custom SVG marker icons ===== */
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

const greenIcon = createSvgIcon('#16A34A', '#15803D')
const redIcon = createSvgIcon('#DC2626', '#B91C1C')
const yellowIcon = createSvgIcon('#F59E0B', '#D97706')

const SUKOHARJO_CENTER: [number, number] = [-7.6855, 110.8419]

const MapViewPage: React.FC = () => {
  const { t } = useTranslation()
  const [showMarkers, setShowMarkers] = useState(true)
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([])
  const { data: markers, isLoading } = useMapData()
  const { data: districts } = useDistricts()

  const filteredMarkers =
    markers?.filter((m) => {
      if (selectedDistricts.length === 0) return true
      const district = districts?.find((d) => d.name === m.district_name)
      return district ? selectedDistricts.includes(district.id) : true
    }) || []

  const toggleDistrict = (id: number) => {
    setSelectedDistricts((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))
  }

  const getMarkerIcon = (officerCount: number, status: string) => {
    if (status === 'review') return yellowIcon
    if (officerCount > 0) return greenIcon
    return redIcon
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4">
      {/* Sidebar filters */}
      <Card padding="none" className="hidden w-72 shrink-0 overflow-y-auto lg:block">
        <div className="border-b border-(--color-border) px-4 py-3">
          <h3 className="text-sm font-semibold text-(--color-text)">{t('map.filters')}</h3>
        </div>

        <div className="space-y-4 p-4">
          <Switch checked={showMarkers} onChange={setShowMarkers} label={t('map.showMarkers')} />

          {/* District checkboxes */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">{t('pollingStations.district')}</p>
            <div className="space-y-1.5">
              {districts?.map((d) => (
                <Checkbox key={d.id} checked={selectedDistricts.includes(d.id)} onChange={() => toggleDistrict(d.id)} label={d.name} />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">{t('map.legend')}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-green-500" />
                <span className="text-sm text-(--color-text-secondary)">{t('map.hasOfficer')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-red-500" />
                <span className="text-sm text-(--color-text-secondary)">{t('map.noOfficer')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-amber-500" />
                <span className="text-sm text-(--color-text-secondary)">{t('map.underReview')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-(--color-border) px-4 py-3">
          <p className="text-xs text-(--color-text-muted)">
            {filteredMarkers.length} TPS {t('map.showMarkers').toLowerCase()}
          </p>
        </div>
      </Card>

      {/* Map */}
      <div className="flex-1 overflow-hidden rounded-xl border border-(--color-card-border)">
        <MapContainer center={SUKOHARJO_CENTER} zoom={12} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {showMarkers && (
            <MarkerClusterGroup chunkedLoading>
              {filteredMarkers.map((marker) => (
                <Marker key={marker.id} position={[marker.latitude, marker.longitude]} icon={getMarkerIcon(marker.officer_count, marker.status)}>
                  <Popup>
                    <div className="min-w-[200px]">
                      <h4 className="text-sm font-semibold">TPS {marker.station_number}</h4>
                      <p className="text-xs text-gray-600">
                        {marker.village_name}, {marker.district_name}
                      </p>
                      <p className="mt-1 text-xs">{marker.venue_name}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={marker.officer_count > 0 ? 'success' : 'danger'} size="sm">
                          {marker.officer_count} {t('pollingStations.officerCount')}
                        </Badge>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          )}
        </MapContainer>
      </div>
    </div>
  )
}

export default MapViewPage
