import { StatCard } from '@/components/common/stat-card'
import { Button, Card, SkeletonCard } from '@/components/ui'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { formatNumber } from '@/lib/utils'
import { AlertTriangle, Map, MapPin, Upload, UserCheck, UserPlus, Users, Vote } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CHART_COLORS = ['#1E40AF', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899']

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  const uncoveredTps = stats.total_tps - stats.covered_tps

  const pieData = [
    { name: t('dashboard.covered'), value: stats.covered_tps },
    { name: t('dashboard.uncovered'), value: uncoveredTps }
  ]

  const barData = stats.by_district.map((d) => ({
    name: d.name.replace('Kecamatan ', '').replace('KEC. ', ''),
    total: d.total,
    covered: d.covered
  }))

  return (
    <div className="space-y-8">
      {/* 1. TPS & Officers Category */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-(--color-text)">Manajemen TPS & Petugas</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={MapPin} label={t('dashboard.totalTps')} value={formatNumber(stats.total_tps)} color="blue" />
          <StatCard
            icon={UserCheck}
            label={t('dashboard.tpsWithOfficers')}
            value={formatNumber(stats.covered_tps)}
            subtitle={`${stats.total_tps > 0 ? Math.round((stats.covered_tps / stats.total_tps) * 100) : 0}% ${t('dashboard.covered').toLowerCase()}`}
            color="green"
          />
          <StatCard icon={Users} label={t('dashboard.totalOfficers')} value={formatNumber(stats.total_officers)} color="purple" />
          <StatCard icon={AlertTriangle} label={t('dashboard.tpsUncovered')} value={formatNumber(uncoveredTps)} color="red" />
        </div>
      </section>

      {/* 2. Suara PAN Category */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-(--color-text)">Hasil Suara</h2>
          <Button icon={<Vote className="h-4 w-4" />} size="sm" onClick={() => navigate('/vote-results')}>
            Input Suara PAN
          </Button>
        </div>

        {/* Placeholder cards for votes (could be hooked up to useVoteAggregation later) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 rounded-full bg-[#1E40AF]/10 p-3 text-[#1E40AF] dark:bg-blue-900/30 dark:text-blue-400">
              <Vote className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-(--color-text)">Input Hasil Suara</h3>
            <p className="mt-1 text-sm text-(--color-text-muted)">Catat perolehan suara PAN dari setiap TPS</p>
            <Button className="mt-4" onClick={() => navigate('/vote-results')}>
              Input Sekarang
            </Button>
          </Card>
          <Card className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 rounded-full bg-green-500/10 p-3 text-green-600 dark:text-green-400">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-(--color-text)">Pantau Pengumpulan</h3>
            <p className="mt-1 text-sm text-(--color-text-muted)">Lihat TPS mana saja yang sudah melapor</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/vote-results')}>
              Lihat Progress
            </Button>
          </Card>
          <Card className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 rounded-full bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-(--color-text)">Verifikasi Data</h3>
            <p className="mt-1 text-sm text-(--color-text-muted)">Validasi laporan C1 yang masuk dari saksi</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/vote-results')}>
              Verifikasi
            </Button>
          </Card>
        </div>
      </section>

      {/* 3. Grafik & Laporan */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-(--color-text)">Grafik Penugasan</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Bar Chart — TPS per District */}
          <Card padding="none" className="lg:col-span-2">
            <div className="border-b border-(--color-border) px-5 py-4">
              <h3 className="text-base font-semibold text-(--color-text)">{t('dashboard.tpsPerDistrict')}</h3>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
                  <Bar dataKey="total" name="Total TPS" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="covered" name={t('dashboard.covered')} fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pie Chart — Coverage */}
          <Card padding="none">
            <div className="border-b border-(--color-border) px-5 py-4">
              <h3 className="text-base font-semibold text-(--color-text)">{t('dashboard.assignmentStatus')}</h3>
            </div>
            <div className="flex flex-col items-center p-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    <Cell fill="#10B981" />
                    <Cell fill="#EF4444" />
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-xs text-(--color-text-muted)">
                    {t('dashboard.covered')} ({stats.covered_tps})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-xs text-(--color-text-muted)">
                    {t('dashboard.uncovered')} ({uncoveredTps})
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-3xl font-bold text-(--color-text)">{stats.assignment_completion_rate}%</p>
                <p className="text-xs text-(--color-text-muted)">{t('dashboard.completionRate')}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Quick Actions */}
      <section>
        <Card padding="md">
          <h3 className="mb-4 text-base font-semibold text-(--color-text)">{t('dashboard.quickLinks')}</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" icon={<Map className="h-4 w-4" />} onClick={() => navigate('/map')}>
              {t('dashboard.goToMap')}
            </Button>
            <Button variant="outline" icon={<Upload className="h-4 w-4" />} onClick={() => navigate('/polling-stations')}>
              {t('dashboard.importTps')}
            </Button>
            <Button variant="outline" icon={<UserPlus className="h-4 w-4" />} onClick={() => navigate('/officers')}>
              {t('dashboard.addOfficer')}
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}

// Suppress unused import warning
void CHART_COLORS

export default DashboardPage
