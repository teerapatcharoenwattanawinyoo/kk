'use client'
import { ConnectorForm } from '@/components/back-office/team/form'
import { SetPriceDialogFormAdd } from '@/components/back-office/team/set-price'
import { SuccessDialog } from '@/components/notifications'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useChargersList, useChargerTypes } from '@/hooks/use-chargers'
import { useCreateConnector } from '@/hooks/use-connectors'
import { useCreatePriceSetByParent } from '@/hooks/use-price-group'
import { PriceGroup } from '@/lib/api/team-group/price-groups'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  charger_id: z.string().min(1, 'Charger is required'),
  charger_type_id: z.string().min(1, 'Charger type is required'),
  connector_name: z.string().min(1, 'Connector name is required'),
  connection_id: z.string().min(1, 'Connection ID is required'),
  connector_type: z.string().min(1, 'Connector type is required'),
  power: z.string().min(1, 'Power is required'),
  ocpp_id_tag: z.string().optional(),
})

export default function AddConnectorDialog({
  open,
  onOpenChange,
  teamId,
  isLoading = false,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isControlled?: boolean
  teamId: string
  isLoading?: boolean
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [setPriceOpen, setSetPriceOpen] = useState(false)
  const [selectedPriceGroup, setSelectedPriceGroup] = useState<PriceGroup | null>(null)

  const { data: chargersListData, isLoading: isChargersListLoading } = useChargersList(teamId)
  const { data: chargerTypesData, isLoading: isChargerTypesLoading } = useChargerTypes()
  const createConnectorMutation = useCreateConnector()
  const createPriceSetMutation = useCreatePriceSetByParent()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      charger_id: '',
      charger_type_id: '',
      connector_name: '',
      connection_id: '',
      connector_type: '',
      power: '',
      ocpp_id_tag: '',
    },
  })

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    onOpenChange?.(open)
  }

  const handleCancel = () => {
    setDialogOpen(false)
    onOpenChange?.(false)
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', data)

    try {
      const requestData = {
        charger_id: parseInt(data.charger_id),
        charger_type_id: parseInt(data.charger_type_id),
        connector_name: data.connector_name,
        connection_id: parseInt(data.connection_id),
        connector_type: data.connector_type,
        power: data.power,
      }

      console.log('Creating connector with data:', requestData)

      const result = await createConnectorMutation.mutateAsync(requestData)

      console.log('Connector created successfully:', result)

      if (selectedPriceGroup && result?.data?.data?.id) {
        const priceSetData = {
          parent_id: selectedPriceGroup.id,
          plug_id: [result.data.data.id],
        }

        console.log('Applying price set with data:', priceSetData)

        await createPriceSetMutation.mutateAsync(priceSetData)
        console.log('Price set applied successfully')
      }

      setSuccessOpen(true)

      // Close the AddConnectorDialog immediately
      setDialogOpen(false)
      onOpenChange?.(false)

      // Reset form after successful creation
      form.reset()
      setSelectedPriceGroup(null)

      // Delayed refetch to avoid race conditions - best practice
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['connectors-list'],
        })
        queryClient.invalidateQueries({
          queryKey: ['chargers-list'],
        })
        console.log('Data invalidated for background refetch')
      }, 100)
    } catch (error) {
      console.error('Failed to create connector or apply price set:', error)
    }
  }

  const handleConfirm = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      const formData = form.getValues()
      onSubmit(formData)
    }
  }

  const handlePriceGroupSelect = (priceGroup: PriceGroup) => {
    console.log('Selected price group:', priceGroup)
    setSelectedPriceGroup(priceGroup)
    setSetPriceOpen(false)
  }

  return (
    <>
      <Dialog open={open ?? dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-h-xl flex w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-card p-0">
          <DialogTitle className="sr-only">Add Connector</DialogTitle>
          <DialogDescription className="sr-only">Add connector information</DialogDescription>
          {/* Header */}
          <div className="relative flex h-[70px] shrink-0 items-center border-b px-4 sm:px-6 md:px-10 lg:px-[51px]">
            <h2 className="text-lg font-semibold text-primary md:text-xl">Add Connector</h2>
          </div>
          {/* Step Navigation */}
          <div className="block w-full border-b md:hidden">
            <div className="flex justify-center gap-2 py-2 sm:gap-4 sm:py-3">
              <div className="flex flex-col items-center">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25C870]">
                  <span className="text-xs text-white">1</span>
                </div>
                <span className="mt-1 text-[11px] text-[#25C870]">Basic Info</span>
              </div>
            </div>
          </div>
          <div className="-my-4 flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Left Column (Desktop step navigation, UI only) */}
            <div className="hidden md:ml-16 md:flex md:w-[140px] md:shrink-0 md:flex-col md:border-l md:border-r lg:w-[140px]">
              <div className="-mx-4 grow items-start py-2 lg:py-6">
                <div>
                  <div className="ml-6 flex items-center">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#25C870] text-white">
                      <span className="text-xs text-white">1</span>
                    </div>
                    <span className="ml-2 text-xs text-[#25C870]">Basic Info</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column (Form container) */}
            <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto py-4 sm:px-6 sm:py-6">
              <ConnectorForm
                form={form}
                chargersListData={chargersListData}
                isChargersListLoading={isChargersListLoading}
                chargerTypesData={chargerTypesData}
                isChargerTypesLoading={isChargerTypesLoading}
                selectedPriceGroup={selectedPriceGroup}
                onSetPriceClick={() => setSetPriceOpen(true)}
                onSubmit={onSubmit}
                mode="add"
              />
            </div>
          </div>
          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-2 border-t bg-card p-4 sm:gap-3 sm:p-4 md:p-6">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="h-10 w-full bg-[#F4F7FE] font-normal text-destructive hover:bg-destructive hover:text-white sm:h-11 sm:w-[120px]"
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || createConnectorMutation.isPending}
              className={`h-10 w-full font-normal sm:h-11 sm:w-[175px] ${
                !isLoading && !createConnectorMutation.isPending
                  ? 'bg-[#355ff5] hover:bg-[#2a4dd4]'
                  : 'cursor-not-allowed bg-muted-foreground'
              }`}
              type="submit"
            >
              {isLoading || createConnectorMutation.isPending ? 'Creating...' : 'Submit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <SuccessDialog
        open={successOpen}
        onOpenChange={(open) => {
          setSuccessOpen(open)
        }}
        title="Success"
        message="Connector has created completed"
        buttonText="Done"
      />
      <SetPriceDialogFormAdd
        open={setPriceOpen}
        onOpenChange={setSetPriceOpen}
        onConfirm={handlePriceGroupSelect}
      />
    </>
  )
}
