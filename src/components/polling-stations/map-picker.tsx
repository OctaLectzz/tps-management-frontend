import { cn } from '@/lib/utils'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Crosshair, MapPin } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'

// Fix default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

interface MapPickerProps {
  latitude?: number | null
  longitude?: number | null
  onChange: (lat: number, lng: number) => void
  className?: string
  height?: string
}

/* Inner component that handles map click events */
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

const SUKOHARJO_CENTER: [number, number] = [-7.6855, 110.8419]

const MapPicker: React.FC<MapPickerProps> = ({ latitude, longitude, onChange, className, height = '250px' }) => {
  const { t } = useTranslation()
  const [position, setPosition] = useState<[number, number] | null>(latitude && longitude ? [latitude, longitude] : null)

  // Sync external prop changes
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude])
    }
  }, [latitude, longitude])

  const handleClick = useCallback(
    (lat: number, lng: number) => {
      setPosition([lat, lng])
      onChange(lat, lng)
    },
    [onChange]
  )

  const center: [number, number] = position || SUKOHARJO_CENTER
  const zoom = position ? 16 : 12

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-sm font-medium text-(--color-text-secondary)">
          <MapPin className="h-4 w-4" />
          {t('pollingStations.pickLocation')}
        </label>
        {position && (
          <span className="font-mono text-xs text-(--color-text-muted)">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-(--color-border)" style={{ height }}>
        <MapContainer
          center={center}
          zoom={zoom}
          className="h-full w-full"
          scrollWheelZoom
          style={{ height: '100%', width: '100%', cursor: 'crosshair' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleClick} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>

      {!position && (
        <p className="flex items-center gap-1 text-xs text-(--color-text-muted)">
          <Crosshair className="h-3.5 w-3.5" />
          {t('pollingStations.clickToSetLocation')}
        </p>
      )}
    </div>
  )
}

MapPicker.displayName = 'MapPicker'

export { MapPicker, type MapPickerProps }
