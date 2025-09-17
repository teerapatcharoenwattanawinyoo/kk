'use client'

import MemberGroupForm from '@/components/back-office/team/form/member-group/member-form'
import { TeamGuard } from '@/components/back-office/team/team-guard'
import SuccessDialog from '@/components/notifications/success-dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'

interface AddMemberGroupPageProps {
  params: Promise<{ locale: string; teamId: string }>
}

export default function AddMemberGroup({ params }: AddMemberGroupPageProps) {
  const router = useRouter()
  const { teamId, locale } = use(params)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      // Call create member group API
      const res = await fetch(`/api/teams/${teamId}/member-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // NOTE: The form is currently self-contained; send minimal payload.
        body: JSON.stringify({}),
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error('Failed to create member group')
      }

      setOpenSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <div className="p-3 md:p-6">
        <div className="shadow-xs mx-auto flex w-full flex-col rounded-lg bg-card p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBack}
                variant={'secondary'}
                size={'icon'}
                className="h-7 w-7 rounded-full"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </Button>
              <h1 className="text-title text-xl font-semibold">Add Member Group</h1>
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              size={'sm'}
              className="w-40 text-primary-foreground"
              variant={'success'}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>

          <div className="mt-8">
            <MemberGroupForm />
          </div>
        </div>
      </div>

      <SuccessDialog
        open={openSuccess}
        onOpenChange={setOpenSuccess}
        title="Success"
        message="Member Group has created completed"
        buttonText="Done"
        onButtonClick={() => router.push(`/${locale}/team/${teamId}/members`)}
      />
    </TeamGuard>
  )
}
