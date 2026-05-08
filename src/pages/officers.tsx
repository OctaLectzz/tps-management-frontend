import { PageHeader } from '@/components/common/page-header'
import { RoleBadge, StatusBadge } from '@/components/common/status-badge'
import { Button, ConfirmModal, Input, Modal, Select, Table, useToast, type Column } from '@/components/ui'
import { ActionButton, ActionGroup } from '@/components/ui/action-button'
import { useCreateOfficer, useDeleteOfficer, useOfficers, useUpdateOfficer } from '@/hooks/use-officers'
import { useDistricts } from '@/hooks/use-regions'
import type { Officer, OfficerFilters } from '@/types'
import { officerSchema, type OfficerFormData } from '@/types/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const OfficersPage: React.FC = () => {
  const { t } = useTranslation()
  const { toast } = useToast()

  const [filters, setFilters] = useState<OfficerFilters>({ per_page: 15, page: 1 })
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null)
  const [deletingOfficer, setDeletingOfficer] = useState<Officer | null>(null)

  const { data, isLoading } = useOfficers({ ...filters, search: search || undefined })
  const { data: districts } = useDistricts()
  const createMutation = useCreateOfficer()
  const updateMutation = useUpdateOfficer()
  const deleteMutation = useDeleteOfficer()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<OfficerFormData>({
    resolver: zodResolver(officerSchema) as any
  })

  const openCreate = () => {
    reset({ status: 'active' })
    setEditingOfficer(null)
    setShowForm(true)
  }

  const openEdit = (officer: Officer) => {
    reset({
      name: officer.name,
      phone: officer.phone,
      email: officer.email || '',
      role: officer.role,
      district_id: officer.district?.id,
      status: officer.status
    })
    setEditingOfficer(officer)
    setShowForm(true)
  }

  const onSubmit = async (data: OfficerFormData) => {
    try {
      if (editingOfficer) {
        await updateMutation.mutateAsync({ id: editingOfficer.id, data })
        toast({ type: 'success', title: t('officers.updateSuccess') })
      } else {
        await createMutation.mutateAsync(data)
        toast({ type: 'success', title: t('officers.createSuccess') })
      }
      setShowForm(false)
    } catch {
      toast({ type: 'error', title: t('notifications.error'), message: t('notifications.unexpectedError') })
    }
  }

  const handleDelete = async () => {
    if (!deletingOfficer) return
    try {
      await deleteMutation.mutateAsync(deletingOfficer.id)
      toast({ type: 'success', title: t('officers.deleteSuccess') })
      setDeletingOfficer(null)
    } catch {
      toast({ type: 'error', title: t('notifications.error') })
    }
  }

  const columns: Column<Officer>[] = [
    { key: 'name', header: t('officers.name'), sortable: true },
    { key: 'phone', header: t('officers.phone') },
    { key: 'role', header: t('officers.role'), width: '120px', render: (val) => <RoleBadge role={String(val)} /> },
    { key: 'district.name', header: t('officers.district'), sortable: true },
    { key: 'status', header: t('common.status'), width: '120px', render: (val) => <StatusBadge status={String(val)} type="officer" /> },
    {
      key: 'assignments_count',
      header: t('officers.assignmentsCount'),
      width: '110px',
      render: (val) => <span className="font-medium">{String(val ?? 0)}</span>
    },
    {
      key: 'actions',
      header: t('common.actions'),
      width: '100px',
      render: (_, row) => (
        <ActionGroup>
          <ActionButton icon={Pencil} label={t('common.edit')} onClick={() => openEdit(row)} />
          <ActionButton icon={Trash2} label={t('common.delete')} variant="danger" onClick={() => setDeletingOfficer(row)} />
        </ActionGroup>
      )
    }
  ]

  const districtOptions = [
    { value: '', label: t('pollingStations.allDistricts') },
    ...(districts?.map((d) => ({ value: String(d.id), label: d.name })) || [])
  ]
  const roleOptions = [
    { value: '', label: t('officers.allRoles') },
    { value: 'coordinator', label: t('roles.coordinator') },
    { value: 'kpps', label: t('roles.kpps') },
    { value: 'witness', label: t('roles.witness') },
    { value: 'observer', label: t('roles.observer') }
  ]

  const Input_ = Input

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('officers.title')}
        description={t('officers.description')}
        actions={
          <Button icon={<Plus className="h-4 w-4" />} size="sm" onClick={openCreate}>
            {t('officers.addOfficer')}
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-(--color-card-border) bg-(--color-card-bg) p-4">
        <div className="w-44">
          <Select
            options={districtOptions}
            value={String(filters.district_id || '')}
            onChange={(v) => setFilters((prev) => ({ ...prev, district_id: v ? Number(v) : undefined, page: 1 }))}
            placeholder={t('pollingStations.selectDistrict')}
            searchable
          />
        </div>
        <div className="w-40">
          <Select
            options={roleOptions}
            value={filters.role || ''}
            onChange={(v) => setFilters((prev) => ({ ...prev, role: v ? (v as OfficerFilters['role']) : undefined, page: 1 }))}
            placeholder={t('officers.selectRole')}
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <Input_
            placeholder={`${t('common.search')}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <Table columns={columns as any} data={(data?.data || []) as any} loading={isLoading} emptyMessage={t('common.noData')} stickyHeader />

      {/* Pagination */}
      {data?.meta && data.meta.last_page > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-(--color-card-border) bg-(--color-card-bg) px-4 py-3">
          <span className="text-sm text-(--color-text-muted)">
            {t('common.page')} {data.meta.current_page} / {data.meta.last_page}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.current_page <= 1}
              onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) - 1 }))}
            >
              {t('common.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.current_page >= data.meta.last_page}
              onClick={() => setFilters((p) => ({ ...p, page: (p.page || 1) + 1 }))}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingOfficer ? t('officers.editOfficer') : t('officers.addOfficer')}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col gap-4">
          <Input label={t('officers.name')} error={errors.name?.message ? t(errors.name.message) : undefined} {...register('name')} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label={t('officers.phone')} error={errors.phone?.message ? t(errors.phone.message) : undefined} {...register('phone')} />
            <Input label={t('officers.email')} type="email" {...register('email')} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label={t('officers.role')}
              options={roleOptions.slice(1)}
              value={watch('role') || ''}
              onChange={(v) => setValue('role', v as OfficerFormData['role'])}
              error={errors.role?.message ? t(errors.role.message) : undefined}
            />
            <Select
              label={t('officers.district')}
              options={districtOptions.slice(1)}
              value={String(watch('district_id') || '')}
              onChange={(v) => setValue('district_id', v ? Number(v) : null)}
              searchable
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-(--color-border) pt-4">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deletingOfficer}
        onClose={() => setDeletingOfficer(null)}
        onConfirm={handleDelete}
        title={t('officers.deleteOfficer')}
        message={t('officers.deleteWarning')}
        variant="danger"
        confirmLabel={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default OfficersPage
