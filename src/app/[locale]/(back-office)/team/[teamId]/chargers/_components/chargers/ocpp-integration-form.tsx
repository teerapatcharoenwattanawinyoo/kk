'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { UseFormReturn } from 'react-hook-form'

interface OcppIntegrationFormProps {
  form: UseFormReturn<any>
  chargerName: string
  mode?: 'add' | 'edit'
  onSerialNumberChange: (value: string) => void
}

export function OcppIntegrationForm({
  form,
  chargerName,
  mode = 'add',
  onSerialNumberChange,
}: OcppIntegrationFormProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <div className="flex h-10 w-10 items-center justify-center">
            <Image
              src="/assets/images/icons/thunder.svg"
              alt="thunder"
              width={40}
              height={40}
            />
          </div>
        </div>
        <h3 className="text-center text-xl font-semibold">
          {chargerName || 'Charger Name'}
        </h3>
        <p className="text-sm text-gray-500">Charger Name</p>
      </div>

      <div className="mt-6 w-full max-w-md">
        <h4 className="mb-4 text-sm font-medium text-primary">
          Your Serial Numbers
        </h4>

        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="mb-2 block text-sm font-medium">
                Serial Number
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: '123456789123456789'"
                  className="h-12 border border-gray-300 bg-white text-sm placeholder:text-gray-400"
                  onChange={(e) => {
                    field.onChange(e)
                    onSerialNumberChange(e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-8">
          <h5 className="mb-2 text-sm font-medium">Charger identifier</h5>
          <p className="text-sm text-gray-600">
            To establish a connection between your charger and OneCharge, we
            need the identification number of your charger. The identification
            number is usually the charger&apos;s serial number
          </p>
        </div>
      </div>
    </div>
  )
}
