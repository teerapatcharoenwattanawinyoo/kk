'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDown } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

interface ChargerItem {
  id: number
  name: string
}

interface ChargerType {
  id: number
  name: string
}

interface PriceGroup {
  id: number
  name: string
}

interface ConnectorFormData {
  connector_name: string
  charger_id: string
  charger_type_id: string
  connector_type: string
  power: string
  connection_id: string
  ocpp_id_tag?: string
}

interface ConnectorFormProps {
  form: UseFormReturn<ConnectorFormData>
  chargersListData?: {
    data?: {
      data?: ChargerItem[]
    }
  }
  isChargersListLoading: boolean
  chargerTypesData?: {
    data?: ChargerType[]
  }
  isChargerTypesLoading: boolean
  selectedPriceGroup: PriceGroup | null
  onSetPriceClick: () => void
  onSubmit: (data: ConnectorFormData) => void
  mode?: 'add' | 'edit'
}

export function ConnectorForm({
  form,
  chargersListData,
  isChargersListLoading,
  chargerTypesData,
  isChargerTypesLoading,
  selectedPriceGroup,
  onSetPriceClick,
  onSubmit,
  mode = 'add',
}: ConnectorFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full max-w-xl space-y-4 sm:space-y-5">
          <FormField
            control={form.control}
            name="connector_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Connector Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Connector Name "
                    className="h-10 border-none bg-[#f2f2f2] text-sm placeholder:text-[#CACACA]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="charger_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Charger <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={`h-10 w-full border-none bg-[#f2f2f2] text-sm sm:h-11 ${
                        field.value ? 'text-zinc-900' : 'text-[#CACACA]'
                      }`}
                    >
                      <SelectValue placeholder="Specify" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isChargersListLoading ? (
                      <div className="px-4 py-2 text-xs text-gray-400">
                        Loading...
                      </div>
                    ) : chargersListData?.data?.data?.length ? (
                      chargersListData.data.data.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs text-gray-400">
                        No data
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="charger_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Charger Type <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      className={`h-10 w-full border-none bg-[#f2f2f2] text-sm sm:h-11 ${
                        field.value ? 'text-zinc-900' : 'text-[#CACACA]'
                      }`}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isChargerTypesLoading ? (
                      <div className="px-4 py-2 text-xs text-gray-400">
                        Loading...
                      </div>
                    ) : chargerTypesData?.data?.length ? (
                      chargerTypesData.data.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs text-gray-400">
                        No data
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            <FormField
              control={form.control}
              name="connector_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Connector Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger
                        className={`h-10 w-full border-none bg-[#f2f2f2] text-sm sm:h-11 ${
                          field.value ? 'text-zinc-900' : 'text-[#CACACA]'
                        }`}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="DC">DC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="power"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Power <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      step="any"
                      placeholder="Specify"
                      className="h-10 w-full border-none bg-[#f2f2f2] text-sm placeholder:text-[#CACACA]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Pricing Label */}
            <div className="flex flex-col">
              <FormLabel className="mb-2 block text-sm font-medium">
                Pricing
              </FormLabel>
              <Button
                type="button"
                variant="outline"
                className="w-[515px] justify-between border-none bg-[#f2f2f2] px-4 text-sm hover:bg-[#f2f2f2]"
                onClick={onSetPriceClick}
              >
                {selectedPriceGroup ? (
                  <div className="flex flex-col items-start">
                    <p className="text-left font-normal text-[#364A63]">
                      {selectedPriceGroup.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-left font-normal text-[#CACACA]">Apply</p>
                )}
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <FormField
            control={form.control}
            name="connection_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Charger Connector ID{' '}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Specify"
                    className="h-10 border-none bg-[#f2f2f2] text-sm placeholder:text-[#CACACA]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="ocpp_id_tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  OCPP ID TAG {mode === "edit" ? "(optional)" : " (optional)"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Specify"
                    className="h-10 w-full border-none bg-[#f2f2f2] text-sm placeholder:text-[#CACACA]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
      </form>
    </Form>
  )
}
