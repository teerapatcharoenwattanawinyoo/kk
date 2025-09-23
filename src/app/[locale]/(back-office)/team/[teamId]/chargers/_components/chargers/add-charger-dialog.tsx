'use client'

import {
  ChargerAddedDialog,
  OcppUrlDialog,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers'
import { BasicInfoForm } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers/basic-info-form'
import { OcppIntegrationForm } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers/ocpp-integration-form'
import { useAddChargerDialogController } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_hooks/use-add-charger-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { RefObject } from 'react'

interface AddChargerDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  teamGroupId?: string
}

const getStepCircleClass = (status: string) => {
  if (status === 'current') return 'bg-[#25c870] text-white'
  return 'bg-[#f2f2f2] text-muted-foreground'
}

const getStepTextClass = (status: string) => {
  if (status === 'current') return 'text-[#25c870] font-medium'
  return 'text-muted-foreground'
}

export function AddChargerDialog(props: AddChargerDialogProps) {
  const {
    form,
    dialog,
    status,
    stepper,
    basicInfo,
    ocppIntegration,
    confirmDialog,
    ocppDialog,
  } = useAddChargerDialogController(props)

  const nextButtonLabel = stepper.currentStep === stepper.totalSteps ? 'Confirm' : 'Next'

  return (
    <>
      <Dialog open={dialog.open} onOpenChange={dialog.handleOpenChange}>
        {!dialog.isControlled && (
          <DialogTrigger asChild>
            <Button>Add Charger</Button>
          </DialogTrigger>
        )}
        <DialogContent className="flex w-full max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg bg-card p-0 sm:max-w-[763px]">
          <DialogTitle className="sr-only">Add Charger</DialogTitle>
          <DialogDescription className="sr-only">
            Configure and add a new charger to your charging station network
          </DialogDescription>

          <div className="relative flex h-[70px] shrink-0 items-center border-b px-4 sm:px-6 md:px-10 lg:px-[51px]">
            <h2 className="text-lg font-semibold text-primary md:text-xl">Add Charger</h2>
          </div>

          <div className="block w-full border-b md:hidden">
            <div className="flex justify-center gap-2 py-2 sm:gap-4 sm:py-3">
              {stepper.steps.map((step) => {
                const statusValue = stepper.getStatus(step.id)
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${getStepCircleClass(
                        statusValue,
                      )}`}
                    >
                      <span className="text-xs">{step.id}</span>
                    </div>
                    <span className={`mt-1 text-[11px] ${getStepTextClass(statusValue)}`}>{step.title}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="-my-4 flex flex-1 flex-col overflow-hidden md:flex-row">
            <div className="hidden md:ml-16 md:flex md:w-[140px] md:shrink-0 md:flex-col md:border-l md:border-r lg:w-[140px]">
              <div className="-mx-4 grow items-start py-2 lg:py-6">
                {stepper.steps.map((step, index) => {
                  const statusValue = stepper.getStatus(step.id)
                  return (
                    <div key={step.id}>
                      <div
                        className="ml-6 flex cursor-pointer items-center"
                        onClick={() => stepper.setCurrentStep(step.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            stepper.setCurrentStep(step.id)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${getStepCircleClass(
                            statusValue,
                          )}`}
                        >
                          <span className="text-xs">{step.id}</span>
                        </div>
                        <span className={`ml-2 text-xs ${getStepTextClass(statusValue)}`}>{step.title}</span>
                      </div>
                      {index < stepper.steps.length - 1 && (
                        <div className="my-1 ml-[calc(43px+(--spacing(2))-1px)] h-6 w-px bg-none" />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-auto border-t px-6 py-4">
                <div className="flex flex-col items-start justify-between">
                  <Label className="mb-4 text-sm font-normal tracking-[0.15px] text-black">
                    Status <span className="ml-1 text-[15px] font-normal text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={status.isActive}
                      onCheckedChange={status.onActiveChange}
                      className="data-[state=checked]:bg-[#00DD9C]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto py-4 sm:px-6 sm:py-6">
              <div className="w-full max-w-[640px] space-y-4 sm:space-y-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(() => {})}>
                    {stepper.currentStep === 1 && (
                      <BasicInfoForm
                        form={form}
                        chargerBrands={basicInfo.chargerBrands}
                        chargerTypes={basicInfo.chargerTypes}
                        chargingStations={basicInfo.chargingStations}
                        teamOptions={basicInfo.teamOptions}
                        selectedBrand={basicInfo.selectedBrand}
                        selectedModel={basicInfo.selectedModel}
                        modelOptions={basicInfo.modelOptions}
                        powerLevelOptions={basicInfo.powerLevelOptions}
                        onChargerNameChange={basicInfo.onChargerNameChange}
                        onChargerAccessChange={basicInfo.onChargerAccessChange}
                        onBrandChange={basicInfo.onBrandChange}
                        onModelChange={basicInfo.onModelChange}
                        onTypeConnectorChange={basicInfo.onTypeConnectorChange}
                        onChargingStationChange={basicInfo.onChargingStationChange}
                      />
                    )}

                    {stepper.currentStep === 2 && (
                      <OcppIntegrationForm
                        form={form}
                        chargerName={ocppIntegration.chargerName}
                        onSerialNumberChange={ocppIntegration.onSerialNumberChange}
                      />
                    )}
                  </form>
                </Form>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 border-t bg-card p-4 sm:gap-3 sm:p-4 md:p-6">
            {stepper.currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => stepper.goToPrevious()}
                className="h-10 w-full font-normal text-destructive hover:bg-destructive hover:text-white sm:h-11 sm:w-[175px]"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={(event) => {
                event.preventDefault()
                void stepper.goToNext()
              }}
              disabled={stepper.isSubmitting}
              className={`h-10 w-full font-normal sm:h-11 sm:w-[175px] ${
                !stepper.isSubmitting
                  ? 'bg-[#355ff5] hover:bg-[#2a4dd4]'
                  : 'cursor-not-allowed bg-muted-foreground'
              }`}
            >
              {stepper.isSubmitting ? 'Loading...' : nextButtonLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ChargerAddedDialog
        open={confirmDialog.open}
        onOpenChange={confirmDialog.setOpen}
        title="Charger Added"
        description="‘Connecting’ pairs your charger hardware with out software. This is a critical step before you can start charging. If your charge point is installed, connect it now or do this later whenever your charger is installed"
        onConfirm={confirmDialog.handleConfirm}
      />

      <OcppUrlDialog
        open={ocppDialog.open}
        onOpenChange={ocppDialog.setOpen}
        ocppUrl={ocppDialog.ocppUrl}
        setOcppUrl={ocppDialog.setOcppUrl}
        ocppUrlInputRef={ocppDialog.ocppUrlInputRef as RefObject<HTMLInputElement>}
        additionalInput={ocppDialog.serialNumberForDialog}
      />
    </>
  )
}

export default AddChargerDialog
