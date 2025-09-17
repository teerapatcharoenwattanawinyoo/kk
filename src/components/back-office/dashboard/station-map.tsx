'use client'
import { SimpleMap } from '@/components/back-office/dashboard/simple-map'

export function StationMap() {
  return (
    <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
      <div className="absolute left-2 top-2 z-10 rounded-full bg-white p-1 shadow-md">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16V12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8H12.01"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 z-10 rounded-md bg-white px-2 py-1 text-xs shadow-md">
        <div className="flex items-center">
          <span className="font-medium">AIWIN</span>
          <span className="ml-1 text-[10px] text-green-500">Online</span>
        </div>
        <div className="text-[10px] text-gray-500">Online 4 ชั่วโมง</div>
      </div>

      <SimpleMap />
    </div>
  )
}
