import { PageHeader } from '@/components/common/page-header'
import { StatusBadge } from '@/components/common/status-badge'
import { ImportModal } from '@/components/polling-stations/import-modal'
import { PollingStationDetail } from '@/components/polling-stations/polling-station-detail'
import { PollingStationForm } from '@/components/polling-stations/polling-station-form'
import { Button, ConfirmModal, Input, Modal, Select, Table, useToast, type Column } from '@/components/ui'
import { ActionButton, ActionGroup } from '@/components/ui/action-button'
import { useDeletePollingStation, usePollingStations } from '@/hooks/use-polling-stations'
import { useDistricts, useVillages } from '@/hooks/use-regions'
import { formatNumber } from '@/lib/utils'
import type { PollingStation, PollingStationFilters } from '@/types'
import { Download, Eye, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PollingStationManagementPage: React.FC = () => {
  const { t } = useTranslation()
  const { toast } = useToast()

  const [filters, setFilters] = useState<PollingStationFilters>({ per_page: 15, page: 1 })
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingStation, setEditingStation] = useState<PollingStation | null>(null)
  const [viewingStation, setViewingStation] = useState<PollingStation | null>(null)
  const [deletingStation, setDeletingStation] = useState<PollingStation | null>(null)
  const [showImport, setShowImport] = useState(false)

  const { data, isLoading } = usePollingStations({ ...filters, search: search || undefined })
  const { data: districts } = useDistricts()
  const { data: villages } = useVillages(filters.district_id)
  const deleteMutation = useDeletePollingStation()

  const handleExport = () => {
    if (!data?.data) return

    // Create CSV content
    const headers = ['Station Number', 'District', 'Village', 'Venue Name', 'Address', 'Status', 'Latitude', 'Longitude', 'Officers Count']
    const rows = data.data.map((row) => [
      `TPS ${row.station_number}`,
      row.district.name,
      row.village.name,
      `"${row.venue_name || ''}"`, // wrap in quotes in case of commas
      `"${row.address || ''}"`,
      row.status,
      row.latitude || '',
      row.longitude || '',
      row.officer_count || 0
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `tps_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({ type: 'success', title: 'Export Successful', message: 'Data exported as CSV' })
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setFilters((prev) => ({ ...prev, page: 1 }))
  }

  const handleDelete = async () => {
    if (!deletingStation) return
    try {
      await deleteMutation.mutateAsync(deletingStation.id)
      toast({ type: 'success', title: t('pollingStations.deleteSuccess') })
      setDeletingStation(null)
    } catch {
      toast({ type: 'error', title: t('notifications.error'), message: t('notifications.unexpectedError') })
    }
  }

  const columns: Column<PollingStation>[] = [
    {
      key: 'station_number',
      header: '#',
      width: '70px',
      sortable: true,
      render: (val) => <span className="font-semibold">TPS {String(val)}</span>
    },
    {
      key: 'district.name',
      header: t('pollingStations.district'),
      sortable: true
    },
    {
      key: 'village.name',
      header: t('pollingStations.village'),
      sortable: true
    },
    {
      key: 'venue_name',
      header: t('pollingStations.venueName'),
      sortable: true
    },
    {
      key: 'status',
      header: t('common.status'),
      width: '130px',
      render: (val) => <StatusBadge status={String(val)} type="station" />
    },
    {
      key: 'officer_count',
      header: t('pollingStations.officerCount'),
      width: '100px',
      render: (val) => (
        <span className={`font-medium ${Number(val) === 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>{String(val ?? 0)}</span>
      )
    },
    {
      key: 'actions',
      header: t('common.actions'),
      width: '130px',
      render: (_, row) => (
        <ActionGroup>
          <ActionButton icon={Eye} label={t('common.view')} onClick={() => setViewingStation(row)} />
          <ActionButton
            icon={Pencil}
            label={t('common.edit')}
            onClick={() => {
              setEditingStation(row)
              setShowForm(true)
            }}
          />
          <ActionButton icon={Trash2} label={t('common.delete')} variant="danger" onClick={() => setDeletingStation(row)} />
        </ActionGroup>
      )
    }
  ]

  const districtOptions = [
    { value: '', label: t('pollingStations.allDistricts') },
    ...(districts?.map((d) => ({ value: String(d.id), label: d.name })) || [])
  ]

  const villageOptions = [
    { value: '', label: t('pollingStations.allVillages') },
    ...(villages?.map((v) => ({ value: String(v.id), label: v.name })) || [])
  ]

  const statusOptions = [
    { value: '', label: t('pollingStations.allStatuses') },
    { value: 'active', label: t('status.active') },
    { value: 'inactive', label: t('status.inactive') },
    { value: 'review', label: t('status.review') }
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('pollingStations.title')}
        description={t('pollingStations.description')}
        actions={
          <>
            <Button variant="outline" icon={<Download className="h-4 w-4" />} size="sm" onClick={handleExport}>
              {t('pollingStations.exportXls')}
            </Button>
            <Button variant="secondary" icon={<Upload className="h-4 w-4" />} size="sm" onClick={() => setShowImport(true)}>
              {t('pollingStations.importXls')}
            </Button>
            <Button
              icon={<Plus className="h-4 w-4" />}
              size="sm"
              onClick={() => {
                setEditingStation(null)
                setShowForm(true)
              }}
            >
              {t('pollingStations.addStation')}
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-(--color-card-border) bg-(--color-card-bg) p-4">
        <div className="w-48">
          <Select
            options={districtOptions}
            value={String(filters.district_id || '')}
            onChange={(v) => setFilters((prev) => ({ ...prev, district_id: v ? Number(v) : undefined, village_id: undefined, page: 1 }))}
            placeholder={t('pollingStations.selectDistrict')}
            searchable
          />
        </div>
        <div className="w-48">
          <Select
            options={villageOptions}
            value={String(filters.village_id || '')}
            onChange={(v) => setFilters((prev) => ({ ...prev, village_id: v ? Number(v) : undefined, page: 1 }))}
            placeholder={t('pollingStations.selectVillage')}
            disabled={!filters.district_id}
            searchable
          />
        </div>
        <div className="w-40">
          <Select
            options={statusOptions}
            value={filters.status || ''}
            onChange={(v) => setFilters((prev) => ({ ...prev, status: v ? (v as PollingStationFilters['status']) : undefined, page: 1 }))}
            placeholder={t('pollingStations.selectStatus')}
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input
            placeholder={`${t('common.search')}...`}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Table */}
      <Table columns={columns as any} data={(data?.data || []) as any} loading={isLoading} emptyMessage={t('common.noData')} stickyHeader />

      {/* Pagination */}
      {data?.meta && (
        <div className="flex items-center justify-between rounded-xl border border-(--color-card-border) bg-(--color-card-bg) px-4 py-3">
          <span className="text-sm text-(--color-text-muted)">
            {t('common.showing')} {(data.meta.current_page - 1) * data.meta.per_page + 1}-
            {Math.min(data.meta.current_page * data.meta.per_page, data.meta.total)} {t('common.of')} {formatNumber(data.meta.total)}{' '}
            {t('common.results')}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.current_page <= 1}
              onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
            >
              {t('common.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.current_page >= data.meta.last_page}
              onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Detail/Show Modal */}
      <PollingStationDetail station={viewingStation} open={!!viewingStation} onClose={() => setViewingStation(null)} />

      {/* Create/Edit Modal */}
      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingStation(null)
        }}
        title={editingStation ? t('pollingStations.editStation') : t('pollingStations.addStation')}
        size="lg"
      >
        <PollingStationForm
          station={editingStation}
          onSuccess={() => {
            setShowForm(false)
            setEditingStation(null)
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingStation(null)
          }}
        />
      </Modal>

      {/* Import Modal */}
      <ImportModal open={showImport} onClose={() => setShowImport(false)} />

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deletingStation}
        onClose={() => setDeletingStation(null)}
        onConfirm={handleDelete}
        title={t('pollingStations.deleteStation')}
        message={t('pollingStations.deleteWarning')}
        variant="danger"
        confirmLabel={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default PollingStationManagementPage
