'use client'

import { TeamHeader } from '@/components/back-office/team/team-header'
import { TeamTabs } from '@/components/back-office/team/team-tabs'
import { LineChart } from '@/components/line-chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, ChartBar, ChartLine, ChevronDown, Pencil } from 'lucide-react'
import { useState } from 'react'

interface TeamOverviewProps {
  teamId: string
}

export function TeamOverview({ teamId }: TeamOverviewProps) {
  const [month] = useState('October')

  // Mock data for the team based on teamId
  const teamData = {
    id: teamId,
    name:
      teamId === 'onecharge-gang'
        ? 'OneCharge Gang'
        : teamId === 'one-co-ltd'
          ? 'One Co.ltd'
          : teamId === 'sitt-group'
            ? 'SITT Group'
            : 'Delept Tech',
    teamId: 'ID Team : ONE678-18907',
    revenue: 40689,
    serviceFee: 10293,
    kWh: 8900,
    charges: 2040,
    revenueChange: 8.5,
    serviceFeeChange: 3.5,
    kWhChange: -4.3,
    chargesChange: 1.6,
  }

  // Mock data for charge sessions
  const chargeSessions = [
    {
      orderNumber: 'CP00378503-379',
      station: 'OneCharge Charging Station',
      charger: 'Phev Charger 1',
      rate: '80.0/kWh',
      startCharge: '9/7/2023 5:10 PM',
      stopCharge: '9/7/2023 6:10 PM',
      time: '1 hr',
      kWh: '10 kWh',
      revenue: '฿899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378503-378',
      station: 'OneCharge Charging Station',
      charger: 'Phev Charger 1',
      rate: '80.0/kWh',
      startCharge: '9/7/2023 5:10 PM',
      stopCharge: '9/7/2023 6:10 PM',
      time: '1 hr',
      kWh: '10 kWh',
      revenue: '฿899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378503-377',
      station: 'OneCharge Charging Station',
      charger: 'Phev Charger 1',
      rate: '80.0/kWh',
      startCharge: '9/7/2023 5:10 PM',
      stopCharge: '9/7/2023 6:10 PM',
      time: '1 hr',
      kWh: '10 kWh',
      revenue: '฿899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378503-376',
      station: 'OneCharge Charging Station',
      charger: 'Phev Charger 1',
      rate: '80.0/kWh',
      startCharge: '9/7/2023 5:10 PM',
      stopCharge: '9/7/2023 6:10 PM',
      time: '1 hr',
      kWh: '10 kWh',
      revenue: '฿899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378503-375',
      station: 'OneCharge Charging Station',
      charger: 'Phev Charger 1',
      rate: '80.0/kWh',
      startCharge: '9/7/2023 5:10 PM',
      stopCharge: '9/7/2023 6:10 PM',
      time: '1 hr',
      kWh: '10 kWh',
      revenue: '฿899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378503-374',
      station: 'OneCharge Charging Station',
      charger: 'Phev Charger 1',
      rate: '80.0/kWh',
      startCharge: '9/7/2023 5:10 PM',
      stopCharge: '9/7/2023 6:10 PM',
      time: '1 hr',
      kWh: '10 kWh',
      revenue: '฿899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378503-373',
      station: 'OneCharge Charging Station',
      charger: 'Phev Charger 1',
      rate: '80.0/kWh',
      startCharge: '9/7/2023 5:10 PM',
      stopCharge: '9/7/2023 6:10 PM',
      time: '1 hr',
      kWh: '10 kWh',
      revenue: '฿899.0',
      status: 'Completed',
    },
    {
      orderNumber: 'CP00378503-372',
      station: 'OneCharge Charging Station',
      charger: 'Phev Charger 1',
      rate: '80.0/kWh',
      startCharge: '9/7/2023 5:10 PM',
      stopCharge: '9/7/2023 6:10 PM',
      time: '1 hr',
      kWh: '10 kWh',
      revenue: '฿899.0',
      status: 'Completed',
    },
  ]

  return (
    <div className="flex flex-col gap-3 p-2 md:p-6">
      {/* Hero Section with team info */}
      <div
        className="-mx-2 -mt-2 rounded-2xl px-3 py-8 text-white md:-mx-3 md:-mt-3 md:px-4 md:py-8"
        style={{
          backgroundImage: "url('/assets/images/bgHero1.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <TeamHeader teamId={teamId} pageTitle="" variant="hero" />
      </div>

      <div className="relative z-10 -mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between px-8 pb-2 pt-4">
            <CardTitle className="text-sm font-light text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4AD991]/20">
              <ChartLine className="h-4 w-4 text-[#4AD991]" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-4 pt-0">
            <div className="text-xl font-medium">฿{teamData.revenue.toLocaleString()}</div>
            <div className="mt-2 flex items-center text-xs">
              <div
                className={`flex items-center ${
                  teamData.revenueChange >= 0 ? 'text-[#00B69B]' : 'text-[#F93C65]'
                }`}
              >
                {teamData.revenueChange >= 0 ? (
                  <svg
                    width="30"
                    height="23"
                    viewBox="0 0 30 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.4667 5.7168L22.2413 7.85862L16.3286 12.4229L11.4821 8.68168L2.50391 15.6216L4.2123 16.9403L11.4821 11.3286L16.3286 15.0697L23.9618 9.18674L26.7365 11.3286V5.7168H19.4667Z"
                      fill="#00B69B"
                    />
                  </svg>
                ) : (
                  <svg
                    width="25"
                    height="12"
                    viewBox="0 0 25 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.4413 11.9462L20.2159 9.80436L14.3032 5.24013L9.45668 8.9813L0.478516 2.04142L2.18691 0.722656L9.45668 6.33442L14.3032 2.59324L21.9364 8.47624L24.7111 6.33442V11.9462H17.4413Z"
                      fill="#F93C65"
                    />
                  </svg>
                )}
                <span className="ml-1">{Math.abs(teamData.revenueChange)}% up</span>
              </div>
              <span className="ml-1 text-muted-foreground">from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between px-8 pb-2 pt-4">
            <CardTitle className="text-sm font-light text-muted-foreground">
              After Service fee
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEC53D]/20">
              <svg
                width="15"
                height="19"
                viewBox="0 0 15 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 2.06048C0 2.0148 0.0234606 1.85193 0.334339 1.58943C0.641121 1.33039 1.13741 1.05732 1.82795 0.8107C3.20135 0.3202 5.15674 0 7.35887 0C9.561 0 11.5164 0.3202 12.8898 0.8107C13.5803 1.05732 14.0766 1.33039 14.3834 1.58943C14.6943 1.85193 14.7177 2.0148 14.7177 2.06048C14.7177 2.10616 14.6943 2.26904 14.3834 2.53154C14.0766 2.79058 13.5803 3.06365 12.8898 3.31027C11.5164 3.80077 9.561 4.12097 7.35887 4.12097C5.15674 4.12097 3.20135 3.80077 1.82795 3.31027C1.13741 3.06365 0.641121 2.79058 0.334339 2.53154C0.0234606 2.26904 0 2.10616 0 2.06048Z"
                  fill="#FEC53D"
                />
                <path
                  d="M13.4838 9.68318C13.7919 9.57316 14.0866 9.45201 14.3627 9.31924C14.5244 9.24148 14.7177 9.35628 14.7177 9.53569V11.4798C14.7177 11.5255 14.6943 11.6884 14.3834 11.9509C14.0766 12.2099 13.5803 12.483 12.8898 12.7296C11.5164 13.2201 9.561 13.5403 7.35887 13.5403C5.15674 13.5403 3.20135 13.2201 1.82795 12.7296C1.13741 12.483 0.641121 12.2099 0.334339 11.9509C0.0234606 11.6884 0 11.5255 0 11.4798V9.53569C0 9.35628 0.193385 9.24148 0.355067 9.31924C0.631141 9.45201 0.925864 9.57316 1.23394 9.68318C2.84353 10.258 5.0091 10.5968 7.35887 10.5968C9.70864 10.5968 11.8742 10.258 13.4838 9.68318Z"
                  fill="#FEC53D"
                />
                <g opacity="0.3">
                  <path
                    d="M13.4838 4.97378C13.7919 4.86376 14.0866 4.74261 14.3627 4.60984C14.5244 4.53208 14.7177 4.64688 14.7177 4.82629V6.77044C14.7177 6.81612 14.6943 6.97899 14.3834 7.24149C14.0766 7.50053 13.5803 7.7736 12.8898 8.02022C11.5164 8.51072 9.561 8.83092 7.35887 8.83092C5.15674 8.83092 3.20135 8.51072 1.82795 8.02022C1.13741 7.7736 0.641121 7.50053 0.334339 7.24149C0.0234606 6.97899 0 6.81612 0 6.77044V4.82629C0 4.64688 0.193385 4.53208 0.355067 4.60984C0.631141 4.74261 0.925864 4.86376 1.23394 4.97378C2.84353 5.54864 5.0091 5.88738 7.35887 5.88738C9.70864 5.88738 11.8742 5.54864 13.4838 4.97378Z"
                    fill="#FEC53D"
                  />
                  <path
                    d="M13.4838 14.3931C13.7919 14.2831 14.0866 14.162 14.3627 14.0292C14.5244 13.9514 14.7177 14.0662 14.7177 14.2456V16.1898C14.7177 16.2355 14.6943 16.3983 14.3834 16.6608C14.0766 16.9199 13.5803 17.193 12.8898 17.4396C11.5164 17.9301 9.561 18.2503 7.35887 18.2503C5.15674 18.2503 3.20135 17.9301 1.82795 17.4396C1.13741 17.193 0.641121 16.9199 0.334339 16.6608C0.0234606 16.3983 0 16.2355 0 16.1898V14.2456C0 14.0662 0.193385 13.9514 0.355067 14.0292C0.631141 14.162 0.925864 14.2831 1.23394 14.3931C2.84353 14.968 5.0091 15.3067 7.35887 15.3067C9.70864 15.3067 11.8742 14.968 13.4838 14.3931Z"
                    fill="#FEC53D"
                  />
                </g>
              </svg>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-4 pt-0">
            <div className="text-xl font-medium">฿{teamData.serviceFee.toLocaleString()}</div>
            <div className="mt-2 flex items-center text-xs">
              <div
                className={`flex items-center ${
                  teamData.serviceFeeChange >= 0 ? 'text-[#00B69B]' : 'text-[#F93C65]'
                }`}
              >
                {teamData.serviceFeeChange >= 0 ? (
                  <svg
                    width="25"
                    height="12"
                    viewBox="0 0 25 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.955 0.716797L19.7296 2.85862L13.8169 7.42286L8.97035 3.68168L-0.0078125 10.6216L1.70058 11.9403L8.97035 6.32856L13.8169 10.0697L21.4501 4.18674L24.2247 6.32856V0.716797H16.955Z"
                      fill="#00B69B"
                    />
                  </svg>
                ) : (
                  <svg
                    width="25"
                    height="12"
                    viewBox="0 0 25 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.4413 11.9462L20.2159 9.80436L14.3032 5.24013L9.45668 8.9813L0.478516 2.04142L2.18691 0.722656L9.45668 6.33442L14.3032 2.59324L21.9364 8.47624L24.7111 6.33442V11.9462H17.4413Z"
                      fill="#F93C65"
                    />
                  </svg>
                )}
                <span className="ml-1">{Math.abs(teamData.serviceFeeChange)}% up</span>
              </div>
              <span className="ml-1 text-muted-foreground">from past week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between px-8 pb-2 pt-4">
            <CardTitle className="text-sm font-light text-muted-foreground">Total kWh</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEC53D]/20">
              <ChartBar className="h-4 w-4 text-[#FEC53D]" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-4 pt-0">
            <div className="text-xl font-medium">{teamData.kWh.toLocaleString()} kWh</div>
            <div className="mt-2 flex items-center text-xs">
              <div
                className={`flex items-center ${
                  teamData.kWhChange >= 0 ? 'text-[#00B69B]' : 'text-[#F93C65]'
                }`}
              >
                {teamData.kWhChange >= 0 ? (
                  <svg
                    width="25"
                    height="12"
                    viewBox="0 0 25 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.955 0.716797L19.7296 2.85862L13.8169 7.42286L8.97035 3.68168L-0.0078125 10.6216L1.70058 11.9403L8.97035 6.32856L13.8169 10.0697L21.4501 4.18674L24.2247 6.32856V0.716797H16.955Z"
                      fill="#00B69B"
                    />
                  </svg>
                ) : (
                  <svg
                    width="25"
                    height="12"
                    viewBox="0 0 25 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.4413 11.9462L20.2159 9.80436L14.3032 5.24013L9.45668 8.9813L0.478516 2.04142L2.18691 0.722656L9.45668 6.33442L14.3032 2.59324L21.9364 8.47624L24.7111 6.33442V11.9462H17.4413Z"
                      fill="#F93C65"
                    />
                  </svg>
                )}
                <span className="ml-1">{Math.abs(teamData.kWhChange)}% down</span>
              </div>
              <span className="ml-1 text-muted-foreground">from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between px-8 pb-2 pt-4">
            <CardTitle className="text-sm font-light text-muted-foreground">
              Total Charges
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF9066]/20">
              <ArrowUpDown className="h-4 w-4 text-[#FF9066]" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-4 pt-0">
            <div className="text-xl font-medium">{teamData.charges.toLocaleString()}</div>
            <div className="mt-2 flex items-center text-xs">
              <div
                className={`flex items-center ${
                  teamData.chargesChange >= 0 ? 'text-[#00B69B]' : 'text-[#F93C65]'
                }`}
              >
                {teamData.chargesChange >= 0 ? (
                  <svg
                    width="25"
                    height="12"
                    viewBox="0 0 25 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.955 0.716797L19.7296 2.85862L13.8169 7.42286L8.97035 3.68168L-0.0078125 10.6216L1.70058 11.9403L8.97035 6.32856L13.8169 10.0697L21.4501 4.18674L24.2247 6.32856V0.716797H16.955Z"
                      fill="#00B69B"
                    />
                  </svg>
                ) : (
                  <svg
                    width="25"
                    height="12"
                    viewBox="0 0 25 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.4413 11.9462L20.2159 9.80436L14.3032 5.24013L9.45668 8.9813L0.478516 2.04142L2.18691 0.722656L9.45668 6.33442L14.3032 2.59324L21.9364 8.47624L24.7111 6.33442V11.9462H17.4413Z"
                      fill="#F93C65"
                    />
                  </svg>
                )}
                <span className="ml-1">{Math.abs(teamData.chargesChange)}% up</span>
              </div>
              <span className="ml-1 text-muted-foreground">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Tab */}
      <div>
        <TeamTabs teamId={teamId} activeTab="overview" />
      </div>

      <Card className="shadow-xs border-0">
        <CardHeader className="flex flex-row items-center justify-between px-3 pb-1 pt-3">
          <CardTitle className="p-2 text-lg font-medium">Charge Sessions</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <span>{month}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-3 py-2">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <LineChart />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="shadow-xs flex flex-col gap-3 rounded-lg bg-card p-3">
        <div className="flex items-center justify-between border-b px-2 pb-2">
          <h2 className="text-lg font-medium text-[#364A63]">Charge sessions</h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative max-w-[230px] flex-1">
            <Input
              placeholder="Search by ID Announcement"
              className="h-9 border-slate-200 bg-[#ECF2F8] pr-10 placeholder:font-medium placeholder:text-[#A1B1D1]"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
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
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1 whitespace-nowrap bg-[#ECF2F8]">
            <span className="font-light text-[#A1B1D1]">Filter by Status</span>
            <ChevronDown className="h-4 w-4 text-[#A1B1D1]" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-4">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th
                  scope="col"
                  className="rounded-tl-md px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  ORDER NUMBER
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  CHARGING STATION
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  CHARGER
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  RATE
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  START CHARGE
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  STOP CHARGE
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  TIME
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  KWH
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  REVENUE
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  STATUS
                </th>
                <th
                  scope="col"
                  className="rounded-tr-md px-4 py-3 text-left text-sm font-light uppercase tracking-wider"
                >
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {chargeSessions.map((session, index) => (
                <tr key={index} className="shadow-xs rounded-lg bg-card hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-900">
                    {session.orderNumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-900">
                    {session.station}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-900">
                    {session.charger}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-900">
                    {session.rate}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-900">
                    {session.startCharge}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-900">
                    {session.stopCharge}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-900">
                    {session.time}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-900">
                    {session.kWh}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-900">
                    {session.revenue}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex rounded-lg bg-[#DFF8F3] px-2 py-1 text-xs font-light leading-5 text-[#0D8A72]">
                      {session.status}
                    </span>
                  </td>
                  <td className="flex items-center justify-center whitespace-nowrap rounded-r-md px-4 py-3 text-xs text-gray-500">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div>Showing 1 to 10 of 130 Results</div>
            <div className="flex items-center">
              <select
                className="h-8 rounded-md border border-input bg-white px-2 py-1 text-sm"
                defaultValue="10"
              >
                <option value="10">10 List</option>
                <option value="20">20 List</option>
                <option value="50">50 List</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
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
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-xl bg-primary/10 text-primary hover:text-secondary"
            >
              1
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              2
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              3
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              4
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              5
            </Button>
            <span className="px-2 py-1 text-muted-foreground">...</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              10
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
  )
}
