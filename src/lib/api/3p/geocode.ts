import axios, { AxiosInstance } from 'axios'

// Minimal types based on fields used in the app
export interface NominatimSearchResult {
  display_name: string
  lat: number
  lon: number
  type?: string
  importance?: number
  place_id?: string | number
  addresstype?: string
  class?: string
  boundingbox?: string[]
}

export interface NominatimReverseResponse {
  display_name?: string
}

const geocodeClient: AxiosInstance = axios.create({
  baseURL: 'https://nominatim.openstreetmap.org',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: false — default
})

export async function reverseGeocode(
  lat: number,
  lon: number,
  options?: { signal?: AbortSignal },
): Promise<NominatimReverseResponse> {
  const { data } = await geocodeClient.get<NominatimReverseResponse>('/reverse', {
    params: { format: 'json', lat, lon, zoom: 14, addressdetails: 1 },
    signal: options?.signal,
  })
  return data
}

export async function searchGeocode(
  query: string,
  limit = 5,
  addressdetails = 1,
  options?: { signal?: AbortSignal },
): Promise<NominatimSearchResult[]> {
  const { data } = await geocodeClient.get<any[]>('/search', {
    params: { format: 'json', q: query, limit, addressdetails },
    signal: options?.signal,
  })
  // Normalize numeric lat/lon
  return (data || []).map((r) => ({
    display_name: r.display_name,
    lat: typeof r.lat === 'string' ? parseFloat(r.lat) : r.lat,
    lon: typeof r.lon === 'string' ? parseFloat(r.lon) : r.lon,
    type: r.type,
    importance: r.importance,
    place_id: r.place_id,
    addresstype: r.addresstype,
    class: r.class,
    boundingbox: r.boundingbox,
  }))
}

export async function geocodeOne(
  query: string,
  options?: { signal?: AbortSignal },
): Promise<NominatimSearchResult | null> {
  const results = await searchGeocode(query, 1, 1, { signal: options?.signal })
  return results[0] || null
}
