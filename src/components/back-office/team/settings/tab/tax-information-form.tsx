'use client'

import FetchLoader from '@/components/FetchLoader'
import {
  useCreateTaxInformation,
  useFileUpload,
  useTaxTypes,
  useUpdateTaxInformation,
} from '@/hooks/use-tax'
import { toast } from '@/hooks/use-toast'
import {
  TaxInformationFormData,
  TaxInformationResponse,
  taxInformationSchema,
} from '@/lib/schemas/tax'
import { colors } from '@/lib/utils/colors'
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

interface TaxInformationFormProps {
  teamId: string
  initialData?: TaxInformationResponse
  isEditMode?: boolean
  onBack: () => void
  onSave: () => void
  onCancel: () => void
}

export const TaxInformationForm = ({
  teamId,
  initialData,
  isEditMode = false,
  onSave,
  onCancel,
}: TaxInformationFormProps) => {
  const { data: taxTypesResponse, isLoading: taxTypesLoading } = useTaxTypes()
  const createTaxMutation = useCreateTaxInformation(teamId)
  const updateTaxMutation = useUpdateTaxInformation(teamId)
  const { handleFileSelect } = useFileUpload()

  const [selectedFiles, setSelectedFiles] = useState({
    file1: null as File | null,
    file2: null as File | null,
    file3: null as File | null,
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<TaxInformationFormData>({
    resolver: zodResolver(taxInformationSchema),
    defaultValues: initialData
      ? {
          selectType: initialData.individual_type_id.toString(),
          name: initialData.name,
          lastname: initialData.last_name,
          companyName: initialData.company_name || '',
          branch: initialData.branch || '',
          taxId: initialData.tax_id,
          country: initialData.country,
          taxInvoiceAddress: initialData.address,
          province: initialData.province,
          district: initialData.district,
          subDistrict: initialData.sub_district,
          postcode: initialData.post_code,
          files: {
            file1: null,
            file2: null,
            file3: null,
          },
        }
      : {
          selectType: '',
          name: '',
          lastname: '',
          companyName: '',
          branch: '',
          taxId: '',
          country: 'thailand',
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
        },
    mode: 'onChange',
  })

  const selectedType = watch('selectType')

  const taxTypes = useMemo(() => {
    return taxTypesResponse?.data || []
  }, [taxTypesResponse])

  useMemo(() => {
    if (taxTypes.length > 0 && !selectedType) {
      setValue('selectType', taxTypes[0].id.toString())
    }
  }, [taxTypes, selectedType, setValue])

  const requiredFiles = useMemo(() => {
    const selectedTaxType = taxTypes.find((type) => type.id.toString() === selectedType)

    if (!selectedTaxType) {
      return []
    }

    const typeName = selectedTaxType.name.toLowerCase()

    if (typeName.includes('บุคคลธรรมดา') && typeName.includes('จดภาษี')) {
      return [
        { key: 'file1', label: 'บัตรประชาชน' },
        { key: 'file2', label: 'กพ 20' },
      ]
    } else if (typeName.includes('บุคคลธรรมดา') && typeName.includes('ไม่จดภาษี')) {
      return [{ key: 'file1', label: 'บัตรประชาชน' }]
    } else if (typeName.includes('นิติบุคคล') && typeName.includes('จดภาษี')) {
      return [
        { key: 'file1', label: 'บัตรประชาชน' },
        { key: 'file2', label: 'หนังสือรับรองบริษัท' },
        { key: 'file3', label: 'กพ 20' },
      ]
    } else if (typeName.includes('นิติบุคคล') && typeName.includes('ไม่จดภาษี')) {
      return [
        { key: 'file1', label: 'หนังสือรับรองบริษัท' },
        { key: 'file2', label: 'บัตรประชาชนกรรมการ' },
      ]
    }

    return []
  }, [taxTypes, selectedType])

  // File handling
  const triggerFileInput = useCallback((fileKey: string) => {
    const input = document.getElementById(`file-input-${fileKey}`) as HTMLInputElement
    input?.click()
  }, [])

  const handleFileInput = useCallback(
    (fileKey: 'file1' | 'file2' | 'file3', e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      handleFileSelect(
        file,
        (validFile) => {
          setSelectedFiles((prev) => ({
            ...prev,
            [fileKey]: validFile,
          }))
          setValue(`files.${fileKey}`, validFile)
          toast({
            title: 'สำเร็จ',
            description: 'อัพโหลดไฟล์เรียบร้อย',
          })
        },
        (errors) => {
          toast({
            title: 'ข้อผิดพลาด',
            description: errors.join(', '),
            variant: 'destructive',
          })
        },
      )
    },
    [handleFileSelect, setValue],
  )

  const handleRemoveFile = useCallback(
    (fileKey: 'file1' | 'file2' | 'file3') => {
      setSelectedFiles((prev) => ({
        ...prev,
        [fileKey]: null,
      }))
      setValue(`files.${fileKey}`, null)

      const input = document.getElementById(`file-input-${fileKey}`) as HTMLInputElement
      if (input) {
        input.value = ''
      }
    },
    [setValue],
  )

  // Reset files when type changes
  useMemo(() => {
    if (selectedType) {
      setSelectedFiles({
        file1: null,
        file2: null,
        file3: null,
      })
      setValue('files.file1', null)
      setValue('files.file2', null)
      setValue('files.file3', null)
    }
  }, [selectedType, setValue])

  // Form submission
  const onSubmit = useCallback(
    async (data: TaxInformationFormData) => {
      try {
        const updatedData = {
          ...data,
          files: selectedFiles,
        }

        if (isEditMode) {
          await updateTaxMutation.mutateAsync(updatedData)
          toast({
            title: 'สำเร็จ',
            description: 'อัปเดตข้อมูลภาษีเรียบร้อย',
          })
        } else {
          await createTaxMutation.mutateAsync(updatedData)
          toast({
            title: 'สำเร็จ',
            description: 'บันทึกข้อมูลภาษีเรียบร้อย',
          })
        }

        onSave()
      } catch {
        toast({
          title: 'ข้อผิดพลาด',
          description: isEditMode ? 'ไม่สามารถอัปเดตข้อมูลได้' : 'ไม่สามารถบันทึกข้อมูลได้',
          variant: 'destructive',
        })
      }
    },
    [selectedFiles, isEditMode, createTaxMutation, updateTaxMutation, onSave],
  )

  const handleCancel = useCallback(() => {
    reset()
    setSelectedFiles({
      file1: null,
      file2: null,
      file3: null,
    })
    onCancel()
  }, [reset, onCancel])

  if (taxTypesLoading) {
    return <FetchLoader />
  }

  return (
    <div className="h-full w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-white">
        <div className="mb-6">
          <h2 className="text-title mb-2 text-lg font-medium">Create Tax</h2>
          <p className="text-muted-blue text-sm">Configure tax invoice settings</p>
        </div>

        <div className="flex gap-6 border-t">
          {/* Left Section - Select Type */}
          <div className="w-1/4">
            <div className="space-y-2 border-b py-8">
              <Label htmlFor="selectType" className="text-sm font-medium text-gray-700">
                Select Type
              </Label>
              <Controller
                name="selectType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={taxTypesLoading}
                  >
                    <SelectTrigger
                      className="w-full"
                      style={{
                        backgroundColor: colors.input?.background || '#f9fafb',
                      }}
                    >
                      <SelectValue placeholder={taxTypesLoading ? 'Loading...' : 'Select Type'} />
                    </SelectTrigger>
                    <SelectContent>
                      {taxTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.selectType && (
                <p className="text-sm text-red-600">{errors.selectType.message}</p>
              )}
            </div>
          </div>

          {/* Right Section - Form Fields */}
          <div className="flex-1 space-y-6 border-l pl-8 pt-8">
            {/* Name */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="name"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <div className="flex-1">
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Specify"
                  className="w-full"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
            </div>

            {/* Lastname */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="lastname"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                Lastname
              </Label>
              <div className="flex-1">
                <Input
                  id="lastname"
                  {...register('lastname')}
                  placeholder="Specify"
                  className="w-full"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.lastname && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="companyName"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                Company Name
              </Label>
              <div className="flex-1">
                <Input
                  id="companyName"
                  {...register('companyName')}
                  placeholder="Specify"
                  className="w-full"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                )}
              </div>
            </div>

            {/* Branch */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="branch"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                Branch
              </Label>
              <div className="flex-1">
                <Input
                  id="branch"
                  {...register('branch')}
                  placeholder="Specify"
                  className="w-full"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-600">{errors.branch.message}</p>
                )}
              </div>
            </div>

            {/* Tax ID */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="taxId"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                TAX ID
              </Label>
              <div className="flex-1">
                <Input
                  id="taxId"
                  {...register('taxId')}
                  placeholder="Specify"
                  className="w-full"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.taxId && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxId.message}</p>
                )}
              </div>
            </div>

            {/* Country */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="country"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                Country
              </Label>
              <div className="flex-1">
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-full"
                        style={{
                          backgroundColor: colors.input?.background || '#f9fafb',
                        }}
                      >
                        <SelectValue placeholder="Specify" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thailand">Thailand</SelectItem>
                        <SelectItem value="singapore">Singapore</SelectItem>
                        <SelectItem value="malaysia">Malaysia</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>

            {/* Tax Invoice Address */}
            <div className="flex gap-4">
              <Label
                htmlFor="taxInvoiceAddress"
                className="w-32 flex-shrink-0 pt-2 text-sm font-medium text-gray-700"
              >
                Tax Invoice Address
              </Label>
              <div className="flex-1">
                <textarea
                  id="taxInvoiceAddress"
                  {...register('taxInvoiceAddress')}
                  placeholder="Specify"
                  rows={3}
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.taxInvoiceAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxInvoiceAddress.message}</p>
                )}
              </div>
            </div>

            {/* Province */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="province"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                Province
              </Label>
              <div className="flex-1">
                <Input
                  id="province"
                  {...register('province')}
                  placeholder="Specify"
                  className="w-full"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.province && (
                  <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
                )}
              </div>
            </div>

            {/* District */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="district"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                District
              </Label>
              <div className="flex-1">
                <Input
                  id="district"
                  {...register('district')}
                  placeholder="Specify"
                  className="w-full"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                )}
              </div>
            </div>

            {/* Sub District */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="subDistrict"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                Sub District
              </Label>
              <div className="flex-1">
                <Input
                  id="subDistrict"
                  {...register('subDistrict')}
                  placeholder="Specify"
                  className="w-full"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.subDistrict && (
                  <p className="mt-1 text-sm text-red-600">{errors.subDistrict.message}</p>
                )}
              </div>
            </div>

            {/* Postcode */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="postcode"
                className="w-32 flex-shrink-0 text-sm font-medium text-gray-700"
              >
                Postcode
              </Label>
              <div className="flex-1">
                <Input
                  id="postcode"
                  {...register('postcode')}
                  placeholder="Specify"
                  className="w-full"
                  style={{
                    backgroundColor: colors.input?.background || '#f9fafb',
                  }}
                />
                {errors.postcode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postcode.message}</p>
                )}
              </div>
            </div>

            {/* File Upload Section */}
            {selectedType && requiredFiles.length > 0 && (
              <div className="space-y-4 rounded-lg border border-gray-200 p-6">
                <div className="flex">
                  <h3 className="w-32 text-sm font-medium text-gray-700">Upload File</h3>
                  <div className="w-full space-y-4">
                    {requiredFiles.map((fileItem: { key: string; label: string }) => (
                      <div key={fileItem.key} className="flex w-full items-center gap-4">
                        <div className="flex items-center gap-3">
                          <input
                            id={`file-input-${fileItem.key}`}
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) =>
                              handleFileInput(fileItem.key as 'file1' | 'file2' | 'file3', e)
                            }
                            className="hidden"
                          />

                          {selectedFiles[fileItem.key as keyof typeof selectedFiles] ? (
                            // Uploaded state
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex w-32 items-center justify-center gap-1 bg-white px-4 py-1 text-xs text-[#0D8A72]"
                            >
                              Uploaded
                            </Button>
                          ) : (
                            // Choose File state
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => triggerFileInput(fileItem.key)}
                              className="flex w-32 items-center justify-center gap-1 bg-black px-4 py-1 text-xs text-white hover:bg-gray-800"
                            >
                              Choose File
                            </Button>
                          )}
                        </div>
                        <div
                          className="flex w-full items-center justify-between rounded-lg border p-3"
                          style={{
                            backgroundColor: selectedFiles[
                              fileItem.key as keyof typeof selectedFiles
                            ]
                              ? colors.primary[500]
                              : 'transparent',
                            color: selectedFiles[fileItem.key as keyof typeof selectedFiles]
                              ? 'white'
                              : 'gray',
                          }}
                        >
                          <span className="text-sm">
                            {selectedFiles[fileItem.key as keyof typeof selectedFiles]
                              ? selectedFiles[fileItem.key as keyof typeof selectedFiles]?.name
                              : fileItem.label}
                          </span>
                          {selectedFiles[fileItem.key as keyof typeof selectedFiles] && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRemoveFile(fileItem.key as 'file1' | 'file2' | 'file3')
                              }
                              className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2"
            disabled={isSubmitting || createTaxMutation.isPending || updateTaxMutation.isPending}
          >
            CANCEL
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 text-white"
            style={{ backgroundColor: colors.primary[500] }}
            disabled={
              !isValid || isSubmitting || createTaxMutation.isPending || updateTaxMutation.isPending
            }
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = colors.primary[600]
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = colors.primary[500]
              }
            }}
          >
            {isSubmitting || createTaxMutation.isPending || updateTaxMutation.isPending
              ? isEditMode
                ? 'กำลังอัปเดต...'
                : 'กำลังบันทึก...'
              : isEditMode
                ? 'UPDATE'
                : 'SAVE'}
          </Button>
        </div>
      </form>
    </div>
  )
}
