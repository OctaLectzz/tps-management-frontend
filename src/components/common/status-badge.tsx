import { Badge, type BadgeVariant } from '@/components/ui'
import { ConfirmationStatus, OfficerRole, OfficerStatus, PollingStationStatus } from '@/types'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface StatusBadgeProps {
  status: string
  type?: 'station' | 'officer' | 'assignment'
  className?: string
}

const stationVariants: Record<string, BadgeVariant> = {
  [PollingStationStatus.Active]: 'success',
  [PollingStationStatus.Inactive]: 'danger',
  [PollingStationStatus.Review]: 'warning'
}

const officerVariants: Record<string, BadgeVariant> = {
  [OfficerStatus.Active]: 'success',
  [OfficerStatus.Inactive]: 'danger'
}

const assignmentVariants: Record<string, BadgeVariant> = {
  [ConfirmationStatus.Confirmed]: 'success',
  [ConfirmationStatus.Pending]: 'warning',
  [ConfirmationStatus.Absent]: 'danger'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'station', className }) => {
  const { t } = useTranslation()

  let variant: BadgeVariant = 'default'
  if (type === 'station') variant = stationVariants[status] || 'default'
  else if (type === 'officer') variant = officerVariants[status] || 'default'
  else if (type === 'assignment') variant = assignmentVariants[status] || 'default'

  return (
    <Badge variant={variant} dot className={className}>
      {t(`status.${status}`)}
    </Badge>
  )
}

/* ===== Role Badge ===== */

interface RoleBadgeProps {
  role: string
  className?: string
}

const roleVariants: Record<string, BadgeVariant> = {
  [OfficerRole.Coordinator]: 'info',
  [OfficerRole.Kpps]: 'success',
  [OfficerRole.Witness]: 'warning',
  [OfficerRole.Observer]: 'default'
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className }) => {
  const { t } = useTranslation()

  return (
    <Badge variant={roleVariants[role] || 'default'} className={className}>
      {t(`roles.${role}`)}
    </Badge>
  )
}

StatusBadge.displayName = 'StatusBadge'
RoleBadge.displayName = 'RoleBadge'

export { RoleBadge, StatusBadge }
