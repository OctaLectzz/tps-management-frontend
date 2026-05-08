import { cn } from '@/lib/utils'
import { ChevronDown, Search, X } from 'lucide-react'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  searchable?: boolean
  className?: string
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select...',
  error,
  disabled = false,
  searchable = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const generatedId = useId()

  const selectedOption = options.find((o) => o.value === value)

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

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue)
      setIsOpen(false)
      setSearch('')
      setHighlightIndex(-1)
    },
    [onChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault()
          setIsOpen(true)
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (highlightIndex >= 0 && filteredOptions[highlightIndex] && !filteredOptions[highlightIndex].disabled) {
            handleSelect(filteredOptions[highlightIndex].value)
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setSearch('')
          break
      }
    },
    [isOpen, highlightIndex, filteredOptions, handleSelect]
  )

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

  // Update position when opened and on scroll/resize
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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen, searchable])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]')
      items[highlightIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIndex])

  const dropdownContent = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          className="animate-slide-down overflow-hidden rounded-lg border border-(--color-border) bg-(--color-surface) shadow-xl"
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
                <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-(--color-text-muted)" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setHighlightIndex(0)
                  }}
                  onKeyDown={handleKeyDown}
                  className="h-8 w-full rounded-md bg-(--color-surface-hover) pr-8 pl-8 text-sm text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none"
                  placeholder="Search..."
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text)"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
          <ul ref={listRef} role="listbox" className="scrollbar-custom max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 && <li className="px-3 py-2 text-center text-sm text-(--color-text-muted)">No options found</li>}
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                onClick={() => !option.disabled && handleSelect(option.value)}
                onMouseEnter={() => setHighlightIndex(index)}
                className={cn(
                  'cursor-pointer rounded-md px-3 py-2 text-sm transition-colors',
                  option.value === value && 'bg-[#1E40AF]/10 font-medium text-[#1E40AF] dark:text-blue-400',
                  highlightIndex === index && option.value !== value && 'bg-(--color-surface-hover)',
                  option.disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {option.label}
              </li>
            ))}
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
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${generatedId}-label` : undefined}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm transition-all duration-200',
            'border border-(--color-input-border) bg-(--color-input-bg)',
            'text-(--color-text)',
            'focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 focus:outline-none',
            'dark:focus:border-[#3B82F6] dark:focus:ring-[#3B82F6]/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
            !selectedOption && 'text-(--color-text-muted)'
          )}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-(--color-text-muted) transition-transform duration-200', isOpen && 'rotate-180')} />
        </button>
      </div>
      {dropdownContent}
      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

Select.displayName = 'Select'

export { Select, type SelectOption, type SelectProps }
