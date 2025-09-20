'use client'

import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

interface MapLandmarkProps {
  width?: string
  height?: string
  onCoordinatesChange?: (lat: number, lng: number) => void
  onAddressChange?: (address: string) => void
  initialCoordinates?: { lat: number; lng: number }
  initialAddress?: string
}

const MapWithNoSSR = dynamic(() => import('./map-client'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-[#f2f2f2]">
      <div className="relative h-full w-full">
        <Skeleton className="absolute inset-0 h-full w-full rounded-lg" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="border-seconday mb-4 h-8 w-8 animate-spin rounded-full border-t-2 border-solid" />
          <span className="text-seconday text-sm">Loading map...</span>
        </div>
      </div>
    </div>
  ),
})

export default function MapLandmark({
  width = 'w-full',
  height = 'h-[400px]',
  onCoordinatesChange,
  onAddressChange,
  initialCoordinates,
  initialAddress,
}: MapLandmarkProps) {
  return (
    <MapWithNoSSR
      width={width}
      height={height}
      onCoordinatesChange={onCoordinatesChange}
      onAddressChange={onAddressChange}
      initialCoordinates={initialCoordinates}
      initialAddress={initialAddress}
    />
  )
}
