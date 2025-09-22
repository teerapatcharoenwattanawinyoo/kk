import React from 'react'

interface WarningIconProps {
  className?: string
}

export const WarningIcon: React.FC<WarningIconProps> = ({
  className = 'mt-0.5 h-4 w-4 text-[#F67416]',
}) => {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  )
}
