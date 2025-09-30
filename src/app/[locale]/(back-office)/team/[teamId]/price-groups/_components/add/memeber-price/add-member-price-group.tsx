'use client'

import { useTeam } from '@/app/[locale]/(back-office)/team/_hooks/use-teams'

import { useCreatePriceSet } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_hooks'
import { submissionToPriceGroupPayload } from '@/app/[locale]/(back-office)/team/[teamId]/price-groups/_schemas'
import { SuccessDialog } from '@/components/notifications'
import { toast } from '@/hooks/use-toast'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  MemberPriceGroupForm,
  type FeeFormData,
  type FormData,
  type PriceFormData,
  type PriceType,
} from '../../forms'

export default function AddMemberPriceGroup() {
  const router = useRouter()
  const params = useParams()
  const teamId = params.teamId as string
  const [isSuccess, setIsSuccess] = useState(false)

  // Hooks for API calls
  const createPriceSetMutation = useCreatePriceSet()
  const isLoading = createPriceSetMutation.isPending
  const { data: teamData } = useTeam(teamId)

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async (data: {
    form: FormData
    priceForm: PriceFormData
    feeForm: FeeFormData
    priceType: PriceType
  }) => {
    if (!teamData?.team_group_id) {
      toast({
        title: 'Error',
        description: 'Team group ID not found. Please try again.',
        variant: 'destructive',
      })
      return
    }
    const numericTeamGroupId = Number(teamData.team_group_id)
    if (!Number.isFinite(numericTeamGroupId) || numericTeamGroupId <= 0) {
      toast({
        title: 'Error',
        description: 'Invalid team group ID. Please try again.',
        variant: 'destructive',
      })
      return
    }

    try {
      const payload = submissionToPriceGroupPayload(data, 'MEMBER', numericTeamGroupId)

      await createPriceSetMutation.mutateAsync(payload)
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
      <MemberPriceGroupForm
        mode="add"
        statusType="MEMBER"
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onBack={handleBack}
        teamGroupId={teamData?.team_group_id?.toString()}
      />

      <SuccessDialog
        open={isSuccess}
        onOpenChange={setIsSuccess}
        title="Success"
        message="Member Price Group has created completed"
        buttonText="Done"
        onButtonClick={() => {
          setIsSuccess(false)
          router.back()
        }}
      />
    </>
  )
}
