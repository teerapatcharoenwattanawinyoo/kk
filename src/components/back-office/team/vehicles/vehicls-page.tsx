'use client'
import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import { TeamTabMenu } from '@/app/[locale]/(back-office)/team/_components/team-tab-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useI18n } from '@/lib/i18n'
import { ChevronDown, Plus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import VehiclesCard from './vehicles-card'

interface VehiclesPageProps {
  teamId: string
}

interface Vehicle {
  id: string
  name: string
  image: string // Assuming image is a URL or path to the vehicle image
  macaddress: string
  brand: string
  model: string
  vehicleplate: string
  status: 'connected' | 'disconnected'
}

export default function VehiclesPage({ teamId }: VehiclesPageProps) {
  const { t } = useI18n()
  const params = useParams()

  const [currentPage, setCurrentPage] = useState(1)
  // Mock data moved from child component
  const mockVehicles: Vehicle[] = [
    {
      id: '1',
      image: 'https://www.electrifying.com/files/NJrrmuCgrZQIS_WK/TeslaModelS.png',
      name: 'My Wakim',
      macaddress: '02:E3:4F:8A:9C:D1',
      brand: 'Tesla',
      model: 'Model S',
      vehicleplate: 'EV-1234',
      status: 'connected',
    },
    {
      id: '2',
      image: 'https://ev-database.org/img/auto/BMW_i4_M50_2024/BMW_i4_M50_2024-01@2x.jpg',
      name: 'BMW i4 M50',
      macaddress: '04:7B:2D:F6:A8:E3',
      brand: 'BMW',
      model: 'i4',
      vehicleplate: 'BEV-567',
      status: 'disconnected',
    },
    {
      id: '3',
      image: 'https://example.com/nissan-leaf.jpg',
      name: 'Nissan LEAF e+',
      macaddress: '06:C9:1E:B4:7F:A2',
      brand: 'Nissan',
      model: 'LEAF',
      vehicleplate: 'NIS-890',
      status: 'connected',
    },
    {
      id: '4',
      image: 'https://example.com/audi-etron.jpg',
      name: 'Audi e-tron GT',
      macaddress: '08:A5:3B:D8:6E:C4',
      brand: 'Audi',
      model: 'e-tron GT',
      vehicleplate: 'AUD-123',
      status: 'connected',
    },
    {
      id: '5',
      image: 'https://example.com/hyundai-ioniq5.jpg',
      name: 'Hyundai IONIQ 5',
      macaddress: '0A:F2:7C:E9:4B:D6',
      brand: 'Hyundai',
      model: 'IONIQ 5',
      vehicleplate: 'HYU-456',
      status: 'disconnected',
    },
    {
      id: '6',
      image: 'https://example.com/mercedes-eqs.jpg',
      name: 'Mercedes EQS 450+',
      macaddress: '0C:B8:4A:7E:2F:91',
      brand: 'Mercedes-Benz',
      model: 'EQS',
      vehicleplate: 'MER-789',
      status: 'connected',
    },
  ]

  return (
    <div className="space-y-6 p-4">
      {/* Header Section */}
      <TeamHeader teamId={teamId} pageTitle={t('team_tabs.vehicles')} />

      {/* Navigation Tabs Section */}
      <div className="">
        <TeamTabMenu active="vehicles" locale={String(params.locale)} teamId={teamId} />
      </div>

      {/* Main Content Section */}
      <div className="flex-1">
        <div className="shadow-xs rounded-lg bg-card">
          {/* Search and Filter Section */}
          <div className="p-4 md:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div className="flex flex-1 gap-3">
                <div className="relative max-w-xs">
                  <Input
                    placeholder="Search by My Car"
                    className="h-10 w-48 border-slate-200 bg-[#ECF2F8] pl-4 pr-10 placeholder:font-medium placeholder:text-[#A1B1D1]"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute inset-y-0 right-0 h-full w-10 p-0"
                    type="button"
                  >
                    <svg
                      className="h-4 w-4 text-[#A1B1D1]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 gap-1 whitespace-nowrap bg-[#ECF2F8] text-xs sm:text-sm"
                >
                  <span className="text-[#A1B1D1]">Filter by Status</span>
                  <ChevronDown className="h-4 w-4 text-[#A1B1D1]" />
                </Button>
              </div>
              <Button
                variant={'default'}
                className="h-10 bg-blue-600 text-xs hover:bg-blue-700 sm:text-sm"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                ADD
              </Button>
            </div>
            <Separator className="my-4" />
          </div>

          {/* Card Section */}
          <div className="-mt-4 overflow-x-auto px-6">
            <VehiclesCard vehicles={mockVehicles} />
          </div>

          {/* Pagination Section */}
          <div className="my-4 border-gray-200 bg-card px-4 py-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="text-sm text-gray-700">Showing 1 to 10 of 130 Results</div>
                <div className="flex items-center">
                  <select
                    className="h-8 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm md:h-9 md:px-3"
                    defaultValue="10"
                  >
                    <option value="10">10 List</option>
                    <option value="20">20 List</option>
                    <option value="50">50 List</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant={'ghost'}
                  size="icon"
                  className="h-8 w-8 md:h-9 md:w-9"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 font-medium text-primary md:h-9 md:w-9">
                  1
                </div>
                <Button
                  variant={'ghost'}
                  size="icon"
                  className="h-8 w-8 md:h-9 md:w-9"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
