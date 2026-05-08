import { Button, Card, SkeletonCard } from '@/components/ui'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { formatNumber } from '@/lib/utils'
import { AlertTriangle, BarChart3, Map, MapPin, PieChart as PieChartIcon, TrendingUp, Upload, UserCheck, UserPlus, Users, Vote } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-800 dark:text-white">{t('dashboard.title')}</h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.description')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" icon={<Map className="h-4 w-4" />} onClick={() => navigate('/map')}>
            {t('dashboard.goToMap')}
          </Button>
          <Button icon={<Vote className="h-4 w-4" />} onClick={() => navigate('/vote-result-input')}>
            {t('voteResults.addResult')}
          </Button>
        </div>
      </div>

      {/* 1. Statistics Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
          <div className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-blue-500/10 p-3 dark:bg-blue-500/20">
              <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-blue-600/60 uppercase dark:text-blue-400/60">{t('dashboard.totalTps')}</p>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white">{formatNumber(stats.total_tps)}</h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10">
          <div className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-emerald-500/10 p-3 dark:bg-emerald-500/20">
              <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-emerald-600/60 uppercase dark:text-emerald-400/60">
                {t('dashboard.tpsWithOfficers')}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-gray-800 dark:text-white">{formatNumber(stats.covered_tps)}</h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.total_tps > 0 ? Math.round((stats.covered_tps / stats.total_tps) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/10">
          <div className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-purple-500/10 p-3 dark:bg-purple-500/20">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-purple-600/60 uppercase dark:text-purple-400/60">
                {t('dashboard.totalOfficers')}
              </p>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white">{formatNumber(stats.total_officers)}</h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-500 bg-rose-50/50 dark:bg-rose-900/10">
          <div className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-rose-500/10 p-3 dark:bg-rose-500/20">
              <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-widest text-rose-600/60 uppercase dark:text-rose-400/60">{t('dashboard.tpsUncovered')}</p>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white">{formatNumber(uncoveredTps)}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Charts */}
        <div className="space-y-8 lg:col-span-2">
          {/* Main Chart */}
          <Card
            padding="none"
            className="overflow-hidden rounded-2xl border-none shadow-xl transition-all dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-xl p-2">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-black tracking-tight text-gray-800 dark:text-white">{t('dashboard.tpsPerDistrict')}</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="bg-primary h-2 w-2 rounded-full" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{t('dashboard.total')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{t('dashboard.covered')}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={12}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'var(--color-primary)', opacity: 0.05 }}
                    contentStyle={{
                      backgroundColor: 'var(--color-surface)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="total" name={t('dashboard.total')} fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="covered" name={t('dashboard.covered')} fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Action Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card
              onClick={() => navigate('/vote-result-input')}
              className="group cursor-pointer border-none bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-900/50"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-blue-500/10 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/20">
                <Vote className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-black text-gray-800 dark:text-white">{t('dashboard.inputResults')}</h4>
              <p className="mt-2 text-xs leading-relaxed font-medium text-gray-500 dark:text-gray-400">{t('dashboard.inputResultsDesc')}</p>
            </Card>

            <Card
              onClick={() => navigate('/map')}
              className="group cursor-pointer border-none bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-900/50"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-500/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-black text-gray-800 dark:text-white">{t('dashboard.monitorProgress')}</h4>
              <p className="mt-2 text-xs leading-relaxed font-medium text-gray-500 dark:text-gray-400">{t('dashboard.monitorProgressDesc')}</p>
            </Card>

            <Card
              onClick={() => navigate('/vote-results')}
              className="group cursor-pointer border-none bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-900/50"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-amber-500/10 p-3 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white dark:bg-amber-500/20">
                <UserCheck className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-black text-gray-800 dark:text-white">{t('dashboard.verifyC1')}</h4>
              <p className="mt-2 text-xs leading-relaxed font-medium text-gray-500 dark:text-gray-400">{t('dashboard.verifyC1Desc')}</p>
            </Card>
          </div>
        </div>

        {/* Right Column: Status & Quick Links */}
        <div className="space-y-8">
          {/* Pie Chart Card */}
          <Card padding="none" className="overflow-hidden rounded-2xl border-none shadow-xl dark:bg-gray-900/50">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5 dark:border-gray-800">
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
                <PieChartIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-black tracking-tight text-gray-800 dark:text-white">{t('dashboard.assignmentStatus')}</h3>
            </div>
            <div className="p-6">
              <div className="relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                      <Cell fill="#10B981" />
                      <Cell fill="#EF4444" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-black text-gray-800 dark:text-white">{stats.assignment_completion_rate}%</p>
                  <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{t('dashboard.covered')}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{t('dashboard.covered')}</span>
                  </div>
                  <span className="text-sm font-black text-gray-800 dark:text-white">{stats.covered_tps}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{t('dashboard.uncovered')}</span>
                  </div>
                  <span className="text-sm font-black text-gray-800 dark:text-white">{uncoveredTps}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="to-primary border-none bg-linear-to-br from-indigo-600 p-6 text-white shadow-xl">
            <h3 className="text-lg font-black tracking-tight">{t('dashboard.quickLinks')}</h3>
            <p className="mt-2 text-xs font-medium text-white/70">{t('dashboard.quickLinksDesc')}</p>

            <div className="mt-6 space-y-3">
              <Button
                onClick={() => navigate('/polling-stations')}
                className="w-full justify-start gap-3 border-none bg-white/10 text-white hover:bg-white/20"
              >
                <Upload className="h-4 w-4" />
                <span className="text-xs font-bold tracking-wider uppercase">{t('dashboard.importTps')}</span>
              </Button>
              <Button
                onClick={() => navigate('/officers')}
                className="w-full justify-start gap-3 border-none bg-white/10 text-white hover:bg-white/20"
              >
                <UserPlus className="h-4 w-4" />
                <span className="text-xs font-bold tracking-wider uppercase">{t('dashboard.addOfficer')}</span>
              </Button>
              <Button
                onClick={() => navigate('/assignments')}
                className="w-full justify-start gap-3 border-none bg-white/10 text-white hover:bg-white/20"
              >
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-bold tracking-wider uppercase">{t('dashboard.manageAssignments')}</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
