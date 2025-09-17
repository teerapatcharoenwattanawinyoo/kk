'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Download } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface QrPreviewDialogProps {
  qrUrl: string
  connectorName?: string
  connectorId?: string | number
  children: React.ReactNode
}

export function QrPreviewDialog({
  qrUrl,
  connectorName,
  connectorId,
  children,
}: QrPreviewDialogProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleDownload = async () => {
    try {
      if (qrUrl.startsWith('data:')) {
        const link = document.createElement('a')
        link.href = qrUrl
        link.download = `qr-code-${connectorName || connectorId || 'connector'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        const response = await fetch(qrUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `qr-code-${connectorName || connectorId || 'connector'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to download QR code:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="rounded-2xl sm:max-w-[420px]">
        {/* Keep a11y header but hide visually */}
        <DialogHeader className="sr-only">
          <DialogTitle>{connectorName}</DialogTitle>
          <DialogDescription>Connector ID: {connectorId}</DialogDescription>
        </DialogHeader>

        {/* QR Card */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-[320px] rounded-[28px] border-2 border-zinc-800 bg-white p-4 shadow-sm sm:w-[360px]">
            {/* Top row: Title + Pill */}
            <div className="flex items-start justify-between">
              <div>
                <p className="px-1 text-xs font-semibold leading-tight text-zinc-800">
                  {connectorName}
                </p>
                <p className="px-1 text-xs font-semibold text-zinc-800">
                  Connector ID: <span className="font-medium">{connectorId}</span>
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant={'default'}
                className="h-7 rounded-full px-3 text-[10px] font-semibold tracking-wide text-white"
                disabled={hasError}
              >
                SCAN TO CHARGE
              </Button>
            </div>

            {/* QR stage */}
            <div className="relative mx-auto mt-3 flex h-[240px] w-[240px] items-center justify-center">
              {/* Loading / Error / Image */}
              {isLoading && (
                <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}
              {hasError && (
                <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed border-red-300 bg-red-50">
                  <p className="text-sm text-red-600">Failed to load QR code</p>
                </div>
              )}
              {!hasError && (
                <Image
                  src={qrUrl}
                  alt="QR Code"
                  width={340}
                  height={240}
                  className={`border-3 rounded-lg border-dashed transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'} [image-rendering:pixelated]`}
                  priority
                  unoptimized
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false)
                    setHasError(true)
                  }}
                />
              )}
            </div>

            {/* Footer brand */}
            <div className="mt-4 flex items-end justify-end gap-1 text-xs">
              <span className="font-semibold text-zinc-800">Powered by</span>

              <Image
                src="/assets/images/logo/OneChargeLogo2.svg"
                alt="OneCharge Logo"
                height={24}
                width={24}
                loading="eager"
                decoding="sync"
                draggable={false}
                className="h-6 w-auto select-none object-contain"
              />
            </div>
          </div>

          {/* Download button */}
          {!hasError && (
            <Button
              onClick={handleDownload}
              type="button"
              className="flex items-center gap-2 bg-indigo-500 text-white hover:bg-indigo-600"
              disabled={isLoading}
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
