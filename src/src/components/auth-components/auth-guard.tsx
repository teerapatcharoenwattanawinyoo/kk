'use client'

import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted && !isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search
      if (currentPath !== '/sign-in' && !currentPath.includes('/sign-')) {
        sessionStorage.setItem('redirectAfterLogin', currentPath)
      }
      router.push(`${ROUTES.SIGN_IN}`)
    }
  }, [isAuthenticated, isLoading, router, hasMounted])

  if (!hasMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || null
  }

  return <>{children}</>
}
