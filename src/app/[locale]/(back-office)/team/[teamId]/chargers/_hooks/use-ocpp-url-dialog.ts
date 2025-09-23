'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { checkConnection } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/charger'

type UseOcppUrlDialogControllerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ocppUrl: string
  ocppUrlInputRef: React.RefObject<HTMLInputElement>
  additionalInput?: string
}

type DialogState = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SuccessDialogState = {
  open: boolean
  setOpen: (open: boolean) => void
  handleClose: () => void
}

type OcppUrlDialogState = {
  dialog: DialogState
  successDialog: SuccessDialogState
  completeUrl: string
  error: string | null
  isLoading: boolean
  copied: boolean
  handleSubmit: (event?: React.FormEvent) => Promise<void>
  handleCopy: () => Promise<void>
  ocppBaseUrl: string
  setError: (error: string | null) => void
  setCopied: (value: boolean) => void
}

const DEFAULT_OCPP_URL = process.env.NEXT_PUBLIC_OCPP_BASE_URL || 'ws://ocpp.onecharge.co.th'

export function useOcppUrlDialogController({
  open,
  onOpenChange,
  ocppUrl,
  ocppUrlInputRef,
  additionalInput,
}: UseOcppUrlDialogControllerProps): OcppUrlDialogState {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const ocppBaseUrl = useMemo(() => DEFAULT_OCPP_URL, [])

  const completeUrl = useMemo(() => {
    if (additionalInput) {
      return `${ocppBaseUrl}/${additionalInput}`
    }
    return ocppUrl
  }, [additionalInput, ocppBaseUrl, ocppUrl])

  useEffect(() => {
    if (open) {
      setError(null)
    }
  }, [open])

  const handleDialogOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setError(null)
      }
      onOpenChange(nextOpen)
    },
    [onOpenChange],
  )

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault()

      if (!additionalInput) {
        setError('Serial number is required for connection check')
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await checkConnection(additionalInput)

        if (response.statusCode === 200 && response.data.status !== 'Failed') {
          setShowSuccessDialog(true)
        } else {
          const responseData = response.data as {
            status?: string
            detail?: string
            message?: string
          }

          const errorMessage =
            responseData?.detail ||
            response.message ||
            `Connection failed: ${responseData?.status || 'Unknown error'}`

          setError(errorMessage)
        }
      } catch (submitError) {
        console.error('Error checking charger connection:', submitError)
        setError('Failed to check charger connection. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [additionalInput],
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(completeUrl)
      setCopied(true)
      if (ocppUrlInputRef.current) {
        ocppUrlInputRef.current.select()
      }
      setTimeout(() => setCopied(false), 1500)
    } catch (copyError) {
      console.error('Failed to copy OCPP URL', copyError)
    }
  }, [completeUrl, ocppUrlInputRef])

  const handleSuccessClose = useCallback(() => {
    setShowSuccessDialog(false)
    setError(null)
    onOpenChange(false)
  }, [onOpenChange])

  const dialogState: DialogState = {
    open,
    onOpenChange: handleDialogOpenChange,
  }

  const successDialogState: SuccessDialogState = {
    open: showSuccessDialog,
    setOpen: setShowSuccessDialog,
    handleClose: handleSuccessClose,
  }

  return {
    dialog: dialogState,
    successDialog: successDialogState,
    completeUrl,
    error,
    isLoading,
    copied,
    handleSubmit,
    handleCopy,
    ocppBaseUrl,
    setError,
    setCopied,
  }
}
