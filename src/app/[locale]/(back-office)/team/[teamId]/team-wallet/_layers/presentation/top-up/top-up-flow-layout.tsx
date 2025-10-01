import type { ReactNode } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

interface TopUpFlowLayoutProps {
  backHref: string
  title: string
  children: ReactNode
}

export function TopUpFlowLayout({ backHref, title, children }: TopUpFlowLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="flex-1 px-4 py-4 md:px-6">
        <div className="shadow-xs rounded-lg bg-card">
          <div className="border-b">
            <div className="flex items-center gap-6 p-4 pb-4">
              <Link href={backHref}>
                <Button className="h-8 w-8 rounded-full bg-muted lg:h-9 lg:w-9" variant={'ghost'} size={'icon'}>
                  <ChevronLeft className="size-4" />
                </Button>
              </Link>
              <h2 className="text-oc-title-secondary text-2xl font-semibold">{title}</h2>
            </div>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
