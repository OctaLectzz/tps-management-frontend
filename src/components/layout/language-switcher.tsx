import { cn } from '@/lib/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'id' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('electra-language', newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors',
        'text-(--color-text-secondary) hover:bg-(--color-surface-hover) hover:text-(--color-text)',
        className
      )}
      aria-label="Switch language"
    >
      <span className="text-base">{currentLang === 'en' ? '🇺🇸' : '🇮🇩'}</span>
      <span className="hidden sm:inline">{currentLang === 'en' ? 'EN' : 'ID'}</span>
    </button>
  )
}

LanguageSwitcher.displayName = 'LanguageSwitcher'

export { LanguageSwitcher }
