'use client'

import { useTeam } from '@/app/[locale]/(back-office)/team/_hooks/use-teams'

import {
  BillingTypeSchema,
  StatusTypeSchema,
  type FeeFormData,
  type FormData,
  type PriceFormData,
  type PriceType,
} from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_components/forms'
import {
  usePriceGroupDetail,
  useUpdatePriceSet,
} from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_hooks'
import {
  PriceSetTypeSchema,
  submissionToPriceGroupPayload,
} from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_schemas'
import { SuccessDialog } from '@/components/notifications'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import MembersPriceGroupForm from '../../forms/member-price-group-form'

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
  } = usePriceGroupDetail(priceId, {
    type: PriceSetTypeSchema.enum.member,
    pageSize: 100,
  })
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
      billingType:
        priceGroup.type === 'TIERED_CREDIT'
          ? BillingTypeSchema.enum.CREDIT
          : BillingTypeSchema.enum.USAGE,
    }
  }, [priceGroup])

  useEffect(() => {
    if (!priceGroupError) return

    toast.error(priceGroupError.message)
  }, [priceGroupError])

  useEffect(() => {
    if (!priceId || priceGroupStatus !== 'success' || priceGroup) return

    toast.error('Price group not found. Please try again.')
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
      toast.error('Price ID not found. Please try again.')
      return
    }
    if (!teamData?.team_group_id) {
      toast.error('Team group ID not found. Please try again.')
      return
    }
    const numericTeamGroupId = Number(teamData.team_group_id)
    if (!Number.isFinite(numericTeamGroupId) || numericTeamGroupId <= 0) {
      toast.error('Invalid team group ID. Please try again.')
      return
    }
    try {
      const payload = submissionToPriceGroupPayload(
        data,
        StatusTypeSchema.enum.MEMBER,
        numericTeamGroupId,
      )

      await updatePriceSetMutation.mutateAsync({ priceId, data: payload })
      setIsSuccess(true)
    } catch (error) {
      console.error('Error updating price set:', error)
      toast.error('Failed to update Member Price Group. Please try again.')
    }
  }

  return (
    <>
      <MembersPriceGroupForm
        mode="edit"
        statusType={StatusTypeSchema.enum.MEMBER}
        initialData={initialData}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onBack={handleBack}
        billingType={initialData?.billingType ?? BillingTypeSchema.enum.USAGE}
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
