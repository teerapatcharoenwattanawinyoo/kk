'use client'

import { ReceiptPreviewDialog } from '@/components/back-office/team/settings/tab/receipt-preview/receipt-preview-dialog'
import { useFileUpload, useTaxInvoiceReceipt, useUpdateReceiptTaxInvoice } from '@/hooks/use-tax'
import { colors } from '@/lib/utils/colors'
import { Button, Input, Label } from '@/ui'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export const ReceiptTaxInvoiceTab = ({ teamId }: { teamId: string }) => {
  const [formData, setFormData] = useState({
    tax_title: 'ใบเสร็จรับเงิน',
    tax_code: '',
    tax_fullname: '',
    tax_branch: '',
    tax_payee_name: '',
    tax_position: '',
    tax_country: '',
    tax_address: '',
    province: '',
    district: '',
    sub_district: '',
    post_code: '',
    tax_note: '',
  })

  const [files, setFiles] = useState({
    tax_logo: null as File | string | null,
    tax_signature: null as File | string | null,
  })

  const [showPreview, setShowPreview] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalData, setOriginalData] = useState<{
    tax_title: string
    tax_code: string
    tax_fullname: string
    tax_branch: string
    tax_payee_name: string
    tax_position: string
    tax_logo?: string | null
    tax_signature?: string | null
  } | null>(null)

  // API hooks
  const { data: taxInvoiceReceiptData, isLoading, error } = useTaxInvoiceReceipt(teamId)
  const updateMutation = useUpdateReceiptTaxInvoice(teamId)
  const { handleFileSelect } = useFileUpload()

  // Check if data exists
  const hasExistingData = taxInvoiceReceiptData?.data && !error

  // Load existing data into form
  useEffect(() => {
    if (hasExistingData && taxInvoiceReceiptData?.data) {
      const data = taxInvoiceReceiptData.data
      const newFormData = {
        tax_title: data.tax_title || 'ใบเสร็จรับเงิน',
        tax_code: data.tax_code || '',
        tax_fullname: data.tax_fullname || '',
        tax_branch: data.tax_branch || '',
        tax_payee_name: data.tax_payee_name || '',
        tax_position: data.tax_position || '',
        tax_country: data.tax_country || '',
        tax_address: data.tax_address || '',
        province: data.province || '',
        district: data.district || '',
        sub_district: data.sub_district || '',
        post_code: data.post_code || '',
        tax_note: data.tax_note || '',
      }

      setFormData(newFormData)
      setOriginalData(newFormData)

      // Load existing files/images
      setFiles({
        tax_logo: data.tax_logo || null,
        tax_signature: data.tax_signature || null,
      })

      setHasChanges(false)
    }
  }, [hasExistingData, taxInvoiceReceiptData])

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const dataChanged = JSON.stringify(formData) !== JSON.stringify(originalData)
      setHasChanges(dataChanged)
    }
  }, [formData, originalData])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUpload = (type: 'tax_logo' | 'tax_signature') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.jpg,.jpeg,.png'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        handleFileSelect(
          file,
          (validFile) => {
            setFiles((prev) => ({
              ...prev,
              [type]: validFile,
            }))
          },
          (errors) => {
            alert(errors.join('\n'))
          },
        )
      }
    }
    input.click()
  }

  const validateTaxId = (taxId: string) => {
    // ตรวจสอบรูปแบบและ checksum ของเลขประจำตัวผู้เสียภาษี
    const cleaned = taxId.replace(/[-\s]/g, '')
    if (cleaned.length !== 13) return false

    // // Checksum validation for Thai tax ID
    // let sum = 0;
    // for (let i = 0; i < 12; i++) {
    //   sum += parseInt(cleaned.charAt(i)) * (13 - i);
    // }
    // const checkDigit = (11 - (sum % 11)) % 10;
    // return checkDigit === parseInt(cleaned.charAt(12));
    return true
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleSave = async () => {
    try {
      // Validation
      const errors = []

      if (!formData.tax_code || !validateTaxId(formData.tax_code)) {
        errors.push('เลขประจำตัวผู้เสียภาษีไม่ถูกต้อง')
      }
      if (!formData.tax_fullname) errors.push('ชื่อผู้เสียภาษีจำเป็นต้องกรอก')
      if (!formData.tax_branch) errors.push('สำนักงาน/สาขาที่จำเป็นต้องกรอก')
      if (!formData.tax_payee_name) errors.push('ชื่อผู้รับเงินจำเป็นต้องกรอก')
      if (!formData.tax_country) errors.push('ประเทศจำเป็นต้องกรอก')
      if (!formData.tax_address) errors.push('ที่อยู่จำเป็นต้องกรอก')
      if (!formData.province) errors.push('จังหวัดจำเป็นต้องเลือก')
      if (!formData.district) errors.push('เขต/อำเภอจำเป็นต้องเลือก')
      if (!formData.sub_district) errors.push('แขวง/ตำบลจำเป็นต้องเลือก')
      if (!formData.post_code || !/^\d{5}$/.test(formData.post_code)) {
        errors.push('รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก')
      }

      if (errors.length > 0) {
        alert('ข้อผิดพลาด:\n' + errors.join('\n'))
        return
      }

      const dataToSave = {
        ...formData,
        tax_logo: files.tax_logo,
        tax_signature: files.tax_signature,
      }

      await updateMutation.mutateAsync(dataToSave)

      if (hasExistingData) {
        alert('อัปเดตข้อมูลเรียบร้อย')
      } else {
        alert('สร้างข้อมูลเรียบร้อย')
      }
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving:', error)
      alert('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        {/* Warning Message */}
        {hasChanges && hasExistingData && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-yellow-800">
                มีการเปลี่ยนแปลงข้อมูล กรุณากดปุ่ม Update เพื่อบันทึกการเปลี่ยนแปลง
              </span>
            </div>
          </div>
        )}

        <h3 className="text-title mb-8 text-lg font-medium">Receipt Tax Invoice Configuration</h3>

        {/* ข้อมูลทั่วไป */}
        <div className="mb-10">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-5">
              {/* เลขประจำตัวผู้เสียภาษี */}
              <div className="space-y-2">
                <Label htmlFor="tax-code" className="text-sm font-medium text-gray-700">
                  เลขประจำตัวผู้เสียภาษี <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tax-code"
                  value={formData.tax_code}
                  onChange={(e) => handleInputChange('tax_code', e.target.value)}
                  placeholder="0-1234-56789-12-3"
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>

              {/* สำนักงาน/สาขาที่ */}
              <div className="space-y-2">
                <Label htmlFor="tax-branch" className="text-sm font-medium text-gray-700">
                  สำนักงาน/สาขาที่ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tax-branch"
                  value={formData.tax_branch}
                  onChange={(e) => handleInputChange('tax_branch', e.target.value)}
                  placeholder="00000"
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>

              {/* ตำแหน่ง */}
              <div className="space-y-2">
                <Label htmlFor="tax-position" className="text-sm font-medium text-gray-700">
                  ตำแหน่ง
                </Label>
                <Input
                  id="tax-position"
                  value={formData.tax_position}
                  onChange={(e) => handleInputChange('tax_position', e.target.value)}
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* ชื่อผู้เสียภาษี */}
              <div className="space-y-2">
                <Label htmlFor="tax-fullname" className="text-sm font-medium text-gray-700">
                  ชื่อผู้เสียภาษี <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tax-fullname"
                  value={formData.tax_fullname}
                  onChange={(e) => handleInputChange('tax_fullname', e.target.value)}
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>

              {/* ชื่อผู้รับเงิน */}
              <div className="space-y-2">
                <Label htmlFor="tax-payee-name" className="text-sm font-medium text-gray-700">
                  ชื่อผู้รับเงิน <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tax-payee-name"
                  value={formData.tax_payee_name}
                  onChange={(e) => handleInputChange('tax_payee_name', e.target.value)}
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>

              {/* ประเทศ */}
              <div className="space-y-2">
                <Label htmlFor="tax-country" className="text-sm font-medium text-gray-700">
                  ประเทศ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tax-country"
                  value={formData.tax_country}
                  onChange={(e) => handleInputChange('tax_country', e.target.value)}
                  placeholder="ระบุประเทศ"
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ข้อมูลที่อยู่ */}
        <div className="mb-10">
          {/* ที่อยู่ - Full width */}
          <div className="mb-6 space-y-2">
            <Label htmlFor="tax-address" className="text-sm font-medium text-gray-700">
              ที่อยู่ผู้เสียภาษีสำหรับใบเสร็จ <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="tax-address"
              value={formData.tax_address}
              onChange={(e) => handleInputChange('tax_address', e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: colors.input.background }}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-5">
              {/* จังหวัด */}
              <div className="space-y-2">
                <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                  จังหวัด <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  placeholder="ระบุจังหวัด"
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>

              {/* แขวง/ตำบล */}
              <div className="space-y-2">
                <Label htmlFor="sub-district" className="text-sm font-medium text-gray-700">
                  แขวง/ตำบล <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sub-district"
                  value={formData.sub_district}
                  onChange={(e) => handleInputChange('sub_district', e.target.value)}
                  placeholder="ระบุแขวง/ตำบล"
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* เขต/อำเภอ */}
              <div className="space-y-2">
                <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                  เขต/อำเภอ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="ระบุเขต/อำเภอ"
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>

              {/* รหัสไปรษณีย์ */}
              <div className="space-y-2">
                <Label htmlFor="post-code" className="text-sm font-medium text-gray-700">
                  รหัสไปรษณีย์ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="post-code"
                  value={formData.post_code}
                  onChange={(e) => handleInputChange('post_code', e.target.value)}
                  placeholder="10000"
                  maxLength={5}
                  className="h-11 w-full border-gray-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ backgroundColor: colors.input.background }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* หมายเหตุและไฟล์แนบ */}
        <div className="mb-8">
          {/* หมายเหตุ - Full width */}
          <div className="mb-8 space-y-2">
            <Label htmlFor="tax-note" className="text-sm font-medium text-gray-700">
              หมายเหตุ
            </Label>
            <textarea
              id="tax-note"
              value={formData.tax_note}
              onChange={(e) => handleInputChange('tax_note', e.target.value)}
              rows={3}
              placeholder="ข้อมูลเพิ่มเติม (ถ้ามี)"
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: colors.input.background }}
            />
          </div>

          {/* Upload Sections */}
          <div className="grid grid-cols-2 gap-8">
            {/* ภาพ Logo */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">ภาพ Logo</Label>
              <button
                onClick={() => handleFileUpload('tax_logo')}
                className="flex h-10 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-500 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
                style={{ backgroundColor: colors.input.background }}
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {'เลือกไฟล์ Logo'}
              </button>
              {/* Preview logo image */}
              {files.tax_logo && (
                <div className="mt-2">
                  <Image
                    src={
                      typeof files.tax_logo === 'string'
                        ? files.tax_logo
                        : URL.createObjectURL(files.tax_logo)
                    }
                    alt="logo preview"
                    width={96}
                    height={96}
                    className="mx-auto max-h-24 rounded border border-gray-200"
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* ภาพลายเซ็น */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">ภาพลายเซ็น</Label>
              <button
                onClick={() => handleFileUpload('tax_signature')}
                className="flex h-10 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-500 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
                style={{ backgroundColor: colors.input.background }}
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {'เลือกไฟล์ลายเซ็น'}
              </button>
              {/* Preview signature image */}
              {files.tax_signature && (
                <div className="mt-2">
                  <Image
                    src={
                      typeof files.tax_signature === 'string'
                        ? files.tax_signature
                        : URL.createObjectURL(files.tax_signature)
                    }
                    alt="signature preview"
                    width={96}
                    height={96}
                    className="mx-auto max-h-24 rounded border border-gray-200"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreview}
            className="flex h-10 items-center border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview
          </Button>

          {hasExistingData ? (
            <Button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || updateMutation.isPending}
              className="h-10 rounded-lg px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: hasChanges ? colors.primary[500] : colors.neutral[400],
              }}
            >
              {updateMutation.isPending ? 'กำลังอัปเดต...' : 'UPDATE'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="h-10 rounded-lg px-8 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: colors.primary[500] }}
            >
              {updateMutation.isPending ? 'กำลังสร้าง...' : 'CREATE'}
            </Button>
          )}
        </div>
      </div>

      {/* Receipt Preview Dialog */}
      <ReceiptPreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={formData}
        files={files}
        teamId={teamId}
      />
    </div>
  )
}
