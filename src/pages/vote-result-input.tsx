import { PageHeader } from '@/components/common/page-header'
import { useToast } from '@/components/ui'
import { VoteResultForm } from '@/components/vote-results/vote-result-form'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const VoteResultInputPage: React.FC = () => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSuccess = () => {
    toast({
      type: 'success',
      title: t('notifications.success'),
      message: t('voteResults.createSuccess')
    })
    navigate('/vote-results')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title={t('nav.inputVoteResult')} description={t('voteResults.description')} />

      <VoteResultForm onSuccess={handleSuccess} onCancel={() => navigate('/vote-results')} />
    </div>
  )
}

export default VoteResultInputPage
