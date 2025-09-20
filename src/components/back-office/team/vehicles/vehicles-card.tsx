import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MoreHorizontal } from 'lucide-react'

interface Vehicle {
  id: string
  image: string
  name: string
  macaddress: string
  brand: string
  model: string
  vehicleplate: string
  status: 'connected' | 'disconnected'
}

interface VehiclesCardProps {
  vehicles: Vehicle[]
}

export default function VehiclesCard({ vehicles }: VehiclesCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle.id}
          className="shadow-xs border transition-shadow hover:shadow-md"
        >
          <CardContent className="p-4">
            {/* Header with name and menu */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-[79px] w-[79px] border border-[#E0E5FA]">
                    <AvatarImage
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="h-auto w-auto object-cover"
                    />
                    <AvatarFallback className="bg-card text-blue-600">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-600"
                      >
                        <path
                          d="M3 17h2l.4-1.5c.3-1.1 1.4-1.9 2.6-1.9h8c1.2 0 2.3.8 2.6 1.9L19 17h2v-2h-1l-1.2-4.5c-.4-1.5-1.7-2.5-3.3-2.5H8.5c-1.6 0-2.9 1-3.3 2.5L4 15H3v2z"
                          fill="currentColor"
                        />
                        <circle cx="7" cy="17" r="2" fill="currentColor" />
                        <circle cx="17" cy="17" r="2" fill="currentColor" />
                      </svg>
                    </AvatarFallback>
                  </Avatar>
                  {/* Status dot indicator */}
                  <div
                    className={`absolute right-0.5 top-3.5 h-[9px] w-[9px] rounded-full ${
                      vehicle.status === 'connected'
                        ? 'bg-[#0DBE34]'
                        : 'bg-destructive'
                    }`}
                  ></div>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-[#364A63]">
                    {vehicle.name}
                  </h3>

                  <p className="text-xs text-[#6E82A5]">
                    My Mac Address: {vehicle.macaddress}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <Separator className="my-4" />
            {/* Vehicle Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#2C2C2C]">Brand/Model:</span>

                <span className="font-medium text-[#2C2C2C]">
                  {vehicle.brand} / {vehicle.model}
                </span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-sm">
                <span className="text-[#2C2C2C]">Vehicles Plate:</span>
                <span className="text-xs font-normal text-[#2C2C2C]">
                  {vehicle.vehicleplate}
                </span>
              </div>
            </div>
            <Separator className="my-4" />
            {/* Action Button */}
            <div className="mb-2 mt-3 pt-3">
              <div className="flex items-center justify-end">
                <Button
                  variant={'default'}
                  size="sm"
                  className="h-7 gap-1 text-xs"
                >
                  <svg
                    id="Show"
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <title>Iconly/Light-Outline/Show</title>
                    <g
                      id="Iconly/Light-Outline/Show"
                      stroke="none"
                      strokeWidth="1.5"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <g
                        id="Show"
                        transform="translate(2.000000, 4.000000)"
                        fill="currentColor"
                      >
                        <path
                          d="M10.0029,0.0005 C14.1389,0.0035 17.8529,2.9025 19.9389,7.7565 C20.0209,7.9455 20.0209,8.1595 19.9389,8.3485 C17.8539,13.2035 14.1389,16.1025 10.0029,16.1055 L9.9969,16.1055 C5.8609,16.1025 2.1469,13.2035 0.0609,8.3485 C-0.0201,8.1595 -0.0201,7.9455 0.0609,7.7565 C2.1469,2.9025 5.8619,0.0035 9.9969,0.0005 L10.0029,0.0005 Z M9.9999,1.5005 C6.5639,1.5015 3.4299,3.9445 1.5699,8.0525 C3.4299,12.1615 6.5629,14.6045 9.9999,14.6055 C13.4369,14.6045 16.5699,12.1615 18.4299,8.0525 C16.5699,3.9445 13.4369,1.5015 9.9999,1.5005 Z M9.9996,4.1413 C12.1566,4.1413 13.9116,5.8963 13.9116,8.0533 C13.9116,10.2093 12.1566,11.9633 9.9996,11.9633 C7.8426,11.9633 6.0886,10.2093 6.0886,8.0533 C6.0886,5.8963 7.8426,4.1413 9.9996,4.1413 Z M9.9996,5.6413 C8.6696,5.6413 7.5886,6.7233 7.5886,8.0533 C7.5886,9.3823 8.6696,10.4633 9.9996,10.4633 C11.3296,10.4633 12.4116,9.3823 12.4116,8.0533 C12.4116,6.7233 11.3296,5.6413 9.9996,5.6413 Z"
                          id="Combined-Shape"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  <span>View</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
