import { PageHeader } from '@/components/common/page-header'
import { Badge, Card, SkeletonCard, Spinner, Tabs } from '@/components/ui'
import { useVoteResultAggregation, useVoteResults } from '@/hooks/use-vote-results'
import { formatNumber } from '@/lib/utils'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const VoteResultsPage: React.FC = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('aggregated')

  const tabs = [
    { id: 'aggregated', label: t('voteResults.aggregatedView') },
    { id: 'detailed', label: t('voteResults.detailedView') }
  ]

  return (
    <div className="space-y-4">
      <PageHeader title={t('voteResults.title')} description={t('voteResults.description')} />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'aggregated' ? <AggregatedView /> : <DetailedView />}
    </div>
  )
}

/* ===== Aggregated View ===== */
const AggregatedView: React.FC = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useVoteResultAggregation()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <p className="text-(--color-text-muted)">{t('common.noData')}</p>
      </Card>
    )
  }

  const totalPartyVotes = data.reduce((sum, d) => sum + d.total_party_votes, 0)
  const totalAllVotes = data.reduce((sum, d) => sum + d.total_votes, 0)
  const totalDpt = data.reduce((sum, d) => sum + d.total_dpt, 0)
  const totalReported = data.reduce((sum, d) => sum + d.stations_reported, 0)
  const totalStations = data.reduce((sum, d) => sum + d.total_stations, 0)

  const chartData = data.map((d) => ({
    name: d.district_name.replace('Kecamatan ', '').replace('KEC. ', ''),
    panVotes: d.total_party_votes,
    otherVotes: d.total_votes - d.total_party_votes
  }))

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card padding="md">
          <p className="text-sm text-(--color-text-muted)">{t('voteResults.partyVotes')}</p>
          <p className="mt-1 text-2xl font-bold text-[#1E40AF] dark:text-blue-400">{formatNumber(totalPartyVotes)}</p>
          <p className="mt-0.5 text-xs text-(--color-text-muted)">
            {totalAllVotes > 0 ? ((totalPartyVotes / totalAllVotes) * 100).toFixed(1) : 0}% total
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-(--color-text-muted)">{t('voteResults.totalVotes')}</p>
          <p className="mt-1 text-2xl font-bold text-(--color-text)">{formatNumber(totalAllVotes)}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-(--color-text-muted)">{t('voteResults.dpt')}</p>
          <p className="mt-1 text-2xl font-bold text-(--color-text)">{formatNumber(totalDpt)}</p>
          <p className="mt-0.5 text-xs text-(--color-text-muted)">Turnout: {totalDpt > 0 ? ((totalAllVotes / totalDpt) * 100).toFixed(1) : 0}%</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-(--color-text-muted)">{t('voteResults.stationsReported')}</p>
          <p className="mt-1 text-2xl font-bold text-(--color-text)">
            {totalReported} / {totalStations}
          </p>
          <p className="mt-0.5 text-xs text-(--color-text-muted)">
            {totalStations > 0 ? ((totalReported / totalStations) * 100).toFixed(0) : 0}% reported
          </p>
        </Card>
      </div>

      {/* Chart */}
      <Card padding="none">
        <div className="border-b border-(--color-border) px-5 py-4">
          <h3 className="text-base font-semibold text-(--color-text)">
            {t('voteResults.partyVotes')} per {t('voteResults.districtName')}
          </h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
              />
              <Bar dataKey="panVotes" name="PAN Votes" fill="#1E40AF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="otherVotes" name="Other Votes" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* District table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--color-border) bg-(--color-surface-hover)">
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">
                  {t('voteResults.districtName')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">
                  {t('voteResults.stationsReported')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">
                  {t('voteResults.partyVotes')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">
                  {t('voteResults.totalVotes')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-(--color-text-muted) uppercase">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.district_id} className={`border-b border-(--color-border) ${i % 2 === 1 ? 'bg-(--color-surface-hover)/50' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-(--color-text)">{row.district_name}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    <Badge variant={row.stations_reported === row.total_stations ? 'success' : 'warning'} size="sm">
                      {row.stations_reported}/{row.total_stations}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-[#1E40AF] dark:text-blue-400">
                    {formatNumber(row.total_party_votes)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-(--color-text)">{formatNumber(row.total_votes)}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-(--color-text)">
                    {row.total_votes > 0 ? ((row.total_party_votes / row.total_votes) * 100).toFixed(1) : '0.0'}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

/* ===== Detailed View ===== */
const DetailedView: React.FC = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useVoteResults({ per_page: 20 })

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )

  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface-hover)">
              <th className="px-4 py-3 text-left text-xs font-semibold text-(--color-text-muted) uppercase">TPS</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-(--color-text-muted) uppercase">{t('voteResults.partyVotes')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-(--color-text-muted) uppercase">{t('voteResults.totalVotes')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-(--color-text-muted) uppercase">{t('voteResults.dpt')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-(--color-text-muted) uppercase">{t('voteResults.votersPresent')}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-(--color-text-muted) uppercase">{t('voteResults.verified')}</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((vr, i) => (
              <tr key={vr.id} className={`border-b border-(--color-border) ${i % 2 === 1 ? 'bg-(--color-surface-hover)/50' : ''}`}>
                <td className="px-4 py-3 text-sm font-medium text-(--color-text)">
                  TPS {vr.polling_station.station_number} — {vr.polling_station.venue_name}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-[#1E40AF] dark:text-blue-400">{formatNumber(vr.party_votes)}</td>
                <td className="px-4 py-3 text-right text-sm text-(--color-text)">{formatNumber(vr.total_votes)}</td>
                <td className="px-4 py-3 text-right text-sm text-(--color-text)">{formatNumber(vr.dpt)}</td>
                <td className="px-4 py-3 text-right text-sm text-(--color-text)">{formatNumber(vr.voters_present)}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={vr.verified ? 'success' : 'warning'} size="sm">
                    {vr.verified ? t('voteResults.verified') : t('voteResults.unverified')}
                  </Badge>
                </td>
              </tr>
            ))}
            {(!data?.data || data.data.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-(--color-text-muted)">
                  {t('common.noData')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default VoteResultsPage
