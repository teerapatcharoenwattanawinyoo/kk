'use client'

import { MemberGroupsTab, MembersTable, Pagination } from '@/components/back-office/team/members'
import { TeamTabMenu } from '@/components/back-office/team/settings/TeamTabMenu'
import { TeamHeader } from '@/components/back-office/team/team-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/lib/i18n'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

interface MembersPageProps {
  teamId: string
}

export function MembersPage({ teamId }: MembersPageProps) {
  const { t } = useI18n()
  const params = useParams()

  const [activeSubTab, setActiveSubTab] = useState('members')
  const [activeTeamTab, setActiveTeamTab] = useState('team-members')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  return (
    <div className="flex w-full flex-col">
      {/* Header Section */}
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.members')} />

      {/* Navigation Tabs Section */}
      <div className="px-4 md:px-6">
        <TeamTabMenu active="members" locale={String(params.locale)} teamId={teamId} />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 px-4 py-4 md:px-6">
        <div className="rounded-lg border bg-card">
          {/* Sub Tabs Section with Controls */}
          <div className="px-6 pb-4 pt-6">
            <div className="flex items-center justify-between border-b pb-4">
              {/* Left Side - Sub Tabs */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveSubTab('members')}
                  className={`pb-2 text-2xl font-medium tracking-[-0.84px] ${
                    activeSubTab === 'members'
                      ? 'text-title border-b-2 border-primary py-1 font-medium'
                      : 'text-muted-blue py-1'
                  }`}
                >
                  Members
                </button>
                <div className="h-8 w-px bg-[#CDD5DE]" />
                <button
                  onClick={() => setActiveSubTab('member-groups')}
                  className={`pb-2 text-2xl font-medium tracking-[-0.84px] ${
                    activeSubTab === 'member-groups'
                      ? 'text-title border-b-2 border-primary py-1 font-medium'
                      : 'text-muted-blue py-1'
                  }`}
                >
                  Member Groups
                </button>
              </div>

              {/* Right Side - Controls */}
              <div className="flex items-center gap-4">
                {/* Members Tab Controls */}
                {activeSubTab === 'members' && (
                  <>
                    {/* Search Box */}
                    <Input
                      type="text"
                      placeholder="Search"
                      className="font-public-sans h-9 w-64 bg-primary-foreground text-[13px] leading-[21px]"
                    />

                    {/* Team Tab Selector */}
                    <div className="flex overflow-hidden rounded-lg border bg-background px-1.5 py-1.5">
                      <button
                        onClick={() => setActiveTeamTab('team-members')}
                        className={`rounded-lg px-3 py-2 text-xs font-medium leading-[16px] tracking-[0.43px] transition-colors sm:px-4 sm:text-sm ${
                          activeTeamTab === 'team-members'
                            ? 'bg-[#051039] text-primary-foreground'
                            : 'text-muted-blue hover:text-title bg-transparent'
                        }`}
                      >
                        Team members
                      </button>
                      <button
                        onClick={() => setActiveTeamTab('guested-teams')}
                        className={`rounded-lg px-3 py-2 text-xs font-medium leading-[16px] tracking-[0.43px] transition-colors sm:px-4 sm:text-sm ${
                          activeTeamTab === 'guested-teams'
                            ? 'bg-[#051039] text-primary-foreground'
                            : 'text-muted-blue hover:text-title bg-transparent'
                        }`}
                      >
                        Guested Teams
                      </button>
                      <button
                        onClick={() => setActiveTeamTab('host-teams')}
                        className={`rounded-lg px-3 py-2 text-xs font-medium leading-[16px] tracking-[0.43px] transition-colors sm:px-4 sm:text-sm ${
                          activeTeamTab === 'host-teams'
                            ? 'bg-[#051039] text-primary-foreground'
                            : 'text-muted-blue hover:text-title bg-transparent'
                        }`}
                      >
                        Host Teams
                      </button>
                    </div>

                    {/* Invite Button */}
                    <Button className="flex h-9 items-center justify-center gap-[11.59px]">
                      <Plus className="h-4 w-4" />
                      <span>Invite</span>
                    </Button>
                  </>
                )}

                {/* Member Groups Controls */}
                {activeSubTab === 'member-groups' && (
                  <>
                    {/* Search Member Groups */}
                    <Input
                      type="text"
                      placeholder="Search Member Groups"
                      className="font-public-sans h-9 w-64 bg-primary-foreground text-[13px] leading-[21px]"
                    />
                    {/* Add Member Group Button */}
                    <Link href={`/${params.locale}/team/${teamId}/members/add-member-group`}>
                      <Button className="flex h-9 items-center gap-[11.59px]">
                        <Plus />
                        Add Member Group
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {activeSubTab === 'member-groups' ? (
            <MemberGroupsTab teamId={teamId} />
          ) : (
            <MembersTable />
          )}

          {/* Pagination Section*/}
          <div>
            <Pagination
              currentPage={currentPage}
              totalItems={130} // This should come from actual data
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage)
                setCurrentPage(1)
              }}
              showItemsPerPageSelector={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
