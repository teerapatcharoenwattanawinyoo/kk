'use client'

import { useCreatePriceSet } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_hooks'
import { submissionToPriceGroupPayload } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_schemas'
import { SuccessDialog } from '@/components/notifications'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  PriceGroupForm,
  type FeeFormData,
  type FormData,
  type PriceFormData,
  type PriceType,
} from '../../forms'

export default function AddPriceGroup() {
  const router = useRouter()
  const params = useParams()
  const teamId = params.teamId as string
  const [isSuccess, setIsSuccess] = useState(false)

  // Hooks for API calls
  const createPriceSetMutation = useCreatePriceSet()
  const isLoading = createPriceSetMutation.isPending

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async (data: {
    form: FormData
    priceForm: PriceFormData
    feeForm: FeeFormData
    priceType: PriceType
  }) => {
    const numericTeamGroupId = Number(teamId)
    if (!Number.isFinite(numericTeamGroupId) || numericTeamGroupId <= 0) {
      toast.error('Invalid team group ID. Please try again.')
      return
    }

    try {
      const payload = submissionToPriceGroupPayload(data, 'GENERAL', numericTeamGroupId)

      await createPriceSetMutation.mutateAsync(payload)
      setIsSuccess(true)
    } catch (error) {
      console.error('Error creating price set:', error)
      toast.error('Failed to create price group. Please try again.')
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
        teamGroupId={teamId}
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
