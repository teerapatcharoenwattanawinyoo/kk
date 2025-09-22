'use client'

import { StationMap } from '@/components/back-office/dashboard/station-map'
import { RevenueHeaderIcon } from '@/components/icons'
import { LineChart } from '@/components/line-chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, ChevronRight, Clock, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Badge } from '../../ui/badge'
import { Separator } from '../../ui/separator'

export function DashboardContent() {
  const [dateRange] = useState('7 days')

  return (
    <div className="flex flex-col gap-4 p-3 md:gap-6 md:p-4 lg:p-6">
      <header className="mb-2 flex flex-col gap-3 rounded-lg border bg-card p-4 md:mb-4 md:flex-row md:items-center md:gap-6 md:p-6">
        <h1 className="text-xl font-semibold text-primary md:text-2xl lg:text-3xl">Overview</h1>
        <div className="hidden h-6 w-px bg-border md:block"></div>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground md:gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {new Date().toLocaleDateString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {/* Total Energy Consumption Card */}
        <Card className="shadow-xs transition-shadow hover:shadow-md">
          <CardContent className="p-4 text-center sm:p-6">
            <div className="text-2xl font-bold sm:text-3xl">3,958</div>
            <div className="text-oc-construction mt-2 text-xs sm:text-sm">
              Total Energy Consumption
            </div>
            <span className="text-xs text-muted-foreground">kWh</span>
          </CardContent>
        </Card>
        {/* Connector Card*/}
        <Card className="shadow-xs transition-shadow hover:shadow-md">
          <CardContent className="p-4 text-center sm:p-6">
            <div className="text-2xl font-bold sm:text-3xl">8</div>
            <div className="mt-2 text-xs text-primary sm:text-sm">Connector</div>
            <span className="text-xs text-muted-foreground">connect</span>
          </CardContent>
        </Card>
        {/* Number Of Charging Card*/}
        <Card className="shadow-xs transition-shadow hover:shadow-md">
          <CardContent className="p-4 text-center sm:p-6">
            <div className="text-2xl font-bold sm:text-3xl">202</div>
            <div className="mt-2 text-xs text-[#4AF3DB] sm:text-sm">Number Of Charging</div>
            <span className="text-xs text-muted-foreground">Transaction</span>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardContent className="p-4 text-center sm:p-6">
            <div className="text-2xl font-bold sm:text-3xl">฿39,580.30</div>
            <div className="text-success-dark mt-2 text-xs sm:text-sm">Revenue</div>
            <span className="text-xs text-muted-foreground">Charging Fee</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
        <Card className="col-span-1 rounded-xl shadow-none transition-shadow xl:col-span-2">
          <CardHeader className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Title + Subtitle */}
              <div>
                <CardTitle className="text-oc-title text-base font-medium sm:text-lg">
                  Total Charge Session
                </CardTitle>
                <p className="text-xs text-muted-foreground sm:text-sm">All Station</p>
              </div>

              {/* Tabs + Date Selector */}
              <div className="flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-end sm:justify-between">
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All Station</TabsTrigger>
                    <TabsTrigger value="ac">AC Charge</TabsTrigger>
                    <TabsTrigger value="dc">DC Charge</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Button variant="outline" size="sm" className="h-7 gap-1 text-xs sm:h-8 sm:text-sm">
                  <span>{dateRange}</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex h-auto min-h-[200px] flex-col sm:min-h-[240px] xl:h-[240px] xl:flex-row">
              {/* ── Left: Number Summary ── */}
              <div className="relative flex w-full flex-col items-center justify-center px-4 py-6 after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px after:bg-border after:content-[''] sm:py-8 xl:w-36 xl:py-0 xl:after:bottom-auto xl:after:left-auto xl:after:right-0 xl:after:top-0 xl:after:h-full xl:after:w-px">
                <div className="text-3xl font-bold leading-none text-primary sm:text-4xl xl:text-3xl">
                  202
                </div>
                <p className="mt-2 whitespace-nowrap text-center text-xs text-muted-foreground sm:text-sm">
                  Charge Session
                </p>
                {/* Legend */}
                <div className="mt-4 flex flex-col gap-3 px-4 pb-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-center sm:gap-6 xl:mt-4 xl:flex-col xl:gap-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-4 rounded-full bg-primary sm:w-6" />
                    <span className="text-xs text-muted-foreground sm:text-sm">Total Charge</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-4 rounded-full border border-dashed border-primary sm:w-6" />
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      AVG for the period
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Right: Line Chart ── */}
              <div className="flex h-[200px] flex-1 px-4 py-3 sm:h-[240px] sm:px-6">
                <LineChart />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs col-span-1 flex flex-col rounded-md border transition-shadow hover:shadow-md">
          <CardContent className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
            <div className="flex h-full min-h-[200px] w-full items-center justify-center sm:min-h-[240px]">
              <StationMap />
            </div>
          </CardContent>

          <CardFooter className="flex w-full justify-end border-t p-4 sm:p-6">
            <Link href={'/#'} className="text-primary hover:underline">
              <div className="flex items-center gap-1">
                <p className="text-xs text-primary sm:text-sm">View Station map</p>
                <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                  <ChevronRight className="text-oc-neutral size-4 rounded-full" />
                </div>
              </div>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 xl:flex-row">
        {/* Revenue Card - Left Side */}
        <Card className="shadow-xs flex w-full flex-col transition-shadow hover:shadow-md xl:h-fit xl:min-h-[340px] xl:w-[340px] xl:shrink-0">
          <CardHeader className="h-fit min-h-0 border-b p-4">
            <div className="flex">
              {/* Left side - Icon */}
              <div className="bg-primary-soft mr-3 mt-1 flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10">
                <RevenueHeaderIcon className="h-6 w-6 text-primary" />
              </div>
              {/* Right side - Text */}
              <div className="flex flex-col justify-center">
                <CardTitle className="text-title text-base font-medium sm:text-xl">
                  Revenue
                </CardTitle>
                <p className="mt-1 text-xs font-light text-muted-foreground sm:text-sm">
                  All Station in LEADWAY
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex h-fit min-h-0 grow flex-col justify-center p-4 text-left">
            <div className="text-2xl font-bold sm:text-3xl xl:text-2xl">฿39,580.30</div>
            <div className="mt-1 flex flex-col gap-1 sm:mt-2 xl:flex-col xl:gap-1">
              <span className="text-xs text-muted-foreground sm:text-sm">
                ยอดรายได้เพิ่มขึ้นจากเดือนก่อนแล้ว
              </span>
              <div className="flex items-center gap-1">
                <svg
                  width="23"
                  height="14"
                  viewBox="0 0 23 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.9166 1.29199L14.2294 8.93227C13.1902 9.96517 12.6706 10.4816 12.0261 10.4816C11.3816 10.4815 10.862 9.96491 9.82305 8.93176L9.57373 8.68385C8.53381 7.64979 8.01385 7.13277 7.3689 7.133C6.72394 7.13324 6.20436 7.65064 5.1652 8.68546L1.08325 12.7503M21.9166 1.29199V7.0689M21.9166 1.29199H16.1019"
                    stroke="oklch(74.6% 0.231 143.49)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-success bg-success-soft rounded px-2 py-1 text-xs font-medium">
                  +15%
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-auto flex h-fit min-h-0 w-full justify-end border-t p-4">
            <Link href={'/#'} className="text-primary hover:underline">
              <div className="flex items-center gap-1">
                <p className="text-xs text-primary sm:text-sm">View Station Statistic</p>
                <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                  {' '}
                  <ChevronRight className="text-oc-neutral size-4 rounded" />
                </div>
              </div>
            </Link>
          </CardFooter>
        </Card>

        {/* Station List Card - Right Side */}
        <Card className="flex flex-1 flex-col">
          <CardHeader className="flex flex-row items-center justify-between p-6 sm:p-6">
            <CardTitle className="text-oc-title-secondary text-xl sm:text-lg">
              Station List
            </CardTitle>
          </CardHeader>
          <div className="px-4 sm:px-6">
            <Separator className="my-0" />
          </div>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-0">
              {[
                {
                  name: 'AIWIN',
                  connectors: 3,
                  type: 'Home',
                  charge: 'AC, DC',
                  location: 'ถนน 109/230 สาทรเหนือ วัฒนา กรุงเทพมหานคร 10110',
                },
                {
                  name: 'Tesla Max',
                  connectors: 3,
                  type: 'Work',
                  charge: 'AC, DC',
                  location: 'ถนน 109/230 สาทรเหนือ วัฒนา กรุงเทพมหานคร 10110',
                },
                {
                  name: 'DTC Pack co.,ltd',
                  connectors: 3,
                  type: 'Business',
                  charge: 'AC',
                  location: 'ถนน 109/230 สาทรเหนือ วัฒนา กรุงเทพมหานคร 10110',
                },
              ].map((station, index, array) => (
                <div key={index}>
                  <div className="flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:gap-6 sm:p-4">
                    <div className="relative h-[100px] w-full overflow-hidden rounded-lg sm:h-[122px] sm:w-[180px] sm:shrink-0">
                      <Image
                        src="https://s3-ap-southeast-1.amazonaws.com/motoristprod/editors%2Fimages%2F1707721005786-ev-charging-teaser.jpg"
                        alt={station.name}
                        width={180}
                        height={122}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                      <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg bg-primary p-0 text-xs text-white sm:h-8 sm:w-8 sm:text-sm">
                        {station.connectors}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-oc-neutral text-base font-semibold sm:text-lg">
                            {station.name}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground sm:gap-x-4 sm:text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-text-mist">Connector:</span>
                              <span className="px-2 py-1 text-xs font-medium text-primary">
                                {station.connectors} Connector
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-text-mist">Type:</span>
                              <span className="font-medium text-primary">{station.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-text-mist">Charge:</span>
                              <span className="font-medium text-primary">{station.charge}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          <Badge variant="outline" className="bg-green-500 hover:bg-green-600">
                            <span className="font-light text-white">online</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="px-0">
                        <Separator className="my-3 sm:my-4" />
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground sm:flex-1 sm:text-sm">
                          {station.location}
                        </p>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 gap-1 px-3 text-xs transition-colors hover:bg-primary/90 sm:h-8 sm:px-4 sm:text-sm"
                        >
                          <svg
                            id="Show"
                            width="14px"
                            height="14px"
                            viewBox="0 0 24 24"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            className="sm:h-4 sm:w-4"
                          >
                            <g
                              id="Show"
                              stroke="none"
                              strokeWidth="1"
                              fill="none"
                              fillRule="evenodd"
                            >
                              <rect id="Rectangle" x="0" y="0" width="24" height="24"></rect>
                              <path
                                d="M12,15 C13.657,15 15,13.657 15,12 C15,10.343 13.657,9 12,9 C10.343,9 9,10.343 9,12 C9,13.657 10.343,15 12,15 Z"
                                id="Path"
                                fill="currentColor"
                              ></path>
                              <path
                                d="M2.04844,11.953 C2.02744,11.969 2.01344,11.984 2.00044,12 C2.00044,12 5.00044,18 12.0004,18 C19.0004,18 22.0004,12 22.0004,12 C22.0004,12 22.0004,12 22.0004,12 L21.9554,11.947 C21.5584,11.414 20.8474,10.455 19.9054,9.456 C18.0284,7.468 15.5754,6 12.0004,6 C8.42544,6 5.97244,7.468 4.09544,9.456 C3.15244,10.455 2.44244,11.414 2.04544,11.947 L2.04844,11.953 Z M12.0004,16 C8.54344,16 6.74644,12.899 5.96044,12 C6.74644,11.1 8.54344,8 12.0004,8 C15.4574,8 17.2544,11.1 18.0404,12 C17.2544,12.899 15.4574,16 12.0004,16 Z"
                                id="Shape"
                                fill="currentColor"
                                fillRule="nonzero"
                              ></path>
                            </g>
                          </svg>
                          <span className="font-light">View</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < array.length - 1 && (
                    <div className="px-3 sm:px-4">
                      <Separator className="my-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-0 sm:px-0">
              <Separator className="my-4" />
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="link" size="sm" className="gap-1 text-blue-500 hover:text-blue-600">
                <span className="text-xs sm:text-sm">View Station</span>
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
