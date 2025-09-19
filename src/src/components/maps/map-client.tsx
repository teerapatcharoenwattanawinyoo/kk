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
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Info, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface MapClientProps {
  width?: string
  height?: string
  onCoordinatesChange?: (lat: number, lng: number) => void
  onAddressChange?: (address: string) => void
  initialCoordinates?: { lat: number; lng: number }
  initialAddress?: string
}

const defaultIcon = L.icon({
  iconUrl: '/assets/images/icons/pinmaps.svg',
  iconRetinaUrl: '/assets/images/icons/pinmaps.svg',
  shadowUrl: '/assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function MapClient({
  width = 'w-full',
  height = 'h-[400px]',
  onCoordinatesChange,
  onAddressChange,
  initialCoordinates,
  initialAddress,
}: MapClientProps) {
  const { t } = useI18n()

  // Refs
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isCleaningUpRef = useRef(false)
  const isMapInitializedRef = useRef(false)
  const lastGeocodedCoordsRef = useRef<string>('')

  // State
  const [latitude, setLatitude] = useState<number | null>(
    initialCoordinates?.lat ?? null,
  )
  const [longitude, setLongitude] = useState<number | null>(
    initialCoordinates?.lng ?? null,
  )
  const [address, setAddress] = useState<string>(initialAddress ?? '')
  const [currentLocationName, setCurrentLocationName] =
    useState<string>('ตำแหน่งปัจจุบัน')
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<
    Array<{
      display_name: string
      lat: number
      lon: number
      type?: string
      importance?: number
      place_id?: string
      addresstype?: string
      class?: string
      boundingbox?: string[]
    }>
  >([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [isPinMode, setIsPinMode] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Memoized coordinates to prevent unnecessary re-renders
  const currentCoordinates = useMemo(() => {
    if (latitude === null || longitude === null) return null
    return { lat: latitude, lng: longitude }
  }, [latitude, longitude])

  // Safe cleanup function
  const cleanupMap = useCallback(() => {
    if (isCleaningUpRef.current) return
    isCleaningUpRef.current = true

    try {
      if (markerRef.current) {
        markerRef.current = null
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.off()
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      isMapInitializedRef.current = false
    } catch (error) {
      console.error('Error during map cleanup:', error)
    } finally {
      isCleaningUpRef.current = false
    }
  }, [])

  // Optimized marker update function
  const updateMarker = useCallback(
    (lat: number, lng: number, popupText: string) => {
      if (!mapInstanceRef.current) return

      try {
        // Remove existing marker
        if (
          markerRef.current &&
          mapInstanceRef.current.hasLayer(markerRef.current)
        ) {
          mapInstanceRef.current.removeLayer(markerRef.current)
        }

        // Add new marker with animation
        const newMarker = L.marker([lat, lng], {
          icon: defaultIcon,
          riseOnHover: true,
        }).addTo(mapInstanceRef.current)

        markerRef.current = newMarker
        newMarker.bindPopup(popupText)

        // Show popup briefly for feedback
        newMarker.openPopup()
        setTimeout(() => {
          if (
            newMarker &&
            mapInstanceRef.current &&
            mapInstanceRef.current.hasLayer(newMarker)
          ) {
            newMarker.closePopup()
          }
        }, 2000)
      } catch (error) {
        console.error('Error updating marker:', error)
      }
    },
    [],
  )

  // Debounced reverse geocoding with caching
  const debouncedReverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      const coordKey = `${lat.toFixed(4)},${lng.toFixed(4)}`

      // Skip if same coordinates as last geocoded
      if (lastGeocodedCoordsRef.current === coordKey) return

      // Clear existing timeout
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current)
      }

      geocodeTimeoutRef.current = setTimeout(async () => {
        try {
          setIsGeocodingLoading(true)
          lastGeocodedCoordsRef.current = coordKey

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
          )
          const data = await response.json()

          if (data && data.display_name) {
            setCurrentLocationName(data.display_name)
            setAddress(data.display_name)
            onAddressChange?.(data.display_name)

            // Update marker popup
            updateMarker(lat, lng, data.display_name)
          } else {
            const fallbackName = 'ตำแหน่งที่ระบุ'
            setCurrentLocationName(fallbackName)
            setAddress(fallbackName)
            onAddressChange?.(fallbackName)

            updateMarker(lat, lng, fallbackName)
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error)
          const fallbackName = 'ตำแหน่งที่ระบุ'
          setCurrentLocationName(fallbackName)
          setAddress(fallbackName)
          onAddressChange?.(fallbackName)

          updateMarker(lat, lng, fallbackName)
        } finally {
          setIsGeocodingLoading(false)
        }
      }, 300) // 300ms debounce for real-time feel
    },
    [onAddressChange, updateMarker],
  )

  // Optimized coordinate change handler
  const handleCoordinateChange = useCallback(
    async (lat: number, lng: number, skipGeocode = false) => {
      const roundedLat = parseFloat(lat.toFixed(4))
      const roundedLng = parseFloat(lng.toFixed(4))

      // Update coordinates immediately for real-time feedback
      setLatitude(roundedLat)
      setLongitude(roundedLng)

      // Call parent callbacks immediately
      onCoordinatesChange?.(roundedLat, roundedLng)

      // Update map view if needed
      if (mapInstanceRef.current) {
        const currentCenter = mapInstanceRef.current.getCenter()
        const distance = currentCenter.distanceTo([roundedLat, roundedLng])

        // Only pan if significant movement (> 100m) to avoid jittery movement
        if (distance > 100) {
          mapInstanceRef.current.panTo([roundedLat, roundedLng], {
            animate: true,
            duration: 0.5,
          })
        }
      }

      // Debounced reverse geocoding
      if (!skipGeocode) {
        debouncedReverseGeocode(roundedLat, roundedLng)
      }
    },
    [onCoordinatesChange, debouncedReverseGeocode],
  )

  // Get current location on component mount
  useEffect(() => {
    // If initial coordinates provided, use them instead of geolocation
    if (
      initialCoordinates &&
      initialCoordinates.lat !== 0 &&
      initialCoordinates.lng !== 0
    ) {
      setLatitude(initialCoordinates.lat)
      setLongitude(initialCoordinates.lng)
      if (initialAddress) {
        setAddress(initialAddress)
        setCurrentLocationName(initialAddress)
      }
      setIsLoadingLocation(false)
      return
    }

    if (!navigator.geolocation) {
      const errorMsg = 'เบราว์เซอร์ไม่รองรับการหาตำแหน่ง'
      console.error('Geolocation is not supported by this browser.')
      setLocationError(errorMsg)

      // Fallback to Bangkok coordinates
      const fallbackLat = 13.7563
      const fallbackLng = 100.5018
      const fallbackAddress = 'กรุงเทพมหานคร (ตำแหน่งเริ่มต้น)'

      setLatitude(fallbackLat)
      setLongitude(fallbackLng)
      setCurrentLocationName(fallbackAddress)
      setAddress(fallbackAddress)
      setIsLoadingLocation(false)

      // Call callbacks with fallback coordinates
      onCoordinatesChange?.(
        parseFloat(fallbackLat.toFixed(4)),
        parseFloat(fallbackLng.toFixed(4)),
      )
      onAddressChange?.(fallbackAddress)

      // Clear error after 5 seconds
      setTimeout(() => setLocationError(null), 5000)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: currentLat, longitude: currentLng } = position.coords
        setLatitude(currentLat)
        setLongitude(currentLng)

        // Get location name from coordinates
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLat}&lon=${currentLng}&zoom=14&addressdetails=1`,
          )
          const data = await response.json()
          if (data && data.display_name) {
            setCurrentLocationName(data.display_name)
            setAddress(data.display_name)
            onAddressChange?.(data.display_name)
          } else {
            const fallbackName = 'ตำแหน่งปัจจุบัน'
            setCurrentLocationName(fallbackName)
            setAddress(fallbackName)
            onAddressChange?.(fallbackName)
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error)
          const fallbackName = 'ตำแหน่งปัจจุบัน'
          setCurrentLocationName(fallbackName)
          setAddress(fallbackName)
          onAddressChange?.(fallbackName)
        }

        // Call coordinates callback
        onCoordinatesChange?.(
          parseFloat(currentLat.toFixed(4)),
          parseFloat(currentLng.toFixed(4)),
        )
        setIsLoadingLocation(false)
      },
      (error) => {
        console.error('Error getting location:', error)

        let errorMessage = 'ไม่สามารถเข้าถึงตำแหน่งได้'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'ผู้ใช้ปฏิเสธการเข้าถึงตำแหน่ง'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'ข้อมูลตำแหน่งไม่พร้อมใช้งาน'
            break
          case error.TIMEOUT:
            errorMessage = 'หมดเวลาการค้นหาตำแหน่ง'
            break
        }

        console.warn(
          `Geolocation error: ${errorMessage}. Using Bangkok fallback.`,
        )
        setLocationError(errorMessage)

        // Fallback to Bangkok coordinates if location access fails
        const fallbackLat = 13.7563
        const fallbackLng = 100.5018
        const fallbackAddress = 'กรุงเทพมหานคร (ตำแหน่งเริ่มต้น)'

        setLatitude(fallbackLat)
        setLongitude(fallbackLng)
        setCurrentLocationName(fallbackAddress)
        setAddress(fallbackAddress)
        setIsLoadingLocation(false)

        // Call callbacks with fallback coordinates
        onCoordinatesChange?.(
          parseFloat(fallbackLat.toFixed(4)),
          parseFloat(fallbackLng.toFixed(4)),
        )
        onAddressChange?.(fallbackAddress)

        // Clear error after 5 seconds
        setTimeout(() => setLocationError(null), 5000)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }, [initialCoordinates, initialAddress, onCoordinatesChange, onAddressChange])

  // Initialize map once and update content
  useEffect(() => {
    if (!mapRef.current || isMapInitializedRef.current || !currentCoordinates)
      return

    const timeoutId = setTimeout(() => {
      if (!mapRef.current || isCleaningUpRef.current || !currentCoordinates)
        return

      try {
        // Create map instance once with valid coordinates
        const map = L.map(mapRef.current, {
          center: [currentCoordinates.lat, currentCoordinates.lng],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: false,
          dragging: true,
          touchZoom: true,
          preferCanvas: true, // Better performance
        })

        mapInstanceRef.current = map
        isMapInitializedRef.current = true

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 3,
        }).addTo(map)

        // Set default cursor
        map.getContainer().style.cursor = 'grab'

        // Handle map clicks for pin mode with improved state handling
        let lastClickTime = 0
        const mapClickHandler = async (e: L.LeafletMouseEvent) => {
          // Check current pin mode from DOM attribute to avoid stale closure
          const container = map.getContainer()
          const currentPinMode =
            container.getAttribute('data-pin-mode') === 'true'

          if (!currentPinMode) return

          const now = Date.now()
          if (now - lastClickTime < 300) return // Throttle clicks
          lastClickTime = now

          const { lat, lng } = e.latlng

          // Update coordinates immediately
          const roundedLat = parseFloat(lat.toFixed(4))
          const roundedLng = parseFloat(lng.toFixed(4))

          setLatitude(roundedLat)
          setLongitude(roundedLng)

          // Call handlers
          onCoordinatesChange?.(roundedLat, roundedLng)

          // Start reverse geocoding
          debouncedReverseGeocode(roundedLat, roundedLng)

          // Exit pin mode after successful pin
          setIsPinMode(false)
          container.style.cursor = 'grab'
          container.removeAttribute('data-pin-mode')
        }

        map.on('click', mapClickHandler)

        // Handle map ready
        map.whenReady(() => {
          map.invalidateSize()
        })
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }, 50)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [currentCoordinates]) // Depend on coordinates to ensure map waits for valid location

  // Update map view and marker when coordinates change
  useEffect(() => {
    if (
      !currentCoordinates ||
      !mapInstanceRef.current ||
      !isMapInitializedRef.current
    )
      return

    const { lat, lng } = currentCoordinates

    try {
      // Set view if first time or significant movement
      const currentCenter = mapInstanceRef.current.getCenter()
      const distance = currentCenter
        ? currentCenter.distanceTo([lat, lng])
        : Infinity

      if (distance > 1000 || !currentCenter || !currentCenter.lat) {
        // Initial load or major change
        mapInstanceRef.current.setView([lat, lng], 15, { animate: true })
      }

      // Update marker
      const displayText = address || currentLocationName
      updateMarker(lat, lng, displayText)
    } catch (error) {
      console.error('Error updating map view:', error)
      // Fallback: try to set view without animation
      try {
        mapInstanceRef.current.setView([lat, lng], 15, { animate: false })
        updateMarker(lat, lng, address || currentLocationName)
      } catch (fallbackError) {
        console.error('Fallback map update also failed:', fallbackError)
      }
    }
  }, [currentCoordinates, address, currentLocationName, updateMarker])

  // Handle pin mode cursor change with DOM attribute sync
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const container = mapInstanceRef.current.getContainer()
    container.style.cursor = isPinMode ? 'crosshair' : 'grab'

    // Set DOM attribute for click handler reference
    if (isPinMode) {
      container.setAttribute('data-pin-mode', 'true')
    } else {
      container.removeAttribute('data-pin-mode')
    }
  }, [isPinMode])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clear any pending search timeouts
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current)
      }

      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      cleanupMap()
    }
  }, [cleanupMap])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Optimized search with request cancellation and instant search
  const searchAddresses = useCallback(
    async (addressText: string, abortController?: AbortController) => {
      if (!addressText.trim() || addressText.length < 1) {
        setSearchResults([])
        setShowSuggestions(false)
        return
      }

      setIsGeocodingLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            addressText,
          )}&limit=5&addressdetails=1`,
          { signal: abortController?.signal },
        )

        if (abortController?.signal.aborted) return

        const data = await response.json()

        // Check again after async operation
        if (abortController?.signal.aborted) return

        if (data && data.length > 0) {
          const results = data.map(
            (result: {
              lat: string
              lon: string
              display_name: string
              type?: string
              importance?: number
              place_id?: string
              addresstype?: string
              class?: string
              boundingbox?: string[]
            }) => {
              const {
                lat,
                lon,
                display_name,
                type,
                importance,
                place_id,
                addresstype,
                class: placeClass,
                boundingbox,
              } = result

              return {
                display_name,
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                type,
                importance,
                place_id,
                addresstype,
                class: placeClass,
                boundingbox,
              }
            },
          )
          setSearchResults(results)
          setShowSuggestions(true)
          setSelectedSuggestionIndex(-1)
        } else {
          setSearchResults([])
          setShowSuggestions(false)
          setSelectedSuggestionIndex(-1)
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error)
          setSearchResults([])
          setShowSuggestions(false)
          setSelectedSuggestionIndex(-1)
        }
      } finally {
        if (!abortController?.signal.aborted) {
          setIsGeocodingLoading(false)
        }
      }
    },
    [],
  )

  // Select a search result with smooth animation
  const selectSearchResult = useCallback(
    (result: (typeof searchResults)[0]) => {
      const roundedLat = parseFloat(result.lat.toFixed(4))
      const roundedLng = parseFloat(result.lon.toFixed(4))

      // Update state immediately for responsive UI
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)

      // Call coordinate change handler with skip geocode flag (we already have the address)
      handleCoordinateChange(roundedLat, roundedLng, true)

      // Update address immediately
      setAddress(result.display_name)
      setCurrentLocationName(result.display_name)
      onAddressChange?.(result.display_name)

      // Smooth map animation to new location
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([roundedLat, roundedLng], 15, {
          animate: true,
          duration: 1.5,
        })
      }
    },
    [handleCoordinateChange, onAddressChange],
  )

  // Optimized geocoding function
  const geocodeAddress = useCallback(
    async (addressText: string) => {
      if (!addressText.trim()) return

      setIsGeocodingLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            addressText,
          )}&limit=1`,
        )
        const data = await response.json()
        if (data && data.length > 0) {
          const result = data[0]
          selectSearchResult({
            display_name: result.display_name,
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon),
            type: result.type,
            importance: result.importance,
            place_id: result.place_id,
            addresstype: result.addresstype,
            class: result.class,
            boundingbox: result.boundingbox,
          })
        } else {
          alert('ไม่พบที่อยู่ที่ระบุ กรุณาลองใหม่อีกครั้ง')
        }
      } catch (error) {
        console.error('Geocoding error:', error)
        alert('เกิดข้อผิดพลาดในการค้นหาที่อยู่')
      } finally {
        setIsGeocodingLoading(false)
      }
    },
    [selectSearchResult],
  )

  // Handle address search with keyboard navigation
  const handleAddressSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (
        selectedSuggestionIndex >= 0 &&
        searchResults[selectedSuggestionIndex]
      ) {
        selectSearchResult(searchResults[selectedSuggestionIndex])
      } else {
        geocodeAddress(address)
      }
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (showSuggestions && searchResults.length > 0) {
        setSelectedSuggestionIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0,
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (showSuggestions && searchResults.length > 0) {
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1,
        )
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  // Handle address input change with proper request cancellation
  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setAddress(value)

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Clear suggestions immediately if input is empty
      if (value.length === 0) {
        setSearchResults([])
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        setIsGeocodingLoading(false)
        return
      }

      // Start searching from first character with very short debounce
      searchTimeoutRef.current = setTimeout(() => {
        if (value.trim()) {
          // Create new abort controller for this request
          const newAbortController = new AbortController()
          abortControllerRef.current = newAbortController
          searchAddresses(value, newAbortController)
        }
      }, 150) // Reduced to 150ms for almost instant search
    },
    [searchAddresses],
  )

  // Optimized coordinate input handlers with real-time updates
  const handleLatitudeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value === '') {
        setLatitude(null)
        return
      }

      const newLat = parseFloat(value)
      if (!isNaN(newLat) && newLat >= -90 && newLat <= 90) {
        setLatitude(parseFloat(newLat.toFixed(4)))
        if (longitude !== null) {
          handleCoordinateChange(parseFloat(newLat.toFixed(4)), longitude)
        }
      }
    },
    [longitude, handleCoordinateChange],
  )

  const handleLongitudeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value === '') {
        setLongitude(null)
        return
      }

      const newLng = parseFloat(value)
      if (!isNaN(newLng) && newLng >= -180 && newLng <= 180) {
        setLongitude(parseFloat(newLng.toFixed(4)))
        if (latitude !== null) {
          handleCoordinateChange(latitude, parseFloat(newLng.toFixed(4)))
        }
      }
    },
    [latitude, handleCoordinateChange],
  )

  return (
    <div className="space-y-6">
      {/* Location Error Notification */}
      {locationError && (
        <Alert className="border-amber-300 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="font-medium text-amber-800">
            {locationError} - ใช้ตำแหน่งกรุงเทพฯ เป็นค่าเริ่มต้น
          </AlertDescription>
        </Alert>
      )}

      {/* Address Search Section */}

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
              onFocus={() => {
                // Show existing suggestions on focus from first character
                if (searchResults.length > 0 && address.length >= 1) {
                  setShowSuggestions(true)
                }
              }}
              placeholder={t('charging-stations.address_placeholder')}
              disabled={false} // Never disable input field
              className="h-10 w-full border-none bg-[#f2f2f2] pr-10 transition-all duration-200 sm:h-11"
            />

            {/* Loading indicator inside input */}
            {isGeocodingLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Search Suggestions Dropdown */}
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

        {/* Spacer to prevent overlap when dropdown is open */}
        {showSuggestions && searchResults.length > 0 && (
          <div className="h-20"></div>
        )}
      </div>

      {/* Map container */}
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

        {/* Pin on map button - positioned at top right */}
        {!isLoadingLocation && (
          <div className="z-1000 absolute right-3 top-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsPinMode(!isPinMode)
                    }}
                    variant={isPinMode ? 'default' : 'default'}
                    size="sm"
                    className={`rounded-lg ${isPinMode ? '' : ''}`}
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

        {/* Pin mode instruction with smooth animation */}
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
      {/* Input fields for coordinates */}

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
