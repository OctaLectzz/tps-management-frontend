import { cn } from '@/lib/utils'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from './badge'

export interface MultiSelectOption {
  value: string | number
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value: (string | number)[]
  onChange: (value: (string | number)[]) => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  searchable?: boolean
  className?: string
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select multiple...',
  error,
  disabled = false,
  searchable = true,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const generatedId = useId()

  const selectedOptions = options.filter((o) => value.includes(o.value))

  const filteredOptions = searchable ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())) : options

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width
    })
  }, [])

  const toggleOption = (optionValue: string | number) => {
    const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]
    onChange(newValue)
  }

  const removeOption = (e: React.MouseEvent, optionValue: string | number) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (containerRef.current && !containerRef.current.contains(target) && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update position
  useEffect(() => {
    if (!isOpen) return
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  const dropdownContent = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          className="animate-in fade-in zoom-in-95 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) shadow-2xl duration-200 dark:shadow-black/50"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999
          }}
        >
          {searchable && (
            <div className="border-b border-(--color-border) p-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-(--color-text-muted)" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-lg bg-(--color-surface-hover) pr-8 pl-9 text-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none"
                  placeholder="Cari..."
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text)"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
          <ul className="scrollbar-custom max-h-60 overflow-y-auto p-1.5">
            {filteredOptions.length === 0 && <li className="px-3 py-4 text-center text-sm text-(--color-text-muted)">No options found</li>}
            {filteredOptions.map((option) => {
              const isSelected = value.includes(option.value)
              return (
                <li
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-all',
                    isSelected ? 'bg-primary/10 text-primary' : 'text-(--color-text) hover:bg-(--color-surface-hover)'
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0" />}
                </li>
              )
            })}
          </ul>
        </div>,
        document.body
      )
    : null

  return (
    <div className={cn('flex flex-col gap-1.5', className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-(--color-text-secondary)" id={`${generatedId}-label`}>
          {label}
        </label>
      )}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 py-1.5 text-sm transition-all duration-200',
            'border border-(--color-input-border) bg-(--color-input-bg)',
            'text-(--color-text)',
            'focus:border-primary focus:ring-primary/10 focus:ring-4 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isOpen && 'border-primary ring-primary/10 ring-4',
            error && 'border-red-500 focus:ring-red-500/10'
          )}
        >
          <div className="flex flex-wrap gap-1.5">
            {selectedOptions.length === 0 && <span className="text-(--color-text-muted)">{placeholder}</span>}
            {selectedOptions.map((o) => (
              <Badge
                key={o.value}
                variant="primary"
                size="sm"
                className="flex items-center gap-1 pr-1 pl-2"
                onClick={(e) => removeOption(e, o.value)}
              >
                {o.label}
                <X className="h-3 w-3 opacity-60 hover:opacity-100" />
              </Badge>
            ))}
          </div>
          <div className="ml-2 flex items-center gap-1">
            {selectedOptions.length > 0 && (
              <button type="button" onClick={clearAll} className="text-(--color-text-muted) transition-colors hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown className={cn('h-4 w-4 shrink-0 text-(--color-text-muted) transition-transform duration-200', isOpen && 'rotate-180')} />
          </div>
        </button>
      </div>
      {dropdownContent}
      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export { MultiSelect }
