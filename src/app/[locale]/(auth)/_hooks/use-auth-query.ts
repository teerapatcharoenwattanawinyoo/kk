'use client'

import { fetchCurrentUser } from '@/app/[locale]/(auth)/_services'
import { QUERY_KEYS } from '@/lib/constants'
import { useInitialUser } from '@/lib/providers/user-provider'
import type { User } from '@/lib/schemas/user.schema'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useLogin, useLogout } from './use-auth-mutation'

const useUser = () => {
  const queryClient = useQueryClient()
  const { user: initialUser } = useInitialUser()
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: async () => {
      const user = await fetchCurrentUser()
      console.log('[useUser] fetched /api/auth/me', {
        ok: !!user,
        has_email: !!user?.email,
        has_phone: !!user?.phone,
      })
      queryClient.setQueryData(QUERY_KEYS.USER, user)
      const cached = queryClient.getQueryData(QUERY_KEYS.USER) as User | undefined
      console.log('[useUser] updated cache USER?', { ok: !!cached })
      return user
    },
    initialData: initialUser ?? undefined,
    initialDataUpdatedAt: Date.now(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })

  return {
    data: data as User | undefined,
    isLoading,
    error: (error as Error) ?? null,
  }
}

const useAuth = () => {
  const login = useLogin()
  const logout = useLogout()
  const { data: user, isLoading, error } = useUser()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)

    const handleAuthRefresh = () => {
      console.log('[useAuth] Auth refreshed, user data may be stale')
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:refreshed', handleAuthRefresh)
      return () => window.removeEventListener('auth:refreshed', handleAuthRefresh)
    }
  }, [])

  const isAuthenticated = hasMounted && !!user

  return {
    user: user as User | undefined,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
  }
}

export { useAuth, useUser }
