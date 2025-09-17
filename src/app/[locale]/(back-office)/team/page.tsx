'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useI18n } from '@/lib/i18n'
import { useTeams } from '@/modules/teams/hooks/use-teams'
import { ITeamList, Team } from '@/modules/teams/schemas/team.schema'
import { Pagination } from '@/ui/organisms/pagination'
import { TeamCard } from '@modules/teams/components'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const TeamPage = () => {
  const { t } = useI18n()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    data: teamsResponse,
    isLoading,
    error,
  } = useTeams({
    page: currentPage,
    pageSize: itemsPerPage,
    search: debouncedSearchQuery || undefined,
  })

  const teams: Team[] = useMemo(() => {
    if (!teamsResponse?.data?.data || !Array.isArray(teamsResponse.data.data)) {
      return []
    }

    return teamsResponse.data.data.map((teamData: ITeamList) => ({
      id: teamData.team_group_id.toString(),
      name: teamData.team_name,
      logoUrl: teamData.team_icon_group || undefined,
      members: teamData.members || 0,
      stations: teamData.station || 0,
      chargers: teamData.chargers || 0,
      connectors: teamData.connector || 0,
      package: teamData.package || '',
      wallet: teamData.wallet || 0,
    }))
  }, [teamsResponse])

  const totalTeams = teamsResponse?.data?.item_total || 0
  const totalPages = teamsResponse?.data?.page_total || 1

  const paginatedTeams = teams

  const handleAddTeam = () => {
    router.push('/team/team-add')
  }

  return (
    <div className="container mx-auto h-full">
      <div className="m-5 space-y-4 rounded-lg bg-card px-4 py-4 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <h1 className="text-title text-xl font-semibold sm:text-2xl">{t('team.your_team')}</h1>
          <Button
            className="w-full rounded-lg px-3 py-2 text-sm font-medium sm:w-auto sm:px-4 sm:text-base"
            onClick={handleAddTeam}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('team.add_team')}
          </Button>
        </div>
        <Separator className="text-muted-foreground" />

        <div className="mb-4 sm:mb-6">
          <Input
            placeholder={t('team.search_by_team')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted sm:max-w-sm"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-foreground">กำลังโหลด..</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <h3 className="text-lg font-medium text-red-800">เกิดข้อผิดพลาด</h3>
            <p className="mt-2 text-red-600">ไม่สามารถโหลดข้อมูล Team ได้ กรุณาลองอีกครั้ง</p>
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
          </div>
        )}

        {/* Teams Grid */}
        {!isLoading && !error && (
          <>
            {paginatedTeams.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {paginatedTeams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {debouncedSearchQuery ? 'ไม่พบ Team ที่ค้นหา' : 'ยังไม่มี Team'}
                </h3>
                <p className="mt-2 text-gray-500">
                  {debouncedSearchQuery
                    ? `ไม่พบ Team ที่มีชื่อที่ตรงกับ "${debouncedSearchQuery}"`
                    : 'เริ่มต้นสร้าง Team แรกของคุณ'}
                </p>
                {!debouncedSearchQuery && (
                  <Button className="mt-4 rounded-lg px-4 py-2 font-medium" onClick={handleAddTeam}>
                    <Plus className="mr-2 h-4 w-4" />
                    สร้าง Team แรก
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6 sm:mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalTeams}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TeamPage
