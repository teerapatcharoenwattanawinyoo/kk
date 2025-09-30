'use client'

import DeleteConfirmDialog from '@/components/notifications/delete-confirm-dialog'
import ErrorDialog from '@/components/notifications/error-dialog'
import SuccessDialog from '@/components/notifications/success-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { colors } from '@/lib/utils/colors'
import { Edit, FileText, Loader2, MoreVertical, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useDeleteTaxInformation, useTaxInformation } from '../../_hooks/use-tax'

interface TaxInformationTabProps {
  teamId: string
  onCreateClick: () => void
  onEditClick?: (taxData: { id: string; [key: string]: unknown }) => void
}

export const TaxInformationTab = ({
  teamId,
  onCreateClick,
  onEditClick,
}: TaxInformationTabProps) => {
  const { data: taxData, isLoading } = useTaxInformation(teamId)
  const deleteTaxMutation = useDeleteTaxInformation(teamId)

  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleEditTax = () => {
    if (onEditClick && taxData?.data) {
      onEditClick(taxData.data)
    }
  }

  const handleDeleteTax = async () => {
    if (!taxData?.data?.id) {
      setErrorMessage('ไม่พบ ID ของข้อมูลภาษี')
      setShowErrorDialog(true)
      return
    }
    setShowDeleteDialog(true)
  }

  const confirmDeleteTax = async () => {
    if (!taxData?.data?.id) return

    try {
      await deleteTaxMutation.mutateAsync(taxData.data.id.toString())
      setSuccessMessage('ลบข้อมูลภาษีเรียบร้อยแล้ว')
      setShowSuccessDialog(true)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Error deleting tax:', error)
      setErrorMessage('เกิดข้อผิดพลาดในการลบข้อมูลภาษี กรุณาลองอีกครั้ง')
      setShowErrorDialog(true)
      setShowDeleteDialog(false)
    }
  }

  // กำลังโหลดข้อมูล
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">กำลังโหลดข้อมูลภาษี...</p>
      </div>
    )
  }

  // มีข้อมูลภาษีแล้ว
  if (taxData?.data) {
    const tax = taxData.data
    return (
      <div className="space-y-6 p-6">
        <Card
          className={`h-fit w-full overflow-hidden rounded-lg bg-background px-3 transition-shadow duration-200 hover:shadow-lg ${
            deleteTaxMutation.isPending ? 'pointer-events-none opacity-50' : ''
          }`}
          style={{
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
            minHeight: '200px',
          }}
        >
          <CardHeader className="flex flex-col space-y-2 px-0 pb-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="dark:bg-primary/6 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg font-semibold text-foreground">ข้อมูลภาษี</CardTitle>
                <p className="text-oc-sidebar text-sm">
                  {tax.company_name || `${tax.name} ${tax.last_name}`}
                </p>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center justify-end gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  tax.status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : tax.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {tax.status === 'Approved'
                  ? 'อนุมัติแล้ว'
                  : tax.status === 'Rejected'
                    ? 'ไม่อนุมัติ'
                    : 'รออนุมัติ'}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="h-4 w-4" style={{ color: colors.neutral[500] }} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditTax}>
                    <Edit className="mr-2 h-3.5 w-3.5" />
                    แก้ไข
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onCreateClick}>
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    สร้างใหม่
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={deleteTaxMutation.isPending ? () => {} : handleDeleteTax}
                    className="text-red-600 focus:text-red-600"
                    disabled={deleteTaxMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" style={{ color: colors.error[500] }} />
                    {deleteTaxMutation.isPending ? 'กำลังลบ...' : 'ลบ'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <hr className="border border-t" />
          <CardContent className="space-y-4 px-0 pb-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-oc-title-secondary text-sm font-medium">ชื่อ-นามสกุล</label>
                <p className="text-oc-sidebar text-sm">
                  {tax.name} {tax.last_name}
                </p>
              </div>
              {tax.company_name && (
                <div className="space-y-1">
                  <label className="text-oc-title-secondary text-sm font-medium">ชื่อบริษัท</label>
                  <p className="text-oc-sidebar text-sm">{tax.company_name}</p>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-oc-title-secondary text-sm font-medium">
                  เลขประจำตัวผู้เสียภาษี
                </label>
                <p className="text-oc-sidebar font-mono text-sm">{tax.tax_id}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-oc-title-secondary text-sm font-medium">ที่อยู่</label>
                <p className="text-oc-sidebar text-sm">
                  {tax.address}, {tax.sub_district}, {tax.district}, {tax.province} {tax.post_code}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ไม่มีข้อมูลภาษี หรือ error 404
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <div className="bg-blackwhite-primary mb-4 flex h-16 w-16 items-center justify-center rounded-lg">
        <FileText className="h-8 w-8 text-background" />
      </div>
      <p className="text-oc-title-secondary mb-1 text-center text-sm">ยังไม่มีข้อมูลภาษี</p>
      <p className="text-oc-title-secondary mb-8 text-center text-sm">กรุณาสร้างข้อมูลภาษี</p>
      <Button
        className="flex items-center rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-shadow hover:shadow-md"
        variant={'success'}
        onClick={onCreateClick}
      >
        <Plus className="mr-2 h-4 w-4" />
        สร้างข้อมูลภาษี
      </Button>

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="ลบข้อมูลภาษี"
        description="คุณแน่ใจหรือไม่ที่จะลบข้อมูลภาษี? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        onConfirm={confirmDeleteTax}
        isLoading={deleteTaxMutation.isPending}
      />

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="สำเร็จ"
        message={successMessage}
        buttonText="ตกลง"
      />

      {/* Error Dialog */}
      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title="เกิดข้อผิดพลาด"
        message={errorMessage}
        buttonText="ตกลง"
      />
    </div>
  )
}
