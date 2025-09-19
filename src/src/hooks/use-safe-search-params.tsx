import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useSafeSearchParams() {
  const searchParams = useSearchParams()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const safeGet = (key: string, defaultValue: string = '') => {
    if (!isHydrated) return defaultValue
    return searchParams.get(key) ?? defaultValue
  }

  const safeGetNumber = (key: string, defaultValue: number = 0) => {
    if (!isHydrated) return defaultValue
    return Number(searchParams.get(key)) || defaultValue
  }

  return {
    isHydrated,
    safeGet,
    safeGetNumber,
    searchParams: isHydrated ? searchParams : null,
  }
}
