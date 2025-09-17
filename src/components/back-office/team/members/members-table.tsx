'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

interface Member {
  id: string
  name: string
  role: string
  memberGroup: string | null
  priceGroup: string | null
  status: 'joined' | 'invite'
  joinedDate: string | null
  isOnline: boolean
}

interface MembersTableProps {
  // Props can be added here if needed for table data
  props: null
}

const mockMembers: Member[] = [
  {
    id: '182787',
    name: 'Soravit Kreankawo',
    role: 'Owner',
    memberGroup: 'C-Level Group',
    priceGroup: 'VIP Price',
    status: 'joined',
    joinedDate: '12/01/2023\n11 : 23 : 38',
    isOnline: true,
  },
  {
    id: '182781',
    name: 'Korakit Areonuo',
    role: 'User',
    memberGroup: 'Sales Group',
    priceGroup: 'General Price',
    status: 'invite',
    joinedDate: null,
    isOnline: true,
  },
  {
    id: '182783',
    name: 'Porait Hreonup',
    role: 'User',
    memberGroup: null,
    priceGroup: null,
    status: 'invite',
    joinedDate: null,
    isOnline: true,
  },
]

export function MembersTable({}: MembersTableProps) {
  const [selectAll] = useState(false)
  const [selectedMembers] = useState<string[]>([])

  return (
    <>
      {/* Table Section */}
      <div className="mx-4 mb-6 overflow-x-auto sm:mx-6">
        <Table>
          <TableHeader>
            <TableRow className="h-12 rounded-t-lg bg-primary text-primary-foreground hover:bg-primary">
              <TableHead className="w-[40px] rounded-tl-lg text-center sm:w-[60px]">
                <div className="flex justify-center">
                  <div className="h-3 w-3 rounded border bg-none sm:h-4 sm:w-4">
                    {selectAll && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      >
                        <path
                          d="M3 8L7 12L13 4"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </TableHead>
              <TableHead className="font-public-sans min-w-[250px] text-left text-[11px] font-medium uppercase leading-[15px] text-primary-foreground sm:w-[350px] sm:text-[13px]">
                MEMBERS
              </TableHead>
              <TableHead className="font-public-sans hidden text-center text-[11px] font-medium uppercase leading-[15px] text-primary-foreground sm:table-cell sm:w-[180px] sm:text-[13px]">
                MEMBER GROUP
              </TableHead>
              <TableHead className="font-public-sans hidden text-center text-[11px] font-medium uppercase leading-[15px] text-primary-foreground md:table-cell md:w-[180px] md:text-[13px]">
                PRICE GROUP
              </TableHead>
              <TableHead className="font-public-sans w-[100px] text-center text-[11px] font-medium uppercase leading-[15px] text-primary-foreground sm:w-[140px] sm:text-[13px]">
                STATUS
              </TableHead>
              <TableHead className="font-public-sans hidden text-center text-[11px] font-medium uppercase leading-[15px] text-primary-foreground lg:table-cell lg:w-[140px] lg:text-[13px]">
                JOINED
              </TableHead>
              <TableHead className="font-public-sans w-[60px] rounded-tr-lg text-center text-[11px] font-medium uppercase leading-[15px] text-primary-foreground sm:w-[100px] sm:text-[13px]">
                ACTION
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMembers.map((member) => (
              <TableRow key={member.id} className="h-14 border-0 bg-background sm:h-16">
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <div className="h-3 w-3 rounded border bg-primary-foreground sm:h-4 sm:w-4">
                      {selectedMembers.includes(member.id) && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 sm:h-4 sm:w-4"
                        >
                          <path
                            d="M3 8L7 12L13 4"
                            stroke="#355FF5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="relative mr-2 h-6 w-6 shrink-0 sm:mr-4 sm:h-8 sm:w-8">
                      <div className="h-6 w-6 rounded-full border bg-primary-foreground sm:h-8 sm:w-8"></div>
                      {member.isOnline && (
                        <div className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-[#0D8A72] sm:h-2 sm:w-2"></div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                        >
                          <path
                            d="M11 11C13.7614 11 16 8.76142 16 6C16 3.23858 13.7614 1 11 1C8.23858 1 6 3.23858 6 6C6 8.76142 8.23858 11 11 11Z"
                            fill="#B6B6B6"
                          />
                          <path
                            d="M21 21C21 16.5817 16.9706 13 12 13H10C5.02944 13 1 16.5817 1 21"
                            fill="#B6B6B6"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-title text-[12px] font-medium leading-[16px] tracking-[0.15px] sm:text-[14px] sm:leading-[18px]">
                        {member.name}
                      </div>
                      <div className="font-open-sans text-muted-blue text-[10px] leading-[14px] sm:text-[11px] sm:leading-[16px]">
                        {member.role}
                      </div>
                      {/* Show member group and price group on mobile */}
                      <div className="mt-1 block space-y-0.5 sm:hidden">
                        {member.memberGroup && (
                          <div className="text-[10px] text-muted-foreground">
                            Group: {member.memberGroup}
                          </div>
                        )}
                        {member.priceGroup && (
                          <div className="text-[10px] text-muted-foreground">
                            Price: {member.priceGroup}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-center sm:table-cell">
                  <span
                    className={`text-[10px] font-medium leading-[16px] tracking-[0.15px] sm:text-[12px] sm:leading-[18px] ${
                      member.memberGroup ? 'text-title' : 'text-[#DADADA]'
                    }`}
                  >
                    {member.memberGroup || 'No Member Group'}
                  </span>
                </TableCell>
                <TableCell className="hidden text-center md:table-cell">
                  <span
                    className={`text-[10px] font-medium leading-[16px] tracking-[0.15px] sm:text-[12px] sm:leading-[18px] ${
                      member.priceGroup ? 'text-title' : 'text-[#DADADA]'
                    }`}
                  >
                    {member.priceGroup || 'No Price Group'}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div
                    className={`inline-flex h-6 items-center rounded px-2 sm:h-7 sm:px-3 ${
                      member.status === 'joined' ? 'bg-[#DFF8F3]' : 'bg-[#D1E9FF]'
                    }`}
                  >
                    <span
                      className={`font-open-sans text-[10px] font-semibold leading-[20px] sm:text-[12px] sm:leading-[24px] ${
                        member.status === 'joined' ? 'text-[#0D8A72]' : 'text-[#40A3FF]'
                      }`}
                    >
                      {member.status === 'joined' ? 'Joined' : 'Invite'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  <span
                    className={`text-[10px] leading-[12px] tracking-[0.15px] sm:text-[11px] sm:leading-[14px] ${
                      member.joinedDate ? 'text-title whitespace-pre-line' : 'text-[#DADADA]'
                    }`}
                  >
                    {member.joinedDate || 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    className="h-6 w-6 rounded-full p-1 sm:h-8 sm:w-8 sm:p-1.5"
                  >
                    <MoreHorizontal className="text-title h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
