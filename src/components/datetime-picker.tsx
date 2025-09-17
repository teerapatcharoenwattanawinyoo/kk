'use client'

import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from 'lucide-react'

interface DateTimePickerProps {
  selectedDate?: Date
  selectedTime: string
  onDateChange: (date: Date | undefined) => void
  onTimeChange: (time: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isEnabled?: boolean
  triggerClassName?: string
}

interface TimeOption {
  display: string
  value: string
}

const generateTimeOptions = (): TimeOption[] => {
  const times: TimeOption[] = []
  // Generate times from 6:00 AM to 11:30 PM in 15-minute intervals
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const period = hour < 12 ? 'AM' : 'PM'
      const timeStr = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      times.push({
        display: timeStr,
        value: time24,
      })
    }
  }
  return times
}

export function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  isOpen,
  onOpenChange,
  isEnabled = true,
  triggerClassName = '',
}: DateTimePickerProps) {
  const timeOptions = generateTimeOptions()

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`mt-1 h-auto p-0 text-xs underline hover:bg-transparent ${
            isEnabled ? 'text-primary hover:text-primary' : 'text-[#949494] hover:text-[#949494]'
          } ${triggerClassName}`}
        >
          ตั้งค่าวันที่เวลา
          <Calendar className="ml-1 h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0" align="start">
        <div className="flex">
          {/* Calendar Section */}
          <div className="flex-1 p-4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
              className="rounded-md border-0"
            />
          </div>

          {/* Time Selection Section */}
          <div className="w-36 border-l bg-card p-4">
            <div className="max-h-80 space-y-1 overflow-y-auto pr-2">
              {timeOptions.map(({ display, value }) => (
                <Button
                  key={value}
                  variant={selectedTime === value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onTimeChange(value)}
                  className={`w-full justify-center text-sm font-normal ${
                    selectedTime === value
                      ? 'rounded-lg bg-primary text-white hover:bg-primary'
                      : 'rounded-lg border shadow-md hover:bg-zinc-100'
                  }`}
                >
                  {display}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
