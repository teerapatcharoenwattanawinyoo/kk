'use client'

import FetchLoader from '@/components/FetchLoader'
import { useTaxInformation, useTaxInvoiceReceipt } from '@/hooks/use-tax'
import { colors } from '@/lib/utils/colors'
import { Button } from '@/ui'
import { useState } from 'react'
import { ReceiptNoVat } from './receipt-no-vat'
import { ReceiptVat } from './receipt-vat'

interface ReceiptPreviewDialogProps {
  isOpen: boolean
  onClose: () => void
  formData: {
    tax_position?: string
    tax_payee_name?: string
    tax_code?: string
    tax_branch?: string
    tax_note?: string
    tax_address?: string
    sub_district?: string
    district?: string
    province?: string
    post_code?: string
  }
  files: {
    tax_logo: File | string | null
    tax_signature: File | string | null
  }
  teamId: string
}

export const ReceiptPreviewDialog = ({
  isOpen,
  onClose,
  formData,
  files,
  teamId,
}: ReceiptPreviewDialogProps) => {
  const [receiptType, setReceiptType] = useState<'vat' | 'no-vat'>('vat')

  // API hooks
  const {
    data: taxInvoiceReceiptData,
    isLoading: isLoadingReceipt,
    error: receiptError,
  } = useTaxInvoiceReceipt(teamId)
  const {
    data: taxInformationData,
    isLoading: isLoadingTax,
    error: taxError,
  } = useTaxInformation(teamId)

  const isLoading = isLoadingReceipt || isLoadingTax
  const hasError = receiptError || taxError

  if (!isOpen) return null

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="flex max-h-[95vh] max-w-[95vw] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
          <div className="flex h-96 items-center justify-center">
            <FetchLoader />
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (hasError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="flex max-h-[95vh] max-w-[95vw] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-red-500">
                <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-600">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
              <Button onClick={onClose} className="mt-4" variant="outline">
                ปิด
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content')
    if (!printContent) return

    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt Print</title>
          <meta charset="utf-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Kanit', sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
            }
            @page { 
              margin: 0; 
              size: A4; 
            }
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 1000)
  }

  const mockReceiptData = {
    companyInfo: {
      name: taxInformationData?.data?.company_name || '-',
      address:
        `${taxInformationData?.data?.address || '-'} ${taxInformationData?.data?.sub_district || '-'} ${taxInformationData?.data?.district || '-'} ${taxInformationData?.data?.province || '-'} ${taxInformationData?.data?.post_code || '-'}` ||
        '-',
      taxId: taxInformationData?.data?.tax_id || '-',
      logo: files.tax_logo
        ? typeof files.tax_logo === 'string'
          ? files.tax_logo
          : URL.createObjectURL(files.tax_logo)
        : undefined,
    },
    receiptInfo: {
      receiptId: 'RCT2837183919313',
      date: '15/03/2025',
      transactionId: 'CP00370617',
    },
    customer: {
      name:
        `${taxInvoiceReceiptData?.data?.tax_payee_name} (${taxInvoiceReceiptData?.data?.tax_position || formData.tax_position || '-'})` ||
        formData.tax_payee_name ||
        '-',
      taxId: taxInvoiceReceiptData?.data?.tax_code || formData.tax_code || '-',
      address:
        `${taxInvoiceReceiptData?.data?.tax_address || '-'} ${taxInvoiceReceiptData?.data?.sub_district || '-'} ${taxInvoiceReceiptData?.data?.district || '-'} ${taxInvoiceReceiptData?.data?.province || '-'} ${taxInvoiceReceiptData?.data?.post_code || '-'}` ||
        `${formData?.tax_address || '-'} ${formData?.sub_district || '-'} ${formData?.district || '-'} ${formData?.province || '-'} ${formData?.post_code || '-'}` ||
        '-',
      branch: taxInvoiceReceiptData?.data?.tax_branch || formData.tax_branch || '-',
    },
    station: {
      name: 'Apaccharging Station',
    },
    payment: {
      method: 'Wallet',
      date: '01 Jan 2024 19.09 น.',
    },
    items: [
      {
        description: 'ค่าบริการชาร์จรถยนต์ไฟฟ้า',
        quantity: '23.23',
        unit: 'kWh',
        unitPrice: 7.5,
        total: 174.23,
        details: {
          startTime: '01 Jan 2024 19:09 น.',
          endTime: '01 Jan 2024 19:57 น.',
          duration: '48.09 นาที',
        },
      },
    ],
    notes: taxInvoiceReceiptData?.data?.tax_note || formData.tax_note,
    signature: {
      image: files.tax_signature
        ? typeof files.tax_signature === 'string'
          ? files.tax_signature
          : URL.createObjectURL(files.tax_signature)
        : undefined,
      name: taxInvoiceReceiptData?.data?.tax_payee_name || formData.tax_payee_name || '-',
      position: taxInvoiceReceiptData?.data?.tax_position || formData.tax_position || '-',
    },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[95vh] max-w-[95vw] flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="print-hide flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold">Preview Receipt</h2>
          <div className="flex items-center gap-4">
            {/* Receipt Type Toggle */}
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setReceiptType('vat')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  receiptType === 'vat'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                VAT
              </button>
              <button
                onClick={() => setReceiptType('no-vat')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  receiptType === 'no-vat'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                No VAT
              </button>
            </div>

            <Button variant="outline" onClick={onClose} className="text-gray-600">
              Close
            </Button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="print-hide flex-1 overflow-auto bg-gray-100 p-6">
          <div className="flex justify-center">
            <div id="receipt-content">
              {receiptType === 'vat' ? (
                <ReceiptVat
                  receiptData={{
                    ...mockReceiptData,
                    summary: {
                      subtotal: 234.23,
                      vat: 11.4,
                      beforeVat: 162.83,
                      total: 174.23,
                      totalText: 'สองร้อยสามสิบสี่บาทยี่สิบสามสตางค์',
                    },
                  }}
                />
              ) : (
                <ReceiptNoVat
                  receiptData={{
                    ...mockReceiptData,
                    summary: {
                      total: 234.23,
                      totalText: 'สองร้อยสามสิบสี่บาทยี่สิบสามสตางค์',
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="print-hide flex justify-end gap-3 border-t bg-gray-50 p-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handlePrint}
            className="text-white"
            style={{ backgroundColor: colors.primary[500] }}
          >
            Print
          </Button>
        </div>
      </div>
    </div>
  )
}
