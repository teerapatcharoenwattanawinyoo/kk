'use client'

import { SuccessDialog } from '@/components/notifications'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useOcppUrlDialogController } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_hooks/use-ocpp-url-dialog'
import { Check, Copy, Loader2 } from 'lucide-react'
import Image from 'next/image'
import type { RefObject } from 'react'

interface OcppUrlDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ocppUrl: string
  setOcppUrl: (url: string) => void
  ocppUrlInputRef: RefObject<HTMLInputElement>
  additionalInput?: string
}

const OcppUrlDialog: React.FC<OcppUrlDialogProps> = ({
  open,
  onOpenChange,
  ocppUrl,
  setOcppUrl,
  ocppUrlInputRef,
  additionalInput,
}) => {
  const controller = useOcppUrlDialogController({
    open,
    onOpenChange,
    ocppUrl,
    ocppUrlInputRef,
    additionalInput,
  })

  const { dialog, successDialog, completeUrl, error, isLoading, copied } = controller

  return (
    <>
      {isLoading && (
        <div className="z-9999 fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Pairing charger...</p>
          </div>
        </div>
      )}

      <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
        <DialogContent className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl px-3 py-6 sm:px-4 md:px-10 md:py-8">
          <DialogTitle className="sr-only">OCPP URL Configuration</DialogTitle>
          <DialogDescription className="sr-only">
            Configure the OCPP URL for your charger to establish connection with OneCharge server
          </DialogDescription>
          <div className="mb-4 flex flex-col items-center">
            <Image
              src="/assets/images/logo/OneChargeLogoSecondary.svg"
              alt="OCPP"
              width={48}
              height={48}
              unoptimized
              priority
              className="h-[48px] w-[48px] sm:h-[64px] sm:w-[64px] md:h-[81.68px] md:w-[81.68px]"
            />
            <h2 className="mb-2 mt-3 text-center text-lg font-semibold text-primary sm:mb-4 sm:mt-4 sm:text-xl">
              OCPP Url Configuration
            </h2>
            <p className="mt-2 text-center text-xs font-light text-[#767676] sm:text-left sm:text-sm">
              Configure your EV charger with the OCPP URL below and the charger code you registered. The serial number will
              automatically appear in your charger list once your physical EV charger connects successfully via OCPP protocol.
            </p>
            <p className="mt-6 text-center text-xs font-light text-[#767676] sm:mt-10 sm:text-left sm:text-sm">
              If you don&apos;t have a physical charger yet, you can use an OCPP simulator for testing. The connection status and
              serial number will update once the device connects.
            </p>
            <span className="mt-6 text-center text-xs text-[#6E82A5] sm:mt-10 sm:text-left sm:text-sm">
              *Not all chargers support setting an OCPP URL. If this is the case with your charger, then skip this step.
            </span>
          </div>
          <form className="flex w-full flex-col gap-4">
            <div className="relative">
              <div className="flex items-center">
                <Input
                  disabled
                  id="ocppUrl"
                  ref={ocppUrlInputRef}
                  value={completeUrl}
                  onChange={(event) => setOcppUrl(event.target.value)}
                  placeholder={controller.ocppBaseUrl}
                  className="h-10 rounded-lg pr-16 text-xs sm:h-11 sm:pr-20 sm:text-sm"
                  readOnly={!!additionalInput}
                />
                <Button
                  type="button"
                  size="sm"
                  className="absolute right-1 top-1/2 h-7 w-8 -translate-y-1/2 rounded-lg sm:right-2 sm:h-8 sm:w-10"
                  onClick={() => {
                    void controller.handleCopy()
                  }}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-white sm:h-[19px] sm:w-[19px]" />
                  ) : (
                    <Copy className="h-4 w-4 sm:h-[19px] sm:w-[19px]" />
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-center">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <div className="flex w-full items-center justify-center gap-3 pt-4">
              <Button
                variant="default"
                className="h-10 w-full rounded-2xl text-sm font-medium sm:h-11 sm:w-1/2"
                type="submit"
                onClick={(event) => {
                  void controller.handleSubmit(event)
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Pairing...
                  </>
                ) : (
                  'Pair charger'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SuccessDialog
        open={successDialog.open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            successDialog.setOpen(true)
          } else {
            successDialog.handleClose()
          }
        }}
        title="Success"
        message="Charger pairing completed successfully! The charger connection has been established."
      />
    </>
  )
}

export default OcppUrlDialog
