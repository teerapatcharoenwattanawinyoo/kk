'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'

interface ChargePointMapProps {
  latitude: string | number
  longitude: string | number
  name?: string
  address?: string
  className?: string
}

// Custom marker icon
const defaultIcon = L.icon({
  iconUrl: '/assets/images/icons/pinmaps.svg',
  iconRetinaUrl: '/assets/images/icons/pinmaps.svg',
  shadowUrl: '/assets/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export const ChargePointMap = ({
  latitude,
  longitude,
  name,
  address,
  className = 'h-48 w-full rounded-lg',
}: ChargePointMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return

    const lat = parseFloat(latitude.toString())
    const lng = parseFloat(longitude.toString())

    if (isNaN(lat) || isNaN(lng)) return

    // Create map
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: true,
    })

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Add marker
    const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map)

    // Add popup if name or address provided
    if (name || address) {
      const popupContent = `
        <div class="text-center">
          ${name ? `<div class="font-medium">${name}</div>` : ''}
          ${address ? `<div class="text-sm text-gray-600 mt-1">${address}</div>` : ''}
        </div>
      `
      marker.bindPopup(popupContent)
    }

    mapInstanceRef.current = map
    markerRef.current = marker

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, name, address])

  return <div ref={mapRef} className={className} />
}
