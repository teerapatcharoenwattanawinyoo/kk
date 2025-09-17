import { Skeleton } from "@/components/ui/skeleton";

interface ChargerMobileSkeletonProps {
  count?: number;
}

export function ChargerMobileSkeleton({
  count = 5,
}: ChargerMobileSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={`mobile-skeleton-${idx}`} className="rounded-lg bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="mr-3 h-7 w-7 rounded-full" />
              <div>
                <Skeleton className="mb-1 h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-6" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Skeleton className="mb-2 h-3 w-12" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div>
              <Skeleton className="mb-2 h-3 w-10" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div>
              <Skeleton className="mb-2 h-3 w-16" />
              <Skeleton className="h-4 w-14" />
            </div>
            <div>
              <Skeleton className="mb-2 h-3 w-14" />
              <Skeleton className="w-18 h-6" />
            </div>
            <div className="col-span-2">
              <Skeleton className="mb-2 h-3 w-12" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
