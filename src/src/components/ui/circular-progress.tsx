'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CircularProgressProps {
  value: number
  renderLabel?: (progress: number) => number | string
  size?: number
  strokeWidth?: number
  circleStrokeWidth?: number
  progressStrokeWidth?: number
  shape?: 'square' | 'round'
  className?: string
  progressClassName?: string
  labelClassName?: string
  showLabel?: boolean
}

export const CircularProgress = ({
  value,
  renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel,
  shape = 'round',
  size = 100,
  strokeWidth,
  circleStrokeWidth = 10,
  progressStrokeWidth = 10,
}: CircularProgressProps) => {
  const radius = size / 2 - 10
  const circumference = Math.ceil(3.14 * radius * 2)
  const percentage = Math.ceil(circumference * ((100 - value) / 100))

  const viewBox = `-${size * 0.125} -${size * 0.125} ${size * 1.25} ${
    size * 1.25
  }`

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: 'rotate(-90deg)' }}
        className="relative"
      >
        {/* Base Circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={0}
          className={cn('stroke-primary/25', className)}
        />

        {/* Progress */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeLinecap={shape}
          strokeDashoffset={percentage}
          fill="transparent"
          strokeDasharray={circumference}
          className={cn(
            'stroke-primary transition-all duration-300',
            progressClassName,
          )}
        />
      </svg>
      {showLabel && (
        <div
          className={cn(
            'text-md absolute inset-0 flex items-center justify-center',
            labelClassName,
          )}
        >
          {renderLabel ? renderLabel(value) : value}
        </div>
      )}
    </div>
  )
}

export function AnimatedCircularLoader({
  size = 72,
  showLabel = false,
  labelClassName,
}: Pick<CircularProgressProps, 'size' | 'showLabel' | 'labelClassName'>) {
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    let raf = 0
    let start: number | null = null
    const duration = 2000 // ms per cycle
    const tick = (ts: number) => {
      if (start == null) start = ts
      const elapsed = (ts - start) % duration
      const pct = Math.min(100, (elapsed / duration) * 100)
      setProgress(pct)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <CircularProgress
      value={progress}
      size={size}
      showLabel={showLabel}
      labelClassName={labelClassName}
      renderLabel={(v) => `${Math.round(v)}%`}
    />
  )
}
