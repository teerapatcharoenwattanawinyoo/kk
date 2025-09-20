'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SettingsLayoutProps {
  children: React.ReactNode
  teamId: string
  locale: string
  title: string
}

const settingsMenuItems = [
  { id: 'general', label: 'General Setting', path: 'general' },
  { id: 'tax', label: 'Tax Setting', path: 'tax' },
  { id: 'permission', label: 'Team Permission', path: 'permission' },
  { id: 'upgrade', label: 'Plan Upgrade', path: 'upgrade' },
  { id: 'team', label: 'Team Setting', path: 'team' },
]

export const SettingsLayout = ({
  children,
  teamId,
  locale,
  title,
}: SettingsLayoutProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleSettingsCancel = () => {
    // Go back to team overview
    router.push(`/${locale}/team/${teamId}/overview`)
  }

  const handleMenuItemClick = (path: string) => {
    router.push(`/${locale}/team/${teamId}/settings/${path}`)
  }

  const getActiveMenuItem = () => {
    const currentPath = pathname.split('/').pop()
    return settingsMenuItems.find((item) => item.path === currentPath)?.id || ''
  }

  return (
    <div className="m-5 space-y-4 rounded-lg bg-card px-4 py-4 sm:px-6 sm:py-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4 lg:p-6">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Button
            onClick={handleSettingsCancel}
            className="h-8 w-8 rounded-full bg-muted lg:h-9 lg:w-9"
            variant={'ghost'}
            size={'icon'}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground lg:text-xl">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar Menu */}
        <div className="rounded-xl border-b bg-muted/40 p-4 lg:w-64 lg:border-b-0">
          {/* Mobile: Horizontal scroll menu */}
          <div className="lg:hidden">
            <ScrollArea className="w-full">
              <div className="flex space-x-2 pb-2">
                {settingsMenuItems.map((item) => {
                  const isActive = getActiveMenuItem() === item.id
                  return (
                    <Button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.path)}
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'whitespace-nowrap',
                        !isActive && 'text-foreground/80',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Desktop: Vertical menu */}
          <div className="hidden lg:block">
            <ScrollArea className="h-[calc(100vh-9rem)] pr-2">
              <div className="space-y-1.5">
                {settingsMenuItems.map((item) => {
                  const isActive = getActiveMenuItem() === item.id
                  return (
                    <Button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.path)}
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        !isActive && 'text-foreground/80',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
