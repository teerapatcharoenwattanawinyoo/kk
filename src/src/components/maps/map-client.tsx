'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useI18n } from '@/lib/i18n'
import { Info, Loader2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

import { useMapClient } from './hooks/use-map-client'
import type { MapClientProps } from './types'

export default function MapClient({
  width = 'w-full',
  height = 'h-[400px]',
  onCoordinatesChange,
  onAddressChange,
  initialCoordinates,
  initialAddress,
}: MapClientProps) {
  const { t } = useI18n()

  const {
    address,
    isGeocodingLoading,
    showSuggestions,
    searchResults,
    selectedSuggestionIndex,
    isLoadingLocation,
    isPinMode,
    locationError,
    latitude,
    longitude,
    mapRef,
    searchContainerRef,
    handleAddressChange,
    handleAddressSearch,
    handleAddressFocus,
    handleLatitudeChange,
    handleLongitudeChange,
    selectSearchResult,
    togglePinMode,
  } = useMapClient({
    onCoordinatesChange,
    onAddressChange,
    initialCoordinates,
    initialAddress,
  })

  return (
    <div className="space-y-6">
      {locationError && (
        <Alert className="border-amber-300 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="font-medium text-amber-800">
            {locationError} - ใช้ตำแหน่งกรุงเทพฯ เป็นค่าเริ่มต้น
          </AlertDescription>
        </Alert>
      )}

      <div className="relative space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            {t('charging-stations.address')}
          </Label>
          <div className="relative" ref={searchContainerRef}>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={handleAddressChange}
              onKeyDown={handleAddressSearch}
              onFocus={handleAddressFocus}
              placeholder={t('charging-stations.address_placeholder')}
              className="h-10 w-full border-none bg-[#f2f2f2] pr-10 transition-all duration-200 sm:h-11"
            />

            {isGeocodingLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {showSuggestions && searchResults.length > 0 && (
              <Card className="z-9999 absolute left-0 right-0 top-full mt-1 max-h-60 overflow-hidden shadow-xl">
                <div className="max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={result.place_id || index}
                      className={`cursor-pointer border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-accent ${
                        selectedSuggestionIndex === index ? 'bg-accent' : ''
                      }`}
                      onClick={() => selectSearchResult(result)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {result.display_name.split(',')[0]}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {result.display_name}
                          </p>
                        </div>
                        <div className="ml-2 text-right">
                          <p className="font-mono text-xs text-muted-foreground">
                            {result.lat.toFixed(4)}, {result.lon.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {showSuggestions && searchResults.length > 0 && (
          <div className="h-20"></div>
        )}
      </div>

      <div className="relative">
        <div ref={mapRef} className={`${width} ${height} rounded-lg border`}>
          {isLoadingLocation && (
            <div className="flex h-full items-center justify-center rounded-lg bg-muted">
              <Card className="p-6">
                <CardContent className="flex flex-col items-center space-y-4 p-0">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-center text-muted-foreground">
                    กำลังค้นหาตำแหน่งปัจจุบัน...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {!isLoadingLocation && (
          <div className="z-1000 absolute right-3 top-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={togglePinMode}
                    variant="default"
                    size="sm"
                    className="rounded-lg"
                  >
                    {isPinMode ? '📍 Pin Mode ON' : '📍 Pin on map'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isPinMode
                      ? 'โหมดวางหมุดเปิดอยู่ - คลิกที่แผนที่เพื่อวางหมุด'
                      : 'เปิดโหมดวางหมุด'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {isPinMode && !isLoadingLocation && (
          <div className="z-1000 absolute right-3 top-16 max-w-xs duration-300 animate-in slide-in-from-top-2">
            <Alert className="border-green-300 bg-green-50 shadow-lg">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="font-medium text-green-800">
                คลิกที่แผนที่เพื่อวางหมุด
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="latitude" className="text-sm font-medium">
            {t('charging-stations.latitude')}
          </Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={latitude ? latitude.toFixed(4) : ''}
            onChange={handleLatitudeChange}
            placeholder={t('charging-stations.latitude_placeholder')}
            disabled={isLoadingLocation}
            className="h-10 border-0 bg-[#f2f2f2] transition-all duration-200 sm:h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude" className="text-sm font-medium">
            {t('charging-stations.longitude')}
          </Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={longitude ? longitude.toFixed(4) : ''}
            onChange={handleLongitudeChange}
            placeholder={t('charging-stations.longitude_placeholder')}
            disabled={isLoadingLocation}
            className="h-10 border-0 bg-[#f2f2f2] transition-all duration-200 sm:h-11"
          />
        </div>
      </div>
    </div>
  )
}
