'use client'

import { Button } from '@/components/ui/button'
import { ChargeSession } from '@/types'

interface ChargeSessionsTableProps {
  sessions: ChargeSession[]
}

export function ChargeSessionsTable({ sessions }: ChargeSessionsTableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-4">
        <thead className="rounded-lg bg-primary">
          <tr>
            <th className="rounded-tl-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              ORDER NUMBER
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              CHARGING STATION
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              CHARGER
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              RATE
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              START CHARGE
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              STOP CHARGE
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              TIME
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              KWH
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              REVENUE
            </th>
            <th className="px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              STATUS
            </th>
            <th className="rounded-tr-lg px-2 py-2 text-center text-xs font-medium uppercase tracking-wider text-white md:px-4 md:py-3">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={index} className="shadow-xs rounded-lg bg-background">
              <td className="whitespace-nowrap rounded-l-lg px-2 py-2 text-center md:px-4 md:py-3">
                <div>
                  <div className="text-oc-sidebar text-xs font-medium">{session.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">{session.location}</div>
                </div>
              </td>
              <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                {session.station}
              </td>
              <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                {session.charger}
              </td>
              <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                {session.rate}
              </td>
              <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                {session.startCharge}
              </td>
              <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                {session.stopCharge}
              </td>
              <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                {session.time}
              </td>
              <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                {session.kWh}
              </td>
              <td className="text-oc-sidebar whitespace-nowrap px-2 py-2 text-center text-xs md:px-4 md:py-3">
                {session.revenue}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-center md:px-4 md:py-3">
                <span className="inline-flex rounded-md bg-[#DFF8F3] px-2 py-1 text-xs font-semibold leading-5 text-[#0D8A72]">
                  {session.status}
                </span>
              </td>
              <td className="whitespace-nowrap rounded-r-lg px-1 py-1 text-center text-xs text-[#818894] md:px-4 md:py-3">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.38318 0C9.80871 0 10.2166 0.169903 10.5145 0.47017L12.5299 2.48552C12.8299 2.78558 12.9985 3.19254 12.9985 3.61688C12.9985 4.04122 12.83 4.44819 12.5299 4.74824L5.17178 12.104C4.71782 12.6277 4.07431 12.9494 3.3371 13H0V12.3501L0.00211073 9.61063C0.0574781 8.9253 0.37609 8.28805 0.862122 7.85981L8.25104 0.470954C8.55066 0.169519 8.95813 0 9.38318 0ZM3.29214 11.6988C3.63934 11.6742 3.96254 11.5126 4.22206 11.2158L9.13528 6.30255L6.69522 3.8624L1.7532 8.80323C1.48988 9.03612 1.32698 9.36194 1.30078 9.65999V11.6976L3.29214 11.6988ZM7.61446 2.94338L10.0544 5.38342L11.6117 3.82613C11.668 3.76985 11.6996 3.69351 11.6996 3.61391C11.6996 3.53431 11.668 3.45797 11.6117 3.40168L9.59455 1.38452C9.53889 1.32843 9.46314 1.29688 9.38412 1.29688C9.3051 1.29688 9.22935 1.32843 9.17369 1.38452L7.61446 2.94338Z"
                      fill="#818894"
                    />
                  </svg>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
