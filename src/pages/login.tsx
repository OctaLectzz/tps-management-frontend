import { Button, Input } from '@/components/ui'
import { useAuthStore } from '@/stores/auth.store'
import { loginSchema, type LoginFormData } from '@/types/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, Zap } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [error, setError] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    try {
      await login(data)
      navigate('/', { replace: true })
    } catch {
      setError(t('auth.loginError'))
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-linear-to-br from-[#1E40AF] via-[#1E3A8A] to-[#172554] p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <Zap className="h-6 w-6 text-[#F59E0B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">ELECTRA</h1>
            <p className="text-xs font-medium tracking-wider text-[#F59E0B]">PAN SUKOHARJO</p>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-4xl leading-tight font-bold text-white">{t('common.appDescription')}</h2>
          <p className="text-lg text-blue-200/80">Sistem manajemen TPS terintegrasi untuk PAN Kabupaten Sukoharjo, Jawa Tengah.</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-300/60">
          <span>© 2026 PAN Sukoharjo</span>
          <span>·</span>
          <span>ELECTRA v1.0</span>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex w-full items-center justify-center bg-(--color-bg) px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E40AF]">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-(--color-text)">ELECTRA</h1>
              <p className="text-[10px] font-medium tracking-wider text-[#F59E0B]">PAN SUKOHARJO</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-(--color-text)">{t('auth.loginTitle')}</h2>
            <p className="mt-2 text-sm text-(--color-text-muted)">{t('auth.loginSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="admin@electra.id"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message ? t(errors.email.message) : undefined}
              {...register('email')}
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message ? t(errors.password.message) : undefined}
              {...register('password')}
            />

            <Button type="submit" size="lg" loading={isLoading} className="mt-2 w-full">
              {isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
