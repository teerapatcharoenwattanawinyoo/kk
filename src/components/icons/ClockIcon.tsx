import React from 'react'

interface ClockIconProps {
  className?: string
}

export const ClockIcon: React.FC<ClockIconProps> = ({ className = 'shrink-0' }) => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.91275 2.08054H1.71191C2.51523 1.16151 3.39511 0.832216 4.57719 0.832216C6.64548 0.832216 8.32216 2.5089 8.32216 4.57719C8.32216 6.64548 6.64548 8.32216 4.57719 8.32216C2.5089 8.32216 0.832216 6.64548 0.832216 4.57719H0C0 7.1051 2.04928 9.15437 4.57719 9.15437C7.1051 9.15437 9.15437 7.1051 9.15437 4.57719C9.15437 2.04928 7.1051 0 4.57719 0C3.24008 0 2.17919 0.378891 1.24832 1.35503V0.412451H0.416108V2.91275H2.91275V2.08054ZM6.65754 4.15964H4.9931V2.0791H4.16089V4.99186H6.65754V4.15964Z"
        fill="#708CF2"
      />
    </svg>
  )
}
