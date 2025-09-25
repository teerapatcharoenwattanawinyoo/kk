'use client'

import { useTeam } from '@/app/[locale]/(back-office)/team/_hooks/use-teams'

import {
  PriceGroupForm,
  type FeeFormData,
  type FormData,
  type PriceFormData,
  type PriceType,
} from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_components/forms'
import {
  usePriceGroupDetail,
  useUpdatePriceSet,
} from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_hooks/use-price-group'
import { UpdatePriceRequest } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_servers/price-groups'
import { SuccessDialog } from '@/components/notifications'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function EditMemberPriceGroup() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const teamId = params.teamId as string
  const priceId = searchParams.get('priceId')
  const [isSuccess, setIsSuccess] = useState(false)

  // Hooks for API calls
  const updatePriceSetMutation = useUpdatePriceSet()
  const { data: teamData } = useTeam(teamId)
  const {
    data: priceGroup,
    isLoading: isPriceGroupLoading,
    status: priceGroupStatus,
    error: priceGroupError,
  } = usePriceGroupDetail(priceId, { type: 'member', pageSize: 100 })
  const isLoading = updatePriceSetMutation.isPending || isPriceGroupLoading

  const initialData = useMemo(() => {
    if (!priceGroup) return undefined

    const toStringSafe = (value: number | string | null | undefined) =>
      value !== null && value !== undefined ? String(value) : ''

    const castedPriceType = (priceGroup.type as PriceType) || 'PER_KWH'

    return {
      form: {
        groupName: priceGroup.name || '',
        status: 'publish',
      },
      priceForm: {
        pricePerKwh: priceGroup.price_per_kwh || '',
        pricePerKwhMinute: priceGroup.price_per_kwh || '',
        price_per_minute: priceGroup.price_per_minute || '',
        onPeakPrice: priceGroup.price_on_peak || '',
        offPeakPrice: priceGroup.price_off_peak || '',
        freeKw: '',
        freeKwh: '',
      },
      feeForm: {
        startingFeeDescription: priceGroup.starting_fee?.description || '',
        fee: priceGroup.starting_fee?.fee || '',
        chargingFeeDescription: priceGroup.charging_fee?.description || '',
        feePrice: priceGroup.charging_fee?.fee_price || '',
        applyAfterMinute: toStringSafe(priceGroup.charging_fee?.apply_after_minute),
        minuteFeeDescription: priceGroup.minute_fee?.description || '',
        feePerMin: priceGroup.minute_fee?.fee_per_min || '',
        applyFeeAfterMinute: toStringSafe(priceGroup.minute_fee?.apply_fee_after_minute),
        feeStopsAfterMinute: toStringSafe(priceGroup.minute_fee?.fee_stops_after_minute),
        idleFeeDescription: priceGroup.idle_fee?.description || '',
        feePerMinIdle: priceGroup.idle_fee?.fee_per_min || '',
        timeBeforeIdleFeeApplied: toStringSafe(priceGroup.idle_fee?.time_before_idle_fee_applied),
        maxTotalIdleFee: toStringSafe(priceGroup.idle_fee?.max_total_idle_fee),
      },
      priceType: castedPriceType,
      billingType: priceGroup.type === 'TIERED_CREDIT' ? 'CREDIT' : 'USAGE',
    }
  }, [priceGroup])

  useEffect(() => {
    if (!priceGroupError) return

    toast({
      title: 'Error',
      description: priceGroupError.message,
      variant: 'destructive',
    })
  }, [priceGroupError])

  useEffect(() => {
    if (!priceId || priceGroupStatus !== 'success' || priceGroup) return

    toast({
      title: 'Error',
      description: 'Price group not found. Please try again.',
      variant: 'destructive',
    })
  }, [priceGroup, priceGroupStatus, priceId])

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async (data: {
    form: FormData
    priceForm: PriceFormData
    feeForm: FeeFormData
    priceType: PriceType
  }) => {
    if (!priceId) {
      toast({
        title: 'Error',
        description: 'Price ID not found. Please try again.',
        variant: 'destructive',
      })
      return
    }
    if (!teamData?.team_group_id) {
      toast({
        title: 'Error',
        description: 'Team group ID not found. Please try again.',
        variant: 'destructive',
      })
      return
    }

    try {
      // แก้ไข type ให้ตรงกับ API (free ต้องเป็น PER_KWH)
      const requestData: UpdatePriceRequest = {
        type: data.priceType === 'free' ? 'PER_KWH' : data.priceType,
        name: data.form.groupName,
        status_type: 'MEMBER',
      }

      // Main price fields
      if (data.priceType === 'PER_KWH' || data.priceType === 'free') {
        if (data.priceForm.pricePerKwh)
          requestData.price_per_kwh = Number(data.priceForm.pricePerKwh)
        // free: ใช้ freeKwh เป็น price_per_kwh, freeKw ไม่ต้องส่ง
        if (data.priceType === 'free' && data.priceForm.freeKwh)
          requestData.price_per_kwh = Number(data.priceForm.freeKwh)
      } else if (data.priceType === 'PER_MINUTE') {
        if (data.priceForm.pricePerKwhMinute)
          requestData.price_per_kwh = Number(data.priceForm.pricePerKwhMinute)
        if (data.priceForm.price_per_minute)
          requestData.price_per_minute = Number(data.priceForm.price_per_minute)
      } else if (data.priceType === 'PEAK') {
        if (data.priceForm.onPeakPrice)
          requestData.price_on_peak = Number(data.priceForm.onPeakPrice)
        if (data.priceForm.offPeakPrice)
          requestData.price_off_peak = Number(data.priceForm.offPeakPrice)
      }

      // Additional fees: mapping ให้ตรงกับ API
      if (data.feeForm.fee) {
        requestData.starting_fee = {
          description: data.feeForm.startingFeeDescription,
          fee: data.feeForm.fee,
        }
      }
      if (data.feeForm.feePrice) {
        requestData.charging_fee = {
          description: data.feeForm.chargingFeeDescription,
          feePrice: data.feeForm.feePrice,
          apply_after_minute: data.feeForm.applyAfterMinute
            ? Number(data.feeForm.applyAfterMinute)
            : 0,
        }
      }
      if (data.feeForm.feePerMin) {
        requestData.minute_fee = {
          description: data.feeForm.minuteFeeDescription,
          feePerMin: data.feeForm.feePerMin,
          apply_fee_after_minute: data.feeForm.applyFeeAfterMinute
            ? Number(data.feeForm.applyFeeAfterMinute)
            : 0,
          fee_stops_after_minute: data.feeForm.feeStopsAfterMinute
            ? Number(data.feeForm.feeStopsAfterMinute)
            : undefined,
        }
      }
      if (data.feeForm.feePerMinIdle) {
        requestData.idle_fee = {
          description: data.feeForm.idleFeeDescription,
          feePerMin: data.feeForm.feePerMinIdle,
          time_before_idle_fee_applied: data.feeForm.timeBeforeIdleFeeApplied
            ? Number(data.feeForm.timeBeforeIdleFeeApplied)
            : 0,
          max_total_idle_fee: data.feeForm.maxTotalIdleFee
            ? Number(data.feeForm.maxTotalIdleFee)
            : undefined,
        }
      }

      await updatePriceSetMutation.mutateAsync({ priceId, data: requestData })
      setIsSuccess(true)
    } catch (error) {
      console.error('Error updating price set:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update price set',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <PriceGroupForm
        mode="edit"
        statusType="MEMBER"
        initialData={initialData}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onBack={handleBack}
        billingType={initialData?.billingType ?? 'USAGE'}
      />

      <SuccessDialog
        open={isSuccess}
        onOpenChange={setIsSuccess}
        title="Success"
        message="Member Price Group has been updated successfully"
        buttonText="Done"
        onButtonClick={() => {
          setIsSuccess(false)
          router.back()
        }}
      />
    </>
  )
}
