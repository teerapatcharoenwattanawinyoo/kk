export interface MapCoordinates {
  lat: number
  lng: number
}

export interface MapClientProps {
  width?: string
  height?: string
  onCoordinatesChange?: (lat: number, lng: number) => void
  onAddressChange?: (address: string) => void
  initialCoordinates?: MapCoordinates
  initialAddress?: string
}

export interface MapSearchResult {
  display_name: string
  lat: number
  lon: number
  type?: string
  importance?: number
  place_id?: string
  addresstype?: string
  class?: string
  boundingbox?: string[]
}
