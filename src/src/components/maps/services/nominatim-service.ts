import type { MapSearchResult } from '../types'

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

const toSearchResult = (entry: any): MapSearchResult => ({
  display_name: entry.display_name,
  lat: parseFloat(entry.lat),
  lon: parseFloat(entry.lon),
  type: entry.type,
  importance: entry.importance,
  place_id: entry.place_id,
  addresstype: entry.addresstype,
  class: entry.class,
  boundingbox: entry.boundingbox,
})

const buildUrl = (path: string, params: Record<string, string>) => {
  const url = new URL(`${NOMINATIM_BASE_URL}/${path}`)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return url.toString()
}

export interface SearchAddressOptions {
  signal?: AbortSignal
  limit?: number
}

export async function searchAddresses(
  query: string,
  options: SearchAddressOptions = {},
): Promise<MapSearchResult[]> {
  const { signal, limit = 5 } = options

  const url = buildUrl('search', {
    format: 'json',
    q: query,
    limit: String(limit),
    addressdetails: '1',
  })

  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`Search request failed with status ${response.status}`)
  }

  const payload = await response.json()

  if (!Array.isArray(payload)) {
    return []
  }

  return payload.map(toSearchResult)
}

export async function geocodeAddress(
  address: string,
): Promise<MapSearchResult | null> {
  const results = await searchAddresses(address, { limit: 1 })
  return results[0] ?? null
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const url = buildUrl('reverse', {
    format: 'json',
    lat: latitude.toString(),
    lon: longitude.toString(),
    zoom: '14',
    addressdetails: '1',
  })

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Reverse geocoding failed with status ${response.status}`)
  }

  const payload = await response.json()

  return payload?.display_name ?? null
}
