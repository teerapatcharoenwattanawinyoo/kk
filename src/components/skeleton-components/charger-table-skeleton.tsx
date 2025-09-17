import { Skeleton } from "@/components/ui/skeleton";

interface ChargerTableSkeletonProps {
  count?: number;
}

export function ChargerTableSkeleton({ count = 5 }: ChargerTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <tr key={`table-skeleton-${idx}`} className="rounded-lg bg-background">
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
            <Skeleton className="mx-auto h-4 w-16" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <Skeleton className="w-18 mx-auto h-6 rounded-md" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-6 w-20" />
          </td>
          <td className="px-2 py-3 md:px-4">
            <div className="text-center">
              <Skeleton className="mx-auto mb-1 h-3 w-16" />
              <Skeleton className="mx-auto h-3 w-12" />
            </div>
          </td>
          <td className="rounded-r-lg px-2 py-3 md:px-4">
            <Skeleton className="mx-auto h-6 w-6" />
          </td>
        </tr>
      ))}
    </>
  );
}
