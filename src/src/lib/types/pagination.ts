export interface PaginatedLegacyString<T> {
  page: string
  page_total: number
  page_size: string
  item_total: number
  data: T[]
}

export interface PaginatedLegacyCurrent<T> {
  page_current: string | number
  page_total: number
  page_size: string | number
  item_total: number
  data: T[]
}

// Supports both common pagination shapes returned by the API
export type Paginated<T> = PaginatedLegacyString<T> | PaginatedLegacyCurrent<T>
