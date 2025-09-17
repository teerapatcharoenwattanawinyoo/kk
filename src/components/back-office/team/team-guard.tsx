'use client'

import FetchLoader from '@/components/FetchLoader'
import { useTeams } from '@/modules/teams/hooks/use-teams'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useMemo } from 'react'

interface TeamGuardProps {
  teamId: string
  locale: string
  children: ReactNode
  fallbackPath?: string // ถ้าไม่ระบุจะไปหน้า teams
  // ถ้าให้ true จะ redirect อัตโนมัติเมื่อไม่พบทีม/เกิด error (ค่าเริ่มต้น: false)
  autoRedirect?: boolean
}

export const TeamGuard = ({
  teamId,
  locale,
  children,
  fallbackPath,
  autoRedirect = false,
}: TeamGuardProps) => {
  const router = useRouter()
  const { data: teamsData, isLoading, error } = useTeams()

  const teams = useMemo(() => teamsData?.data?.data || [], [teamsData])
  const teamExists = useMemo(
    () =>
      Array.isArray(teams) &&
      teams.some((team: { team_group_id: number }) => team?.team_group_id?.toString() === teamId),
    [teams, teamId],
  )

  // Auto redirect ตามตัวเลือก
  useEffect(() => {
    if (!autoRedirect) return
    if (isLoading) return

    const redirectPath = fallbackPath || `/${locale}/team`

    // กรณี error หรือไม่มีข้อมูลเลย
    if (error || !teamsData) {
      router.replace(redirectPath)
      return
    }

    // กรณีไม่พบทีม
    if (!teamExists) {
      router.replace(redirectPath)
    }
  }, [autoRedirect, isLoading, error, teamsData, teamExists, router, locale, fallbackPath])

  // แสดง loading ขณะตรวจสอบ
  if (isLoading) {
    return (
      <div className="bg-mute-background flex h-screen items-center justify-center">
        <div className="text-center">
          <FetchLoader />
          <p className="mt-4 text-sm text-foreground">กำลังตรวจสอบข้อมูลทีม...</p>
        </div>
      </div>
    )
  }

  // ถ้ามี error หรือยังไม่มีข้อมูล
  if (error || !teamsData) {
    return (
      <div className="bg-mute-background flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">เกิดข้อผิดพลาด</h2>
          <p className="mb-4 text-sm text-gray-600">ไม่สามารถดึงข้อมูลทีมได้</p>
          {autoRedirect ? (
            <p className="text-xs text-muted-foreground">กำลังพาไปหน้าทีม...</p>
          ) : (
            <button
              onClick={() => router.replace(`/${locale}/team`)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              กลับไปหน้าทีม
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!teamExists) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">ไม่พบทีมนี้</h2>
          <p className="mb-4 text-sm text-gray-600">
            ทีม ID: <code className="rounded bg-gray-100 px-2 py-1">{teamId}</code>{' '}
            ไม่ถูกต้องหรือไม่มีอยู่ในระบบ
          </p>
          {autoRedirect ? (
            <p className="text-xs text-muted-foreground">กำลังพาไปหน้าทีม...</p>
          ) : (
            <button
              onClick={() => router.replace(`/${locale}/team`)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              กลับไปหน้าทีม
            </button>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
