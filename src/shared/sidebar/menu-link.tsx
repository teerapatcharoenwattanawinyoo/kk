'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type React from 'react'

interface MenuLinkProps {
  href: string
  icon: React.ReactNode
  labelKey: string
  isActive: boolean
  isCollapsed: boolean
}

export function MenuLink({
  href,
  icon,
  labelKey,
  isActive,
  isCollapsed,
}: MenuLinkProps) {
  const { t } = useI18n()
  const label = t(labelKey)

  const linkElement = (
    <Link
      href={href}
      className={cn(
        'outline-hidden ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground flex w-full items-center gap-3 overflow-hidden rounded-md px-3 py-3 text-left text-sm transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        // Match shadcn/ui sidebar collapsed behavior
        'group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2',
        isActive
          ? 'bg-primary-soft hover:bg-primary-soft font-medium text-primary hover:text-primary'
          : 'text-sidebar-foreground',
      )}
      aria-label={label}
    >
      <span className="shrink-0 [&>svg]:size-5 [&>svg]:shrink-0">{icon}</span>
      {/* Show text on mobile, hide only on desktop when collapsed */}
      <span
        className={cn(
          'truncate font-medium transition-opacity duration-200',
          'group-data-[collapsible=icon]:hidden',
        )}
      >
        {label}
      </span>
    </Link>
  )

  // Show tooltip when collapsed (using shadcn/ui CSS selector)
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return linkElement
}
