import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PricingSkeleton() {
  return (
    <div className="grid gap-3 p-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="shadow-xs overflow-hidden border border-muted">
          <div className="p-1">
            <div className="flex h-60 items-start justify-between p-3">
              <div className="flex w-full items-start gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="mb-1 h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-7 w-7 rounded" />
            </div>
            <div className="flex items-center justify-between border-t border-muted p-3">
              <div className="flex items-center gap-1.5 px-5">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-7 w-16 rounded" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
