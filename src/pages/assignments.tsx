import { PageHeader } from '@/components/common/page-header'
import { RoleBadge, StatusBadge } from '@/components/common/status-badge'
import { Button, ConfirmModal, Input, Modal, Select, Table, useToast, type Column } from '@/components/ui'
import { ActionButton, ActionGroup } from '@/components/ui/action-button'
import { useAssignments, useConfirmAssignment, useCreateAssignment, useDeleteAssignment } from '@/hooks/use-assignments'
import type { Assignment, AssignmentFilters } from '@/types'
import { assignmentSchema, type AssignmentFormData } from '@/types/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const AssignmentsPage: React.FC = () => {
  const { t } = useTranslation()
  const { toast } = useToast()

  const [filters, setFilters] = useState<AssignmentFilters>({ per_page: 15, page: 1 })
  const [showForm, setShowForm] = useState(false)
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null)

  const { data, isLoading } = useAssignments(filters)
  const createMutation = useCreateAssignment()
  const confirmMutation = useConfirmAssignment()
  const deleteMutation = useDeleteAssignment()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema) as any,
    defaultValues: { confirmation_status: 'pending', assigned_at: new Date().toISOString().split('T')[0] }
  })

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      await createMutation.mutateAsync(data)
      toast({ type: 'success', title: t('assignments.createSuccess') })
      setShowForm(false)
      reset()
    } catch {
      toast({ type: 'error', title: t('notifications.error'), message: t('notifications.unexpectedError') })
    }
  }

  const handleConfirm = async (id: number) => {
    try {
      await confirmMutation.mutateAsync(id)
      toast({ type: 'success', title: t('assignments.confirmSuccess') })
    } catch {
      toast({ type: 'error', title: t('notifications.error') })
    }
  }

  const handleDelete = async () => {
    if (!deletingAssignment) return
    try {
      await deleteMutation.mutateAsync(deletingAssignment.id)
      toast({ type: 'success', title: t('assignments.deleteSuccess') })
      setDeletingAssignment(null)
    } catch {
      toast({ type: 'error', title: t('notifications.error') })
    }
  }

  const columns: Column<Assignment>[] = [
    {
      key: 'officer.name',
      header: t('assignments.officer'),
      sortable: true
    },
    {
      key: 'polling_station.station_number',
      header: t('assignments.station'),
      render: (val, row) => (
        <span className="font-medium">
          TPS {String(val)} — {row.polling_station.venue_name}
        </span>
      )
    },
    {
      key: 'role',
      header: t('assignments.role'),
      width: '120px',
      render: (val) => <RoleBadge role={String(val)} />
    },
    {
      key: 'confirmation_status',
      header: t('assignments.confirmationStatus'),
      width: '140px',
      render: (val) => <StatusBadge status={String(val)} type="assignment" />
    },
    {
      key: 'assigned_at',
      header: t('assignments.assignedAt'),
      width: '120px',
      render: (val) => <span className="text-(--color-text-muted)">{val ? new Date(String(val)).toLocaleDateString() : '-'}</span>
    },
    {
      key: 'actions',
      header: t('common.actions'),
      width: '100px',
      render: (_, row) => (
        <ActionGroup>
          {row.confirmation_status === 'pending' && (
            <ActionButton icon={CheckCircle} label={t('assignments.confirmAction')} variant="success" onClick={() => handleConfirm(row.id)} />
          )}
          <ActionButton icon={Trash2} label={t('common.delete')} variant="danger" onClick={() => setDeletingAssignment(row)} />
        </ActionGroup>
      )
    }
  ]

  const statusOptions = [
    { value: '', label: t('assignments.allStatuses') },
    { value: 'confirmed', label: t('status.confirmed') },
    { value: 'pending', label: t('status.pending') },
    { value: 'absent', label: t('status.absent') }
  ]

  const roleOptions = [
    { value: 'coordinator', label: t('roles.coordinator') },
    { value: 'kpps', label: t('roles.kpps') },
    { value: 'witness', label: t('roles.witness') },
    { value: 'observer', label: t('roles.observer') }
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('assignments.title')}
        description={t('assignments.description')}
        actions={
          <Button
            icon={<Plus className="h-4 w-4" />}
            size="sm"
            onClick={() => {
              reset()
              setShowForm(true)
            }}
          >
            {t('assignments.addAssignment')}
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-(--color-card-border) bg-(--color-card-bg) p-4">
        <div className="w-44">
          <Select
            options={statusOptions}
            value={filters.confirmation_status || ''}
            onChange={(v) =>
              setFilters((prev) => ({ ...prev, confirmation_status: v ? (v as AssignmentFilters['confirmation_status']) : undefined, page: 1 }))
            }
            placeholder={t('assignments.allStatuses')}
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

      {/* Create Assignment Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={t('assignments.addAssignment')} size="md">
        <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col gap-4">
          <Input
            label={`${t('assignments.station')} ID`}
            type="number"
            error={errors.polling_station_id?.message ? t(errors.polling_station_id.message) : undefined}
            {...register('polling_station_id')}
          />
          <Input
            label={`${t('assignments.officer')} ID`}
            type="number"
            error={errors.officer_id?.message ? t(errors.officer_id.message) : undefined}
            {...register('officer_id')}
          />
          <Select
            label={t('assignments.role')}
            options={roleOptions}
            value={watch('role') || ''}
            onChange={(v) => setValue('role', v as AssignmentFormData['role'])}
            error={errors.role?.message ? t(errors.role.message) : undefined}
          />
          <Input
            label={t('assignments.assignedAt')}
            type="date"
            error={errors.assigned_at?.message ? t(errors.assigned_at.message) : undefined}
            {...register('assigned_at')}
          />
          <div className="flex justify-end gap-3 border-t border-(--color-border) pt-4">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!deletingAssignment}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={handleDelete}
        title={t('assignments.deleteAssignment')}
        message={t('assignments.deleteConfirm')}
        variant="danger"
        confirmLabel={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default AssignmentsPage
