'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { QUERY_KEYS } from '@/lib/constants'

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error) => {
              if (
                typeof error === 'object' &&
                error !== null &&
                'status' in error &&
                (error.status === 401 || error.status === 403)
              ) {
                return false
              }

              if (error instanceof Error && error.message.includes('Session expired')) {
                return false
              }

              return failureCount < 2
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: false,
          },
          mutations: {
            retry: (failureCount, error) => {
              if (error instanceof Error && error.message.includes('Session expired')) {
                return false
              }
              return failureCount < 1
            },
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AuthRefreshListener queryClient={queryClient} />
    </QueryClientProvider>
  )
}

function AuthRefreshListener({ queryClient }: { queryClient: QueryClient }) {
  useEffect(() => {
    const handler = () => {
      try {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER })
      } catch {}
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:refreshed', handler)
      const storageHandler = (e: StorageEvent) => {
        if (e.key === 'auth_last_refreshed') handler()
      }
      window.addEventListener('storage', storageHandler)
      return () => {
        window.removeEventListener('auth:refreshed', handler)
        window.removeEventListener('storage', storageHandler)
      }
    }
  }, [queryClient])
  return null
}
