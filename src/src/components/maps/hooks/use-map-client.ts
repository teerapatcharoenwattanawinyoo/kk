import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ChangeEvent, KeyboardEvent, MouseEvent, RefObject } from 'react'
import L from 'leaflet'

import type { MapClientProps, MapSearchResult } from '../types'
import {
  geocodeAddress as geocodeAddressService,
  reverseGeocode as reverseGeocodeService,
  searchAddresses as searchAddressesService,
} from '../services/nominatim-service'

const defaultIcon = L.icon({
  iconUrl: '/assets/images/icons/pinmaps.svg',
  iconRetinaUrl: '/assets/images/icons/pinmaps.svg',
  shadowUrl: '/assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const FALLBACK_PIN_LABEL = 'ตำแหน่งที่ระบุ'
const CURRENT_POSITION_LABEL = 'ตำแหน่งปัจจุบัน'
const FALLBACK_LOCATION = {
  lat: 13.7563,
  lng: 100.5018,
  address: 'กรุงเทพมหานคร (ตำแหน่งเริ่มต้น)',
}
const LOCATION_UNSUPPORTED_MESSAGE = 'เบราว์เซอร์ไม่รองรับการหาตำแหน่ง'

const SEARCH_DEBOUNCE_MS = 150
const REVERSE_GEOCODE_DEBOUNCE_MS = 300
const MAP_PIN_THROTTLE_MS = 300
const MIN_PAN_DISTANCE_METERS = 100
const MAP_DEFAULT_ZOOM = 15

export type UseMapClientProps = Omit<MapClientProps, 'width' | 'height'>

export interface UseMapClientResult {
  address: string
  isGeocodingLoading: boolean
  showSuggestions: boolean
  searchResults: MapSearchResult[]
  selectedSuggestionIndex: number
  isLoadingLocation: boolean
  isPinMode: boolean
  locationError: string | null
  latitude: number | null
  longitude: number | null
  mapRef: RefObject<HTMLDivElement>
  searchContainerRef: RefObject<HTMLDivElement>
  handleAddressChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleAddressSearch: (event: KeyboardEvent<HTMLInputElement>) => void
  handleAddressFocus: () => void
  handleLatitudeChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleLongitudeChange: (event: ChangeEvent<HTMLInputElement>) => void
  selectSearchResult: (result: MapSearchResult) => void
  togglePinMode: (event: MouseEvent<HTMLButtonElement>) => void
}

export function useMapClient({
  onCoordinatesChange,
  onAddressChange,
  initialCoordinates,
  initialAddress,
}: UseMapClientProps): UseMapClientResult {
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
  const lastPinClickRef = useRef(0)

  const [latitude, setLatitude] = useState<number | null>(
    initialCoordinates?.lat ?? null,
  )
  const [longitude, setLongitude] = useState<number | null>(
    initialCoordinates?.lng ?? null,
  )
  const [address, setAddress] = useState<string>(initialAddress ?? '')
  const [currentLocationName, setCurrentLocationName] =
    useState<string>(CURRENT_POSITION_LABEL)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<MapSearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [isPinMode, setIsPinMode] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const currentCoordinates = useMemo(() => {
    if (latitude === null || longitude === null) return null
    return { lat: latitude, lng: longitude }
  }, [latitude, longitude])

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

  const updateMarker = useCallback(
    (lat: number, lng: number, popupText: string) => {
      if (!mapInstanceRef.current) return

      try {
        if (
          markerRef.current &&
          mapInstanceRef.current.hasLayer(markerRef.current)
        ) {
          mapInstanceRef.current.removeLayer(markerRef.current)
        }

        const newMarker = L.marker([lat, lng], {
          icon: defaultIcon,
          riseOnHover: true,
        }).addTo(mapInstanceRef.current)

        markerRef.current = newMarker
        newMarker.bindPopup(popupText)

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

  const debouncedReverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      const coordKey = `${lat.toFixed(4)},${lng.toFixed(4)}`

      if (lastGeocodedCoordsRef.current === coordKey) return

      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current)
      }

      geocodeTimeoutRef.current = setTimeout(async () => {
        try {
          setIsGeocodingLoading(true)
          lastGeocodedCoordsRef.current = coordKey

          const displayName = await reverseGeocodeService(lat, lng)
          const fallbackName = displayName ?? FALLBACK_PIN_LABEL

          setCurrentLocationName(fallbackName)
          setAddress(fallbackName)
          onAddressChange?.(fallbackName)

          updateMarker(lat, lng, fallbackName)
        } catch (error) {
          console.error('Reverse geocoding error:', error)
          setCurrentLocationName(FALLBACK_PIN_LABEL)
          setAddress(FALLBACK_PIN_LABEL)
          onAddressChange?.(FALLBACK_PIN_LABEL)

          updateMarker(lat, lng, FALLBACK_PIN_LABEL)
        } finally {
          setIsGeocodingLoading(false)
        }
      }, REVERSE_GEOCODE_DEBOUNCE_MS)
    },
    [onAddressChange, updateMarker],
  )

  const handleCoordinateChange = useCallback(
    async (lat: number, lng: number, skipGeocode = false) => {
      const roundedLat = parseFloat(lat.toFixed(4))
      const roundedLng = parseFloat(lng.toFixed(4))

      setLatitude(roundedLat)
      setLongitude(roundedLng)

      onCoordinatesChange?.(roundedLat, roundedLng)

      if (mapInstanceRef.current) {
        const currentCenter = mapInstanceRef.current.getCenter()
        const distance = currentCenter.distanceTo([roundedLat, roundedLng])

        if (distance > MIN_PAN_DISTANCE_METERS) {
          mapInstanceRef.current.panTo([roundedLat, roundedLng], {
            animate: true,
            duration: 0.5,
          })
        }
      }

      if (!skipGeocode) {
        debouncedReverseGeocode(roundedLat, roundedLng)
      }
    },
    [onCoordinatesChange, debouncedReverseGeocode],
  )

  useEffect(() => {
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
      console.error('Geolocation is not supported by this browser.')
      setLocationError(LOCATION_UNSUPPORTED_MESSAGE)

      setLatitude(FALLBACK_LOCATION.lat)
      setLongitude(FALLBACK_LOCATION.lng)
      setCurrentLocationName(FALLBACK_LOCATION.address)
      setAddress(FALLBACK_LOCATION.address)
      setIsLoadingLocation(false)

      onCoordinatesChange?.(
        parseFloat(FALLBACK_LOCATION.lat.toFixed(4)),
        parseFloat(FALLBACK_LOCATION.lng.toFixed(4)),
      )
      onAddressChange?.(FALLBACK_LOCATION.address)

      setTimeout(() => setLocationError(null), 5000)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: currentLat, longitude: currentLng } = position.coords
        setLatitude(currentLat)
        setLongitude(currentLng)

        try {
          const displayName = await reverseGeocodeService(
            currentLat,
            currentLng,
          )
          const resolvedName = displayName ?? CURRENT_POSITION_LABEL
          setCurrentLocationName(resolvedName)
          setAddress(resolvedName)
          onAddressChange?.(resolvedName)
        } catch (error) {
          console.error('Reverse geocoding error:', error)
          setCurrentLocationName(CURRENT_POSITION_LABEL)
          setAddress(CURRENT_POSITION_LABEL)
          onAddressChange?.(CURRENT_POSITION_LABEL)
        }

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

        setLatitude(FALLBACK_LOCATION.lat)
        setLongitude(FALLBACK_LOCATION.lng)
        setCurrentLocationName(FALLBACK_LOCATION.address)
        setAddress(FALLBACK_LOCATION.address)
        setIsLoadingLocation(false)

        onCoordinatesChange?.(
          parseFloat(FALLBACK_LOCATION.lat.toFixed(4)),
          parseFloat(FALLBACK_LOCATION.lng.toFixed(4)),
        )
        onAddressChange?.(FALLBACK_LOCATION.address)

        setTimeout(() => setLocationError(null), 5000)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }, [initialCoordinates, initialAddress, onCoordinatesChange, onAddressChange])

  useEffect(() => {
    if (!mapRef.current || isMapInitializedRef.current || !currentCoordinates)
      return

    const timeoutId = setTimeout(() => {
      if (!mapRef.current || isCleaningUpRef.current || !currentCoordinates)
        return

      try {
        const map = L.map(mapRef.current, {
          center: [currentCoordinates.lat, currentCoordinates.lng],
          zoom: MAP_DEFAULT_ZOOM,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: false,
          dragging: true,
          touchZoom: true,
          preferCanvas: true,
        })

        mapInstanceRef.current = map
        isMapInitializedRef.current = true

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 3,
        }).addTo(map)

        map.getContainer().style.cursor = 'grab'

        const mapClickHandler = async (e: L.LeafletMouseEvent) => {
          const container = map.getContainer()
          const currentPinMode =
            container.getAttribute('data-pin-mode') === 'true'

          if (!currentPinMode) return

          const now = Date.now()
          if (now - lastPinClickRef.current < MAP_PIN_THROTTLE_MS) return
          lastPinClickRef.current = now

          const { lat, lng } = e.latlng

          const roundedLat = parseFloat(lat.toFixed(4))
          const roundedLng = parseFloat(lng.toFixed(4))

          setLatitude(roundedLat)
          setLongitude(roundedLng)

          onCoordinatesChange?.(roundedLat, roundedLng)

          debouncedReverseGeocode(roundedLat, roundedLng)

          setIsPinMode(false)
          container.style.cursor = 'grab'
          container.removeAttribute('data-pin-mode')
        }

        map.on('click', mapClickHandler)

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
  }, [currentCoordinates, debouncedReverseGeocode, onCoordinatesChange])

  useEffect(() => {
    if (
      !currentCoordinates ||
      !mapInstanceRef.current ||
      !isMapInitializedRef.current
    )
      return

    const { lat, lng } = currentCoordinates

    try {
      const currentCenter = mapInstanceRef.current.getCenter()
      const distance = currentCenter
        ? currentCenter.distanceTo([lat, lng])
        : Infinity

      if (distance > 1000 || !currentCenter || !currentCenter.lat) {
        mapInstanceRef.current.setView([lat, lng], MAP_DEFAULT_ZOOM, {
          animate: true,
        })
      }

      const displayText = address || currentLocationName
      updateMarker(lat, lng, displayText)
    } catch (error) {
      console.error('Error updating map view:', error)
      try {
        mapInstanceRef.current.setView([lat, lng], MAP_DEFAULT_ZOOM, {
          animate: false,
        })
        updateMarker(lat, lng, address || currentLocationName)
      } catch (fallbackError) {
        console.error('Fallback map update also failed:', fallbackError)
      }
    }
  }, [currentCoordinates, address, currentLocationName, updateMarker])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    const container = mapInstanceRef.current.getContainer()
    container.style.cursor = isPinMode ? 'crosshair' : 'grab'

    if (isPinMode) {
      container.setAttribute('data-pin-mode', 'true')
    } else {
      container.removeAttribute('data-pin-mode')
    }
  }, [isPinMode])

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current)
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      cleanupMap()
    }
  }, [cleanupMap])

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

  const searchAddresses = useCallback(
    async (addressText: string, abortController?: AbortController) => {
      if (!addressText.trim() || addressText.length < 1) {
        setSearchResults([])
        setShowSuggestions(false)
        return
      }

      setIsGeocodingLoading(true)
      try {
        const results = await searchAddressesService(addressText, {
          signal: abortController?.signal,
          limit: 5,
        })

        if (abortController?.signal.aborted) return

        if (results.length > 0) {
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

  const selectSearchResult = useCallback(
    (result: MapSearchResult) => {
      const roundedLat = parseFloat(result.lat.toFixed(4))
      const roundedLng = parseFloat(result.lon.toFixed(4))

      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)

      handleCoordinateChange(roundedLat, roundedLng, true)

      setAddress(result.display_name)
      setCurrentLocationName(result.display_name)
      onAddressChange?.(result.display_name)

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([roundedLat, roundedLng], MAP_DEFAULT_ZOOM, {
          animate: true,
          duration: 1.5,
        })
      }
    },
    [handleCoordinateChange, onAddressChange],
  )

  const geocodeAddress = useCallback(
    async (addressText: string) => {
      if (!addressText.trim()) return

      setIsGeocodingLoading(true)
      try {
        const result = await geocodeAddressService(addressText)
        if (result) {
          selectSearchResult(result)
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

  const handleAddressSearch = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
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
    },
    [
      address,
      geocodeAddress,
      searchResults,
      selectedSuggestionIndex,
      selectSearchResult,
      showSuggestions,
    ],
  )

  const handleAddressChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setAddress(value)

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      if (value.length === 0) {
        setSearchResults([])
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        setIsGeocodingLoading(false)
        return
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (value.trim()) {
          const newAbortController = new AbortController()
          abortControllerRef.current = newAbortController
          searchAddresses(value, newAbortController)
        }
      }, SEARCH_DEBOUNCE_MS)
    },
    [searchAddresses],
  )

  const handleAddressFocus = useCallback(() => {
    if (searchResults.length > 0 && address.length >= 1) {
      setShowSuggestions(true)
    }
  }, [searchResults, address])

  const handleLatitudeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value === '') {
        setLatitude(null)
        return
      }

      const newLat = parseFloat(value)
      if (!isNaN(newLat) && newLat >= -90 && newLat <= 90) {
        const roundedLat = parseFloat(newLat.toFixed(4))
        setLatitude(roundedLat)
        if (longitude !== null) {
          handleCoordinateChange(roundedLat, longitude)
        }
      }
    },
    [longitude, handleCoordinateChange],
  )

  const handleLongitudeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value === '') {
        setLongitude(null)
        return
      }

      const newLng = parseFloat(value)
      if (!isNaN(newLng) && newLng >= -180 && newLng <= 180) {
        const roundedLng = parseFloat(newLng.toFixed(4))
        setLongitude(roundedLng)
        if (latitude !== null) {
          handleCoordinateChange(latitude, roundedLng)
        }
      }
    },
    [latitude, handleCoordinateChange],
  )

  const togglePinMode = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsPinMode((prev) => !prev)
    },
    [],
  )

  return {
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
  }
}
