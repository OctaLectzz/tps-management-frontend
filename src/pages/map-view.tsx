import { Badge, Card, Input, MultiSelect, Pagination, Spinner, Switch } from '@/components/ui'
import { useMapData } from '@/hooks/use-polling-stations'
import { useDistricts } from '@/hooks/use-regions'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CheckCircle2, HelpCircle, Info, Landmark, MapPin, Search, Users2, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

/* ===== Map Controller for programmatic movements ===== */
const MapController: React.FC<{ center?: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap()
  useEffect(() => {
    if (center && typeof center[0] === 'number' && typeof center[1] === 'number') {
      map.flyTo(center, zoom || 16, { duration: 1.5 })
    }
  }, [center, zoom, map])
  return null
}

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

/* ===== Custom Cluster Icon ===== */
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount()
  let colorClass = 'bg-primary'
  if (count > 50) colorClass = 'bg-indigo-600'
  if (count > 100) colorClass = 'bg-slate-900'

  return L.divIcon({
    html: `<div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-xl ${colorClass} text-white text-xs font-black ring-4 ring-primary/20">
      ${count}
    </div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40)
  })
}

const greenIcon = createSvgIcon('#10B981', '#059669')
const redIcon = createSvgIcon('#EF4444', '#DC2626')
const yellowIcon = createSvgIcon('#F59E0B', '#D97706')

const SUKOHARJO_CENTER: [number, number] = [-7.6855, 110.8419]

const MapViewPage: React.FC = () => {
  const { t } = useTranslation()
  const [showMarkers, setShowMarkers] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined)
  const perPage = 12

  const { data: markers, isLoading } = useMapData()
  const { data: districts } = useDistricts()

  const districtOptions = React.useMemo(() => {
    return districts?.map((d) => ({ value: d.id, label: d.name })) || []
  }, [districts])

  const normalizedMarkers = React.useMemo(() => {
    return (
      markers?.map((m: any) => ({
        ...m,
        lat: typeof (m.lat || m.latitude) === 'string' ? parseFloat(m.lat || m.latitude) : m.lat || m.latitude,
        lng: typeof (m.lng || m.longitude) === 'string' ? parseFloat(m.lng || m.longitude) : m.lng || m.longitude,
        district_name: m.district || m.district_name,
        village_name: m.village || m.village_name
      })) || []
    )
  }, [markers])

  const filteredMarkers = normalizedMarkers.filter((m: any) => {
    if (isNaN(m.lat) || isNaN(m.lng) || m.lat === null || m.lng === null) return false

    if (selectedDistricts.length > 0) {
      const district = districts?.find((d) => d.name === m.district_name)
      if (!district || !selectedDistricts.includes(district.id)) return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return m.station_number.toString().includes(query) || m.venue_name.toLowerCase().includes(query) || m.village_name.toLowerCase().includes(query)
    }

    return true
  })

  const totalMarkers = filteredMarkers.length
  const lastPage = Math.ceil(totalMarkers / perPage)
  const paginatedMarkers = filteredMarkers.slice((currentPage - 1) * perPage, currentPage * perPage)

  const stats = {
    total: filteredMarkers.length,
    withOfficers: filteredMarkers.filter((m: any) => m.officer_count > 0).length,
    noOfficers: filteredMarkers.filter((m: any) => m.officer_count === 0).length,
    completion:
      filteredMarkers.length > 0 ? Math.round((filteredMarkers.filter((m: any) => m.officer_count > 0).length / filteredMarkers.length) * 100) : 0
  }

  const getMarkerIcon = (officerCount: number, status: string) => {
    if (status === 'review') return yellowIcon
    if (officerCount > 0) return greenIcon
    return redIcon
  }

  const flyToMarker = (marker: any) => {
    setMapCenter([marker.lat, marker.lng])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Summary Cards Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-primary bg-primary/5 dark:bg-primary/10 border-l-4">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary/10 rounded-full p-3">
              <Landmark className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-gray-500 uppercase dark:text-gray-400">{t('map.totalTps')}</p>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white">{stats.total}</h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/50">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-emerald-600 uppercase dark:text-emerald-400">{t('map.hasOfficer')}</p>
              <h3 className="text-2xl font-black text-emerald-800 dark:text-emerald-100">{stats.withOfficers}</h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-500 bg-rose-50 dark:bg-rose-950/20">
          <div className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-rose-100 p-3 dark:bg-rose-900/50">
              <XCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-rose-600 uppercase dark:text-rose-400">{t('map.noOfficer')}</p>
              <h3 className="text-2xl font-black text-rose-800 dark:text-rose-100">{stats.noOfficers}</h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/50">
              <Users2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-amber-600 uppercase dark:text-amber-400">{t('map.coverage')}</p>
              <h3 className="text-2xl font-black text-amber-800 dark:text-amber-100">{stats.completion}%</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Filters Section */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{t('common.search')}</label>
            <Input
              placeholder={t('map.searchPlaceholder')}
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="h-11 text-sm"
            />
          </div>

          <div className="w-full space-y-2 lg:w-96">
            <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{t('pollingStations.district')}</label>
            <MultiSelect
              options={districtOptions}
              value={selectedDistricts}
              onChange={(val) => {
                setSelectedDistricts(val as number[])
                setCurrentPage(1)
              }}
              placeholder={t('pollingStations.allDistricts')}
              className="w-full"
            />
          </div>

          <div className="flex h-11 items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/50 px-4 dark:border-gray-800 dark:bg-gray-900/50">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{t('map.showMarkers')}</span>
            <Switch checked={showMarkers} onChange={setShowMarkers} />
          </div>
        </div>
      </Card>

      {/* 3. Map Section */}
      <Card padding="none" className="h-[400px] overflow-hidden rounded-2xl border-2 border-white shadow-2xl md:h-[500px] dark:border-gray-800">
        <MapContainer center={SUKOHARJO_CENTER} zoom={12} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} />
          {showMarkers && (
            <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
              {filteredMarkers.map((marker: any) => (
                <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={getMarkerIcon(marker.officer_count, marker.status)}>
                  <Popup className="premium-popup">
                    <div className="w-[260px] overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
                      <div className={`p-4 ${marker.officer_count > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase opacity-80">TPS {marker.station_number}</span>
                          <Badge variant="outline" className="border-white/30 bg-white/20 text-white">
                            {marker.status}
                          </Badge>
                        </div>
                        <h4 className="mt-2 text-base leading-tight font-black">{marker.venue_name}</h4>
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex gap-2.5">
                          <MapPin className="text-primary h-4 w-4 shrink-0" />
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            {marker.village_name}, {marker.district_name}
                          </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-50 pt-3 dark:border-gray-800">
                          <div className="text-primary flex items-center gap-1.5 text-xs font-black">
                            <Users2 className="h-4 w-4" />
                            <span>
                              {marker.officer_count} {t('pollingStations.officerCount')}
                            </span>
                          </div>
                          <Badge variant={marker.officer_count > 0 ? 'success' : 'danger'}>
                            {marker.officer_count > 0 ? t('map.covered') : t('map.notCovered')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          )}
        </MapContainer>
      </Card>

      {/* 4. Bottom Grid (List & Guide) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* List Data */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black tracking-tight text-gray-800 dark:text-white">{t('map.filteredList')}</h3>
            <span className="text-xs font-bold text-gray-400">{totalMarkers} TPS</span>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {paginatedMarkers.map((m: any) => (
              <button
                key={m.id}
                onClick={() => flyToMarker(m)}
                className="group hover:border-primary flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/50"
              >
                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-white ${m.officer_count > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                >
                  {m.station_number}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-black text-gray-800 dark:text-white">{m.venue_name}</h4>
                  <p className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
                    {m.village_name}, {m.district_name}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] font-black text-gray-500 dark:text-gray-400">
                      <Users2 className="h-3 w-3" />
                      <span>
                        {m.officer_count} {t('pollingStations.officerCount')}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            total={totalMarkers}
            perPage={perPage}
            onPageChange={setCurrentPage}
            className="mt-4"
          />
        </div>

        {/* Guide & Tips */}
        <div className="space-y-4">
          <h3 className="px-2 text-lg font-black tracking-tight text-gray-800 dark:text-white">{t('map.guideTitle')}</h3>
          <Card className="to-primary bg-linear-to-br from-indigo-600 p-6 text-white">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/20 p-2">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase">{t('map.markerColor')}</h4>
                  <p className="mt-1 text-xs leading-relaxed opacity-80">{t('map.markerColorDesc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/20 p-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase">{t('map.quickNav')}</h4>
                  <p className="mt-1 text-xs leading-relaxed opacity-80">{t('map.quickNavDesc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/20 p-2">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase">{t('map.importantInfo')}</h4>
                  <p className="mt-1 text-xs leading-relaxed opacity-80">{t('map.importantInfoDesc')}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="text-[10px] font-black tracking-widest text-white/60 uppercase">{t('map.needHelp')}</p>
              <p className="mt-1 text-xs font-bold italic">{t('map.helpText')}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MapViewPage
