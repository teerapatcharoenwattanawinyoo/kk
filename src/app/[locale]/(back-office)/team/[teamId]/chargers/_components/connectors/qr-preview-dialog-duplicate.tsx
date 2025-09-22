'use client'

import { Badge } from '@/components/ui/badge'
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
import { localApi } from '@/lib/api/config/axios'
import { useState } from 'react'

interface QrPreviewDialogProps {
  qrUrl: string
  connectorName?: string
  connectorId?: string | number
  children: React.ReactNode
}

export function QrPreviewDialogDuplicate({
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
        const blob = await localApi.get<Blob>(qrUrl, {
          responseType: 'blob',
        } as any)
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

      <DialogContent className="max-w-lg rounded-xl">
        {/* Keep a11y header but hide visually */}
        <DialogHeader className="sr-only">
          <DialogTitle>{connectorName}</DialogTitle>
          <DialogDescription>Connector ID: {connectorId}</DialogDescription>
        </DialogHeader>

        {/* QR Card */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-[340px] rounded-3xl border p-6 shadow-sm sm:w-[380px]">
            {/* Top row: Title + Badge */}
            <div className="mb-6 flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-primary">{connectorName}</h3>
                <p className="text-sm text-foreground">
                  Connector ID :{' '}
                  <span className="font-semibold text-foreground">{connectorId}</span>
                </p>
              </div>
              <Badge className="rounded-full px-4 py-2 text-white">⚡ SCAN TO CHARGE</Badge>
            </div>

            {/* QR Container */}
            <div className="relative mx-auto mb-6 flex h-[260px] w-[260px] items-center justify-center rounded-2xl border shadow-inner">
              {/* Loading State */}
              {isLoading && (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}

              {/* Error State */}
              {hasError && (
                <div className="flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
                  <p className="text-sm text-primary/60">Failed to load QR code</p>
                </div>
              )}

              {/* QR Code */}
              {!hasError && (
                <Image
                  src={qrUrl}
                  alt="QR Code"
                  width={240}
                  height={240}
                  className={`rounded-xl transition-opacity duration-300 ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                  } [image-rendering:pixelated]`}
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

            {/* Footer Brand */}
            <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm text-muted-foreground">
              <span className="font-medium">Powered by</span>
              <Image
                src="/assets/images/logo/OneChargeLogo2.svg"
                alt="OneCharge Logo"
                height={20}
                width={20}
                loading="eager"
                decoding="sync"
                draggable={false}
                className="h-5 w-auto object-contain"
              />
            </div>
          </div>

          {/* Download Button */}
          {!hasError && (
            <Button
              onClick={handleDownload}
              type="button"
              variant={'default'}
              className="flex items-center gap-3"
              disabled={isLoading}
            >
              <Download className="h-5 w-5" />
              <span className="font-medium">Download</span>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
