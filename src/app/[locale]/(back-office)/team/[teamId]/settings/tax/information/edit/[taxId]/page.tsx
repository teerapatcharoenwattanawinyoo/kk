'use client'

import { TeamGuard } from '@/app/[locale]/(back-office)/team/_components/team-guard'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { TaxInformationForm } from '../../../../_components/tab/tax-information-form'
import { useTaxInformation } from '../../../../_hooks/use-tax'

interface TaxInformationEditPageProps {
  params: Promise<{
    locale: string
    teamId: string
    taxId: string
  }>
}

const TaxInformationEditPage = ({ params }: TaxInformationEditPageProps) => {
  const { locale, teamId } = use(params)
  const router = useRouter()

  // ดึงข้อมูลภาษีปัจจุบัน
  const { data: taxData, isLoading, error } = useTaxInformation(teamId)

  const handleBack = () => {
    router.push(`/${locale}/team/${teamId}/settings/tax`)
  }

  const handleSave = () => {
    router.push(`/${locale}/team/${teamId}/settings/tax`)
  }

  const handleCancel = () => {
    router.push(`/${locale}/team/${teamId}/settings/tax`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !taxData?.data) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">ไม่พบข้อมูลภาษี</p>
          <button
            onClick={handleBack}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            กลับไปหน้าตั้งค่า
          </button>
        </div>
      </div>
    )
  }

  return (
    <TeamGuard locale={locale} teamId={teamId}>
      <div className="h-full border-b bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              แก้ไขข้อมูลภาษี
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-4xl p-6">
          <TaxInformationForm
            teamId={teamId}
            initialData={taxData.data}
            isEditMode={true}
            onBack={handleBack}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </TeamGuard>
  )
}

export default TaxInformationEditPage
