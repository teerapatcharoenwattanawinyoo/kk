import { colors } from '@/lib/utils/colors'
import { Card, CardContent } from '@/ui/molecules/card'
import React from 'react'

export interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: string
    type: 'up' | 'down' | 'neutral'
  }
  iconBackgroundColor?: string
}

export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  iconBackgroundColor = colors.primary[100],
}: StatsCardProps) => {
  const getTrendIcon = () => {
    if (!trend) return null

    switch (trend.type) {
      case 'up':
        return (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17l9.2-9.2M17 17V7H7"
            />
          </svg>
        )
      case 'down':
        return (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 7l-9.2 9.2M7 7v10h10"
            />
          </svg>
        )
      default:
        return null
    }
  }

  const getTrendColor = () => {
    if (!trend) return ''

    switch (trend.type) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  // Function to render percentage with colored numbers
  const renderTrendValue = (value: string) => {
    const parts = value.split(/(\d+%)/)
    return (
      <>
        {parts.map((part, index) => {
          if (part.match(/\d+%/)) {
            return (
              <span key={index} className={`font-semibold ${getTrendColor()}`}>
                {part}
              </span>
            )
          }
          return (
            <span key={index} className="text-gray-600">
              {part}
            </span>
          )
        })}
      </>
    )
  }

  return (
    <Card className="border-0 bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {trend && (
              <div className={`flex items-center text-xs ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="ml-1">{renderTrendValue(trend.value)}</span>
              </div>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
