import { IResponse } from '@/lib/api/config/model'
import { QUERY_KEYS } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  CreateTaxInformationApiData,
  ITaxType,
  ReceiptTaxInvoiceData,
  TaxInformationFormData,
  TaxInformationResponse,
  TaxInvoiceReceiptData,
  TaxInvoiceReceiptFullData,
  TaxInvoiceReceiptResponse,
  taxInformationSchema,
} from '../_schemas/tax.schema'
import {
  createTaxInformationServerAction,
  createTaxInvoiceReceiptServerAction,
  deleteTaxInformationServerAction,
  deleteTaxInvoiceReceiptServerAction,
  getTaxInformationServerAction,
  getTaxInvoiceReceiptServerAction,
  getTaxTypesServerAction,
  updateTaxInformationServerAction,
  updateTaxInvoiceReceiptServerAction,
} from '../_servers/tax.actions'

// Hook สำหรับดึงรายการประเภทภาษี
export const useTaxTypes = () => {
  return useQuery<IResponse<ITaxType[]>>({
    queryKey: [QUERY_KEYS.TAX_TYPES],
    queryFn: getTaxTypesServerAction,
    staleTime: 5 * 60 * 1000, // 5 นาที
    gcTime: 10 * 60 * 1000, // 10 นาที
    refetchOnWindowFocus: false,
    select: (data) => data, // สามารถ transform data ได้ที่นี่
  })
}

// Hook สำหรับดึงข้อมูลภาษีของทีม
export const useTaxInformation = (teamId?: string) => {
  return useQuery<IResponse<TaxInformationResponse>>({
    queryKey: [QUERY_KEYS.TAX_INFORMATION, teamId],
    queryFn: () => {
      if (!teamId) {
        throw new Error('Team ID is required')
      }
      return getTaxInformationServerAction(teamId)
    },
    enabled: !!teamId, // จะเรียก API เมื่อมี teamId เท่านั้น
    staleTime: 2 * 60 * 1000, // 2 นาที
    gcTime: 5 * 60 * 1000, // 5 นาที
    refetchOnWindowFocus: false,
    retry: (
      failureCount,
      error: Error & {
        response?: {
          status?: number
        }
      },
    ) => {
      // ถ้าเป็น 404 (ยังไม่มีข้อมูลภาษี) ไม่ต้อง retry
      if (error?.response?.status === 404) {
        return false
      }
      return failureCount < 3
    },
    select: (data) => data, // สามารถ transform data ได้ที่นี่
  })
}

// Hook สำหรับสร้างข้อมูลภาษี
export const useCreateTaxInformation = (teamId?: string) => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, TaxInformationFormData>({
    mutationFn: async (formData: TaxInformationFormData) => {
      // Validate ข้อมูลก่อนส่ง
      const validation = taxInformationSchema.safeParse(formData)
      if (!validation.success) {
        throw new Error(`Validation failed: ${validation.error.message}`)
      }

      if (!teamId) {
        throw new Error('Team ID is required')
      }

      const apiData: CreateTaxInformationApiData = {
        name: formData.name,
        last_name: formData.lastname,
        company_name: formData.companyName || '',
        branch: formData.branch || '',
        tax_id: formData.taxId,
        country: formData.country,
        address: formData.taxInvoiceAddress,
        province: formData.province,
        district: formData.district,
        sub_district: formData.subDistrict,
        post_code: formData.postcode,
        individual_type_id: parseInt(formData.selectType),
        team_group_id: parseInt(teamId),
        file_twenty: formData.files?.file2 || undefined,
        file_certificate: formData.files?.file3 || undefined,
        file_id_card: formData.files?.file1 || undefined,
      }

      return createTaxInformationServerAction(apiData)
    },
    onSuccess: (data) => {
      // อัพเดต cache หรือ invalidate queries ที่เกี่ยวข้อง
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAX_INFORMATION],
      })
    },
    onError: (error) => {
      console.error('Error creating tax information:', error)
    },
  })
}

// Hook สำหรับจัดการ form state และ validation
export const useTaxForm = (initialData?: Partial<TaxInformationFormData>) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<TaxInformationFormData>({
    resolver: zodResolver(taxInformationSchema),
    defaultValues: {
      selectType: '',
      name: '',
      lastname: '',
      companyName: '',
      branch: '',
      taxId: '',
      country: '',
      taxInvoiceAddress: '',
      province: '',
      district: '',
      subDistrict: '',
      postcode: '',
      files: {
        file1: null,
        file2: null,
        file3: null,
      },
      ...initialData,
    },
    mode: 'onChange', // Validate on change
  })

  const selectedType = watch('selectType')

  const resetFiles = useCallback(() => {
    setValue('files.file1', null)
    setValue('files.file2', null)
    setValue('files.file3', null)
  }, [setValue])

  // Reset files เมื่อเปลี่ยนประเภท
  useEffect(() => {
    if (selectedType) {
      resetFiles()
    }
  }, [selectedType, resetFiles])

  // Function สำหรับ validate field เฉพาะ
  const validateField = useCallback(
    async (fieldName: keyof TaxInformationFormData) => {
      return trigger(fieldName)
    },
    [trigger],
  )

  // Function สำหรับ set file
  const setFile = useCallback(
    (fileKey: 'file1' | 'file2' | 'file3', file: File | null) => {
      setValue(`files.${fileKey}`, file)
      trigger(`files.${fileKey}`)
    },
    [setValue, trigger],
  )

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    watch,
    setValue,
    reset,
    validateField,
    setFile,
    resetFiles,
    selectedType,
  }
}

// Hook สำหรับ file upload validation
export const useFileUpload = () => {
  const validateFile = useCallback((file: File): string[] => {
    const errors: string[] = []

    // ตรวจสอบขนาดไฟล์
    if (file.size > 5 * 1024 * 1024) {
      errors.push('ขนาดไฟล์ต้องไม่เกิน 5MB')
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      errors.push('รองรับเฉพาะไฟล์ JPG, PNG, PDF เท่านั้น')
    }

    return errors
  }, [])

  const handleFileSelect = useCallback(
    (file: File | null, onSuccess: (file: File) => void, onError: (errors: string[]) => void) => {
      if (!file) return

      const errors = validateFile(file)
      if (errors.length > 0) {
        onError(errors)
        return
      }

      onSuccess(file)
    },
    [validateFile],
  )

  return {
    validateFile,
    handleFileSelect,
  }
}

// Hook สำหรับอัพเดทข้อมูลภาษี
export const useUpdateTaxInformation = (teamId?: string) => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, TaxInformationFormData>({
    mutationFn: async (formData: TaxInformationFormData) => {
      // Validate ข้อมูลก่อนส่ง
      const validation = taxInformationSchema.safeParse(formData)
      if (!validation.success) {
        throw new Error(`Validation failed: ${validation.error.message}`)
      }

      if (!teamId) {
        throw new Error('Team ID is required')
      }

      const apiData: CreateTaxInformationApiData = {
        name: formData.name,
        last_name: formData.lastname,
        company_name: formData.companyName || '',
        branch: formData.branch || '',
        tax_id: formData.taxId,
        country: formData.country,
        address: formData.taxInvoiceAddress,
        province: formData.province,
        district: formData.district,
        sub_district: formData.subDistrict,
        post_code: formData.postcode,
        individual_type_id: parseInt(formData.selectType),
        team_group_id: parseInt(teamId),
        file_twenty: formData.files?.file2 || undefined,
        file_certificate: formData.files?.file3 || undefined,
        file_id_card: formData.files?.file1 || undefined,
      }

      return updateTaxInformationServerAction(teamId, apiData)
    },
    onSuccess: (data) => {
      // อัพเดต cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAX_INFORMATION, teamId],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAX_INFORMATION],
      })
    },
    onError: (error) => {
      console.error('Error updating tax information:', error)
    },
  })
}

// Hook สำหรับลบข้อมูลภาษี
export const useDeleteTaxInformation = (teamId?: string) => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, string>({
    mutationFn: async (taxId: string) => {
      if (!taxId) {
        throw new Error('Tax ID is required')
      }

      return deleteTaxInformationServerAction(taxId)
    },
    onSuccess: (data) => {
      // ลบข้อมูลออกจาก cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAX_INFORMATION, teamId],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAX_INFORMATION],
      })
    },
    onError: (error) => {
      console.error('Error deleting tax information:', error)
    },
  })
}

// Hook สำหรับดึงข้อมูล TaxInvoiceReceipt รวม
export const useTaxInvoiceReceipt = (teamId?: string) => {
  return useQuery<IResponse<TaxInvoiceReceiptResponse>>({
    queryKey: [QUERY_KEYS.INVOICE_PREFIX, teamId],
    queryFn: () => {
      if (!teamId) {
        throw new Error('Team ID is required')
      }
      return getTaxInvoiceReceiptServerAction(teamId)
    },
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000, // 2 นาที
    gcTime: 5 * 60 * 1000, // 5 นาที
    refetchOnWindowFocus: false,
    retry: (
      failureCount,
      error: Error & {
        response?: {
          status?: number
        }
      },
    ) => {
      // ถ้าเป็น 404 หรือ 204 (ยังไม่มีข้อมูล) ไม่ต้อง retry
      if (error?.response?.status === 404 || error?.response?.status === 204) {
        return false
      }
      return failureCount < 3
    },
    select: (data) => data,
  })
}

// Hook สำหรับอัพเดทเฉพาะส่วน invoice-number-prefix
export const useUpdateInvoiceNumberPrefix = (teamId?: string) => {
  const queryClient = useQueryClient()

  // ดึงข้อมูลปัจจุบันเพื่อ merge
  const { data: currentData } = useTaxInvoiceReceipt(teamId)

  return useMutation<IResponse, Error, TaxInvoiceReceiptData>({
    mutationFn: async (prefixData: TaxInvoiceReceiptData) => {
      if (!teamId) {
        throw new Error('Team ID is required')
      }

      // Merge กับข้อมูลปัจจุบัน
      const fullData: TaxInvoiceReceiptFullData = {
        // ข้อมูลใหม่จาก invoice-number-prefix tab
        ...prefixData,
        team_group_id: teamId,

        // ข้อมูลเดิมจาก receipt-tax-invoice tab (ถ้ามี)
        tax_title: currentData?.data?.tax_title || 'ใบเสร็จรับเงิน',
        tax_code: currentData?.data?.tax_code || null,
        tax_fullname: currentData?.data?.tax_fullname || null,
        tax_branch: currentData?.data?.tax_branch || null,
        tax_payee_name: currentData?.data?.tax_payee_name || null,
        tax_position: currentData?.data?.tax_position || null,
        tax_country: currentData?.data?.tax_country || null,
        tax_address: currentData?.data?.tax_address || null,
        province: currentData?.data?.province || null,
        district: currentData?.data?.district || null,
        sub_district: currentData?.data?.sub_district || null,
        post_code: currentData?.data?.post_code || null,
        tax_note: currentData?.data?.tax_note || null,
        tax_logo: currentData?.data?.tax_logo || null,
        tax_signature: currentData?.data?.tax_signature || null,
      }

      if (currentData?.data?.id) {
        // Update existing
        return updateTaxInvoiceReceiptServerAction(teamId, fullData)
      } else {
        // Create new
        return createTaxInvoiceReceiptServerAction(fullData)
      }
    },
    onSuccess: (data) => {
      // อัพเดต cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVOICE_PREFIX, teamId],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVOICE_PREFIX],
      })
    },
    onError: (error) => {
      console.error('Error updating invoice number prefix:', error)
    },
  })
}

// Hook สำหรับอัพเดทเฉพาะส่วน receipt-tax-invoice
export const useUpdateReceiptTaxInvoice = (teamId?: string) => {
  const queryClient = useQueryClient()

  // ดึงข้อมูลปัจจุบันเพื่อ merge
  const { data: currentData } = useTaxInvoiceReceipt(teamId)

  return useMutation<IResponse, Error, ReceiptTaxInvoiceData>({
    mutationFn: async (receiptData: ReceiptTaxInvoiceData) => {
      if (!teamId) {
        throw new Error('Team ID is required')
      }

      // Merge กับข้อมูลปัจจุบัน
      const fullData: TaxInvoiceReceiptFullData = {
        // ข้อมูลเดิมจาก invoice-number-prefix tab (หรือ default)
        format_document: currentData?.data?.format_document || 1,
        header_document: currentData?.data?.header_document || 'INV',
        center_document: currentData?.data?.center_document || '',
        end_document: currentData?.data?.end_document || '000001',
        status_document: currentData?.data?.status_document || 1,
        team_group_id: teamId,

        // ข้อมูลใหม่จาก receipt-tax-invoice tab
        ...receiptData,
      }

      if (currentData?.data?.id) {
        // Update existing
        return updateTaxInvoiceReceiptServerAction(teamId, fullData)
      } else {
        // Create new
        return createTaxInvoiceReceiptServerAction(fullData)
      }
    },
    onSuccess: (data) => {
      // อัพเดต cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVOICE_PREFIX, teamId],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVOICE_PREFIX],
      })
    },
    onError: (error) => {
      console.error('Error updating receipt tax invoice:', error)
    },
  })
}

// Legacy hooks สำหรับ backward compatibility
export const useCreateTaxInvoiceReceipt = (teamId?: string) => {
  return useUpdateInvoiceNumberPrefix(teamId)
}

export const useUpdateTaxInvoiceReceipt = (teamId?: string) => {
  return useUpdateInvoiceNumberPrefix(teamId)
}

// Hook สำหรับลบ TaxInvoiceReceipt
export const useDeleteTaxInvoiceReceipt = (teamId?: string) => {
  const queryClient = useQueryClient()

  return useMutation<IResponse, Error, string>({
    mutationFn: async (id: string) => {
      if (!id) {
        throw new Error('ID is required')
      }

      return deleteTaxInvoiceReceiptServerAction(id)
    },
    onSuccess: (data) => {
      // อัพเดต cache
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVOICE_PREFIX, teamId],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVOICE_PREFIX],
      })
    },
    onError: (error) => {
      console.error('Error deleting TaxInvoiceReceipt:', error)
    },
  })
}
