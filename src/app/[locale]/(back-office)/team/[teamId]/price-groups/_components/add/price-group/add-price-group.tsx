'use client'

import { useCreatePriceSet } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_hooks/use-price-group'
import { CreatePriceRequest } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_servers/price-groups'
import { useTeamHostId } from '@/app/[locale]/(back-office)/team/_hooks/use-teams'
import { SuccessDialog } from '@/components/notifications'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  PriceGroupForm,
  type FeeFormData,
  type FormData,
  type PriceFormData,
  type PriceType,
} from '../../member-group/price-groups/'

export default function AddPriceGroup() {
  const router = useRouter()
  const params = useParams()
  const teamId = params.teamId as string
  const [isSuccess, setIsSuccess] = useState(false)

  // Hooks for API calls
  const createPriceSetMutation = useCreatePriceSet()
  const isLoading = createPriceSetMutation.isPending
  const teamHostId = useTeamHostId()

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async (data: {
    form: FormData
    priceForm: PriceFormData
    feeForm: FeeFormData
    priceType: PriceType
  }) => {
    if (!teamHostId) {
      toast({
        title: 'Error',
        description: 'Team host ID not found. Please try again.',
        variant: 'destructive',
      })
      return
    }

    try {
      // Prepare the request data based on the form
      const requestData: CreatePriceRequest = {
        type: data.priceType === 'free' ? 'PER_KWH' : data.priceType,
        team_group_id: Number(teamHostId),
        name: data.form.groupName,
        status_type: 'GENERAL',
      }

      // Add pricing fields based on type
      if (data.priceType === 'PER_KWH') {
        requestData.price_per_kwh = parseFloat(data.priceForm.pricePerKwh)
      } else if (data.priceType === 'free') {
        // For free charge promotion, set price_per_kwh to the value after free kWh
        requestData.price_per_kwh = parseFloat(data.priceForm.freeKwh)
      } else if (data.priceType === 'PER_MINUTE') {
        requestData.price_per_kwh = parseFloat(data.priceForm.pricePerKwhMinute)
        requestData.price_per_minute = parseFloat(data.priceForm.price_per_minute)
      } else if (data.priceType === 'PEAK') {
        requestData.price_on_peak = parseFloat(data.priceForm.onPeakPrice)
        requestData.price_off_peak = parseFloat(data.priceForm.offPeakPrice)
      }

      // Add fees if provided
      if (data.priceType === 'free') {
        // For free charge promotion, add free kW info
        const freeDescription = `Free ${data.priceForm.freeKw} kW charge`
        const existingStartingFee = data.feeForm.startingFeeDescription

        requestData.starting_fee = {
          description: existingStartingFee
            ? `${freeDescription}, ${existingStartingFee}`
            : freeDescription,
          fee: data.feeForm.fee || '0',
        }
      } else if (data.feeForm.fee) {
        requestData.starting_fee = {
          description: data.feeForm.startingFeeDescription,
          fee: data.feeForm.fee,
        }
      }

      if (data.feeForm.feePrice) {
        requestData.charging_fee = {
          description: data.feeForm.chargingFeeDescription,
          feePrice: data.feeForm.feePrice,
          apply_after_minute: parseInt(data.feeForm.applyAfterMinute),
        }
      }

      if (data.feeForm.feePerMin) {
        requestData.minute_fee = {
          description: data.feeForm.minuteFeeDescription,
          feePerMin: data.feeForm.feePerMin,
          apply_fee_after_minute: parseInt(data.feeForm.applyFeeAfterMinute),
          fee_stops_after_minute: data.feeForm.feeStopsAfterMinute
            ? parseInt(data.feeForm.feeStopsAfterMinute)
            : undefined,
        }
      }

      if (data.feeForm.feePerMinIdle) {
        requestData.idle_fee = {
          description: data.feeForm.idleFeeDescription,
          feePerMin: data.feeForm.feePerMinIdle,
          time_before_idle_fee_applied: parseInt(data.feeForm.timeBeforeIdleFeeApplied),
          max_total_idle_fee: data.feeForm.maxTotalIdleFee
            ? parseFloat(data.feeForm.maxTotalIdleFee)
            : undefined,
        }
      }

      await createPriceSetMutation.mutateAsync(requestData)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error creating price set:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create price set',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <PriceGroupForm
        mode="add"
        statusType="GENERAL"
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onBack={handleBack}
        teamGroupId={teamHostId?.toString()}
      />

      <SuccessDialog
        open={isSuccess}
        onOpenChange={setIsSuccess}
        title="Success"
        message="Public Price Group has created completed"
        buttonText="Done"
        onButtonClick={() => {
          setIsSuccess(false)
          router.back()
        }}
      />
    </>
  )
}
