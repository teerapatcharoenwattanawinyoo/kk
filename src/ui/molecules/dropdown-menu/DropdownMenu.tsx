import { colors } from '@/lib/utils/colors'
import React, { useState } from 'react'

interface DropdownMenuProps {
  trigger: React.ReactNode
  items: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
  }>
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Menu */}
          <div
            className="absolute right-0 top-full z-20 mt-1 min-w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50"
                style={{ color: colors.neutral[700] }}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
