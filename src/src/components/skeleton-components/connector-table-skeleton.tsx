import { Skeleton } from '@/components/ui/skeleton'

interface ConnectorTableSkeletonProps {
  count?: number
}

export function ConnectorTableSkeleton({
  count = 5,
}: ConnectorTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <tr key={`connector-skeleton-${idx}`} className="rounded-lg bg-white">
          <td className="rounded-l-lg px-2 py-3 md:px-4">
            <div className="flex items-center">
              <Skeleton className="mr-2 h-7 w-7 rounded-full" />
              <div>
                <Skeleton className="mb-1 h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </td>
          <td className="px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-6 w-20 rounded-xl" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-4 w-8" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-4 w-12" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-8 w-8 rounded-[4px]" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-5 w-16 rounded-xl" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-6 w-14 rounded" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-4 w-16" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <div className="text-center">
              <Skeleton className="mx-auto mb-1 h-3 w-16" />
              <Skeleton className="mx-auto h-3 w-12" />
            </div>
          </td>
          <td className="rounded-r-lg px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-[13px] w-[13px]" />
          </td>
        </tr>
      ))}
    </>
  )
}
