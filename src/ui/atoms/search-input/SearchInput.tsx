import { SearchIcon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { colors } from '@/lib/utils/colors'
import React from 'react'
import { Input } from '../input/Input'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  disabled?: boolean
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  className,
  disabled = false,
}) => {
  return (
    <div className={cn('relative', className)}>
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="border-gray-200 pl-10 focus:border-blue-500 focus:ring-blue-500"
        style={{
          backgroundColor: disabled ? colors.search.disabled.background : colors.search.background,
          borderColor: disabled ? colors.search.disabled.border : colors.search.border,
          color: disabled ? colors.search.disabled.text : undefined,
        }}
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon
          width={16}
          height={16}
          fill={disabled ? colors.search.disabled.icon : colors.search.icon}
        />
      </div>
    </div>
  )
}
