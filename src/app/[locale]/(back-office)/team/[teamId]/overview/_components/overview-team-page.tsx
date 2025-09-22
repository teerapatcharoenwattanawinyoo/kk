'use client'

import FetchLoader from '@/components/FetchLoader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { LineChart } from '@/components/ui/line-chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatsCard, type StatsCardProps } from '@/components/ui/stats-card'
import { useI18n } from '@/lib/i18n'
import { Activity, BarChart3, DollarSign, Download, Zap } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { TeamHeader } from '../../../_components/team-header'
import { getTeamTabs, TeamTabMenu } from '../../../_components/team-tab-menu'
import { useTransactionList } from '../_hooks/use-transaction'
import { type TableColumn } from './overview-table'

interface OverviewTeamPageProps {
  teamId: string
}

export const OverviewTeamPage = ({ teamId }: OverviewTeamPageProps) => {
  const { t } = useI18n()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState(t('overview.last_7_days'))
  const [activeTab] = useState('overview')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const params = useParams()

  // Get team tabs
  const TEAM_TABS = getTeamTabs(t)

  // API Hooks
  const {
    data: transactionData,
    isLoading: isLoadingTransactions,
    error: transactionError,
  } = useTransactionList({
    teamId,
    page: currentPage,
    pageSize: 10,
    search: searchQuery,
  })

  const tableData = (transactionData?.data?.data || []) as unknown as Record<string, unknown>[]

  const handleRowClick = (row: Record<string, unknown>) => {
    const transactionId = String(row.id || row.order_number)
    router.push(`/${params.locale}/team/${teamId}/overview/transaction/${transactionId}`)
  }

  // Mock data for the overview
  const statsData: StatsCardProps[] = [
    {
      title: t('overview.total_revenue'),
      value: '840,689',
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      trend: {
        value: `3% ${t('overview.up_from_yesterday')}`,
        type: 'up' as const,
      },
      iconBackgroundColor: '#F0FDF4',
    },
    {
      title: t('overview.after_service_fee'),
      value: '810,293',
      icon: <BarChart3 className="h-6 w-6 text-yellow-600" />,
      trend: {
        value: `11% ${t('overview.up_from_past_week')}`,
        type: 'up' as const,
      },
      iconBackgroundColor: '#FFFBEB',
    },
    {
      title: t('overview.total_kwh'),
      value: '8,900 kWh',
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      trend: {
        value: `6% ${t('overview.down_from_yesterday')}`,
        type: 'down' as const,
      },
      iconBackgroundColor: '#FFFBEB',
    },
    {
      title: t('overview.total_charges'),
      value: '2040',
      icon: <Activity className="h-6 w-6 text-red-600" />,
      trend: {
        value: `1% ${t('overview.up_from_yesterday')}`,
        type: 'up' as const,
      },
      iconBackgroundColor: '#FEF2F2',
    },
  ]

  const tableColumns: TableColumn<Record<string, unknown>>[] = [
    {
      key: 'order_number',
      header: t('table.order_number'),
      width: '15%',
      render: (value: string) => <span style={{ color: '#6E82A5' }}>{value}</span>,
    },
    {
      key: 'charging_station',
      header: t('table.charging_station'),
      width: '15%',
    },
    { key: 'charger_id', header: t('table.charger'), width: '10%' },
    {
      key: 'rate',
      header: t('table.rate'),
      width: '8%',
      render: (value: string) => `฿${value ?? '-'}/kWh`,
    },
    {
      key: 'start_charge_date',
      header: t('table.start_charge'),
      width: '12%',
      render: (value: string, row: Record<string, unknown>) => (
        <div className="text-center">
          <div>{value}</div>
          <div style={{ color: '#6E82A5' }}>{String(row.start_charge_time || '')}</div>
        </div>
      ),
    },
    {
      key: 'stop_charge_date',
      header: t('table.stop_charge'),
      width: '12%',
      render: (value: string, row: Record<string, unknown>) => (
        <div className="text-center">
          <div>{value}</div>
          <div style={{ color: '#6E82A5' }}>{String(row.stop_charge_time || '')}</div>
        </div>
      ),
    },
    {
      key: 'time',
      header: t('table.time'),
      width: '8%',
      render: (value: string) => {
        if (!value) return '-'
        if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value
        const num = Number(value)
        if (!isNaN(num)) {
          const h = Math.floor(num / 60)
          const m = Math.floor(num % 60)
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`
        }
        return value
      },
    },
    {
      key: 'kwh',
      header: t('table.kwh'),
      width: '8%',
      render: (value: string) => {
        const num = Number(value)
        return isNaN(num) ? '-' : `${num.toFixed(2)} kWh`
      },
    },
    {
      key: 'price',
      header: t('table.cost'),
      width: '8%',
      render: (value: string) => {
        // Format as currency (Baht)
        const num = Number(value)
        return isNaN(num)
          ? value
          : `฿${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      },
    },
    { key: 'payment_method', header: t('table.payment'), width: '10%' },
    {
      key: 'status',
      header: t('table.status'),
      width: '10%',
      render: (value: string) => {
        let bg = '#DFF8F3',
          color = '#0D8A72',
          text = value
        if (value === 'pending') {
          bg = '#FEF3C7'
          color = '#92400E'
          text = t('status.pending')
        } else if (value === 'failed' || value === 'cancelled') {
          bg = '#FEE2E2'
          color = '#DC2626'
          text = t('status.failed')
        } else if (value === 'processing') {
          bg = '#DBEAFE'
          color = '#1D4ED8'
          text = t('status.processing')
        } else if (!value || value === 'completed') {
          bg = '#DFF8F3'
          color = '#0D8A72'
          text = t('status.completed')
        }
        return (
          <span
            className="rounded-full px-2 py-1 text-xs font-medium"
            style={{ backgroundColor: bg, color }}
          >
            {text}
          </span>
        )
      },
    },
    {
      key: 'action',
      header: t('table.action'),
      width: '10%',
      render: (value: string, row: Record<string, unknown>) => (
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={() => {
            const transactionId = String(row.id || row.order_number)
            router.push(`/${params.locale}/team/${teamId}/overview/transaction/${transactionId}`)
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      ),
    },
  ]

  const chartData = [
    { label: '5k', value: 19500 },
    { label: '10k', value: 32500 },
    { label: '15k', value: 48500 },
    { label: '20k', value: 25800 },
    { label: '25k', value: 38200 },
    { label: '30k', value: 49800 },
    { label: '35k', value: 44650 },
    { label: '40k', value: 52100 },
    { label: '45k', value: 24200 },
    { label: '50k', value: 29800 },
    { label: '55k', value: 18500 },
    { label: '60k', value: 44364.77 }, // Peak value from design
    { label: '65k', value: 58200 },
    { label: '70k', value: 41800 },
    { label: '75k', value: 55600 },
    { label: '80k', value: 47900 },
    { label: '85k', value: 52300 },
    { label: '90k', value: 38700 },
    { label: '95k', value: 42100 },
    { label: '100k', value: 49850 },
  ]

  return (
    <div className="min-h-screen">
      {/* Header with team info */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/bgHero1.svg"
            alt="Background pattern"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
        </div>

        <div className="relative z-10 p-6 text-white">
          <TeamHeader teamId={teamId} pageTitle={t('team_tabs.overview')} variant="hero" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative z-20 -mt-16 mb-8 px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              iconBackgroundColor={stat.iconBackgroundColor}
            />
          ))}
        </div>
      </div>

      {/* Common Team Tab Menu */}
      <div className="mb-6 px-6">
        <TeamTabMenu active={activeTab} locale={String(params.locale)} teamId={teamId} />
      </div>

      {/* Main Content */}
      <div className="mb-6 space-y-6 px-6">
        {activeTab === 'overview' && (
          <>
            {/* Chart Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('overview.charge_sessions')}</CardTitle>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t('overview.last_7_days')}>
                      {t('overview.last_7_days')}
                    </SelectItem>
                    <SelectItem value={t('overview.last_30_days')}>
                      {t('overview.last_30_days')}
                    </SelectItem>
                    <SelectItem value={t('overview.last_3_months')}>
                      {t('overview.last_3_months')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <LineChart data={chartData} height={400} showGrid={true} showTooltip={true} />
              </CardContent>
            </Card>

            {/* Table Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('overview.charge_sessions')}</CardTitle>
                <Button variant={'darkwhite'} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>{t('overview.export')}</span>
                </Button>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {t('overview.search_by_id')}
                    </span>
                    <Input
                      type="text"
                      placeholder=""
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {t('overview.filter_by_status')}
                    </span>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder={t('overview.all')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('overview.all')}</SelectItem>
                        <SelectItem value="completed">{t('status.completed')}</SelectItem>
                        <SelectItem value="pending">{t('status.pending')}</SelectItem>
                        <SelectItem value="failed">{t('buttons.cancel')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{t('overview.date_by')}</span>
                    <Select defaultValue="all_dates">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder={t('overview.all_dates')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_dates">{t('overview.all_dates')}</SelectItem>
                        <SelectItem value="today">{t('overview.today')}</SelectItem>
                        <SelectItem value="week">{t('overview.this_week')}</SelectItem>
                        <SelectItem value="month">{t('overview.this_month')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isLoadingTransactions ? (
                  <FetchLoader />
                ) : transactionError ? (
                  <div className="flex items-center justify-center py-8 text-red-500">
                    <p>Error loading transaction data</p>
                  </div>
                ) : (
                  <DataTable columns={tableColumns} data={tableData} onRowClick={handleRowClick} />
                )}

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {transactionData?.data
                      ? `Showing ${(transactionData.data.page_current - 1) * transactionData.data.page_size + 1}-${Math.min(transactionData.data.page_current * transactionData.data.page_size, transactionData.data.item_total)} of ${transactionData.data.item_total} results`
                      : t('overview.showing_results')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!transactionData?.data || currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    {transactionData?.data &&
                      [...Array(Math.min(5, transactionData.data.page_total))].map((_, index) => {
                        const page = index + 1
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        )
                      })}
                    {transactionData?.data && transactionData.data.page_total > 5 && (
                      <>
                        <span>...</span>
                        <Button
                          variant={
                            currentPage === transactionData.data.page_total ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => setCurrentPage(transactionData.data.page_total)}
                        >
                          {transactionData.data.page_total}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        !transactionData?.data || currentPage === transactionData.data.page_total
                      }
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Add other tab content here as needed */}
        {activeTab !== 'overview' && (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="mb-2 text-lg font-medium text-muted-foreground">
                {TEAM_TABS.find((tab) => tab.value === activeTab)?.label}
              </h3>
              <p className="text-muted-foreground">This section is under development.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
