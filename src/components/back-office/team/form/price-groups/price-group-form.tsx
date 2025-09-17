'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { ChevronLeft, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

// Types
export type PriceType = 'PER_KWH' | 'PER_MINUTE' | 'PEAK' | 'free'
export type StatusType = 'GENERAL' | 'MEMBER'
export type Mode = 'add' | 'edit'

export interface FormData {
  groupName: string
  status: string
}

export interface PriceFormData {
  pricePerKwh: string
  pricePerKwhMinute: string
  price_per_minute: string
  onPeakPrice: string
  offPeakPrice: string
  freeKw: string
  freeKwh: string
}

export interface FeeFormData {
  startingFeeDescription: string
  fee: string
  chargingFeeDescription: string
  feePrice: string
  applyAfterMinute: string
  minuteFeeDescription: string
  feePerMin: string
  applyFeeAfterMinute: string
  feeStopsAfterMinute: string
  idleFeeDescription: string
  feePerMinIdle: string
  timeBeforeIdleFeeApplied: string
  maxTotalIdleFee: string
}

export interface PriceGroupFormProps {
  mode: Mode
  statusType: StatusType
  initialData?: {
    form?: Partial<FormData>
    priceForm?: Partial<PriceFormData>
    feeForm?: Partial<FeeFormData>
    priceType?: PriceType
  }
  isLoading?: boolean
  onSubmit: (data: {
    form: FormData
    priceForm: PriceFormData
    feeForm: FeeFormData
    priceType: PriceType
  }) => Promise<void>
  onBack: () => void
  teamGroupId?: string | null
}

export default function PriceGroupForm({
  mode,
  statusType,
  initialData,
  isLoading = false,
  onSubmit,
  onBack,
  teamGroupId,
}: PriceGroupFormProps) {
  const [priceType, setPriceType] = useState<PriceType>(initialData?.priceType || 'PER_KWH')

  // Main form state
  const [form, setForm] = useState<FormData>({
    groupName: initialData?.form?.groupName || '',
    status: initialData?.form?.status || 'publish',
  })

  // Price-specific form state
  const [priceForm, setPriceForm] = useState<PriceFormData>({
    pricePerKwh: initialData?.priceForm?.pricePerKwh || '',
    pricePerKwhMinute: initialData?.priceForm?.pricePerKwhMinute || '',
    price_per_minute: initialData?.priceForm?.price_per_minute || '',
    onPeakPrice: initialData?.priceForm?.onPeakPrice || '',
    offPeakPrice: initialData?.priceForm?.offPeakPrice || '',
    freeKw: initialData?.priceForm?.freeKw || '',
    freeKwh: initialData?.priceForm?.freeKwh || '',
  })

  // Fee form state
  const [feeForm, setFeeForm] = useState<FeeFormData>({
    fee: initialData?.feeForm?.fee || '',
    startingFeeDescription: initialData?.feeForm?.startingFeeDescription || '',
    chargingFeeDescription: initialData?.feeForm?.chargingFeeDescription || '',
    feePrice: initialData?.feeForm?.feePrice || '',
    applyAfterMinute: initialData?.feeForm?.applyAfterMinute || '',
    minuteFeeDescription: initialData?.feeForm?.minuteFeeDescription || '',
    feePerMin: initialData?.feeForm?.feePerMin || '',
    applyFeeAfterMinute: initialData?.feeForm?.applyFeeAfterMinute || '',
    feeStopsAfterMinute: initialData?.feeForm?.feeStopsAfterMinute || '',
    idleFeeDescription: initialData?.feeForm?.idleFeeDescription || '',
    feePerMinIdle: initialData?.feeForm?.feePerMinIdle || '',
    timeBeforeIdleFeeApplied: initialData?.feeForm?.timeBeforeIdleFeeApplied || '',
    maxTotalIdleFee: initialData?.feeForm?.maxTotalIdleFee || '',
  })

  // Update form states when initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.form) {
        setForm((prevForm) => ({
          ...prevForm,
          ...initialData.form,
        }))
      }
      if (initialData.priceForm) {
        setPriceForm((prevPriceForm) => ({
          ...prevPriceForm,
          ...initialData.priceForm,
        }))
      }
      if (initialData.feeForm) {
        setFeeForm((prevFeeForm) => ({
          ...prevFeeForm,
          ...initialData.feeForm,
        }))
      }
      if (initialData.priceType) {
        setPriceType(initialData.priceType)
      }
    }
  }, [initialData])

  // Form validation - แยกการตรวจสอบ teamGroupId ออกจาก isFormValid เพื่อให้ user กรอกข้อมูลได้ก่อน
  const isFormValid = form.groupName.trim() !== ''

  console.log('isFormValid calculation:', {
    'form.groupName.trim()': form.groupName.trim(),
    "form.groupName.trim() !== ''": form.groupName.trim() !== '',
    teamGroupId,
    mode,
    isFormValid,
  })

  // Format number to 2 decimal places
  const formatDecimal = (value: string) => {
    let val = value.replace(/[^\d.]/g, '')
    const parts = val.split('.')
    if (parts.length > 2) {
      val = parts[0] + '.' + parts.slice(1).join('')
    }
    if (val.includes('.')) {
      const [intPart, decPart] = val.split('.')
      val = intPart + '.' + decPart.slice(0, 2)
    }
    return val
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatDecimal(e.target.value)
    setPriceForm({ ...priceForm, [e.target.id]: value })
  }

  const handleFeeDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeeForm({ ...feeForm, [e.target.id]: e.target.value })
  }

  const handleFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDescriptionField = e.target.id.toLowerCase().includes('description')
    const value = isDescriptionField ? e.target.value : formatDecimal(e.target.value)
    setFeeForm({ ...feeForm, [e.target.id]: value })
  }

  const handleStatusChange = (value: string) => {
    setForm({ ...form, status: value })
  }

  const handlePriceTypeChange = (value: string) => {
    const newPriceType = value as PriceType
    setPriceType(newPriceType)

    // Reset price form values when switching price types
    setPriceForm({
      pricePerKwh: '',
      pricePerKwhMinute: '',
      price_per_minute: '',
      onPeakPrice: '',
      offPeakPrice: '',
      freeKw: '',
      freeKwh: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== PriceGroupForm handleSubmit called ===')
    console.log('Form values:', { form, priceForm, feeForm, priceType })
    console.log('Validation states:', {
      isFormValid,
      teamGroupId,
      mode,
    })

    if (!isFormValid) {
      console.log('❌ Form validation failed: isFormValid =', isFormValid)
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    // ตรวจสอบ teamGroupId สำหรับ mode add
    if (mode === 'add') {
      console.log('🔍 Checking team data for add mode...')
      if (!teamGroupId) {
        console.log('❌ Team group ID not available:', teamGroupId)
        toast({
          title: 'Error',
          description: 'Team information not loaded. Please try again.',
          variant: 'destructive',
        })
        return
      }
      console.log('✅ Team data validation passed')
    }

    // Validate price type specific fields
    console.log('🔍 Validating price type specific fields for:', priceType)
    const missingFields: string[] = []

    if (priceType === 'PER_KWH') {
      if (!priceForm.pricePerKwh.trim()) {
        missingFields.push('บาท/kWh')
      }
    } else if (priceType === 'PER_MINUTE') {
      if (!priceForm.pricePerKwhMinute.trim()) {
        missingFields.push('บาท/kWh')
      }
      if (!priceForm.price_per_minute.trim()) {
        missingFields.push('/ชั่วโมง')
      }
    } else if (priceType === 'PEAK') {
      if (!priceForm.onPeakPrice.trim()) {
        missingFields.push('On Peak บาท/kWh')
      }
      if (!priceForm.offPeakPrice.trim()) {
        missingFields.push('Off Peak บาท/kWh')
      }
    } else if (priceType === 'free') {
      if (!priceForm.freeKw.trim()) {
        missingFields.push('Free kW')
      }
      if (!priceForm.freeKwh.trim()) {
        missingFields.push('หลังจากชาร์จฟรี บาท/kWh')
      }
    }

    if (missingFields.length > 0) {
      console.log('❌ Missing required price fields:', missingFields)
      toast({
        title: 'Error',
        description: `กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.join(', ')}`,
        variant: 'destructive',
      })
      return
    }

    console.log('✅ All validations passed, calling onSubmit...')
    try {
      await onSubmit({
        form,
        priceForm,
        feeForm,
        priceType,
      })
      console.log('✅ onSubmit completed successfully')
    } catch (error) {
      console.error('❌ Form submission error:', error)
    }
  }

  const getTitle = () => {
    if (mode === 'add') {
      return statusType === 'MEMBER' ? 'Add Member Price Group' : 'Add Price Group'
    }
    return statusType === 'MEMBER' ? 'Edit Member Price Group' : 'Edit Price Group'
  }

  const getFormId = () => {
    if (mode === 'add') {
      return statusType === 'MEMBER' ? 'add-member-price-group-form' : 'add-price-group-form'
    }
    return statusType === 'MEMBER' ? 'edit-member-price-group-form' : 'edit-price-group-form'
  }

  const getButtonText = () => {
    return mode === 'add' ? 'submit' : 'Update'
  }

  const getLoadingText = () => {
    return mode === 'add' ? 'Submitting...' : 'Updating...'
  }

  const getLabelText = () => {
    return statusType === 'MEMBER'
      ? `ชื่อ ${statusType === 'MEMBER' ? 'Member ' : ''}Price Group`
      : 'ชื่อ Price Group'
  }

  return (
    <div className="p-3 md:p-6">
      <div className="max-w-640 bg-sidebar mx-auto flex w-full flex-col rounded-lg md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={onBack}
              className="h-7 w-7 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </Button>
            <h1 className="text-title text-xl font-medium md:text-2xl">{getTitle()}</h1>
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            form={getFormId()}
            variant={'success'}
            size="sm"
            disabled={isLoading || !isFormValid}
            className={`w-40 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-light uppercase">{getLoadingText()}</span>
              </div>
            ) : (
              <p className="text-sm font-medium uppercase">{getButtonText()}</p>
            )}
          </Button>
        </div>

        {/* Form */}
        <form id={getFormId()} onSubmit={handleSubmit}>
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Left Column - Form inputs */}
                <div
                  className="flex flex-1 flex-col gap-6 border-b pb-6 pt-6 md:pb-0 md:pt-8 lg:w-1/4 lg:flex-none lg:border-b-0 lg:border-r lg:pr-8"
                  style={{ minHeight: 'max(300px, 100%)' }}
                >
                  <div>
                    <Label htmlFor="groupName" className="text-title text-sm font-semibold">
                      {getLabelText()} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="groupName"
                      value={form.groupName}
                      onChange={handleInputChange}
                      placeholder="โปรดระบุ"
                      className="text-title mt-2 border-none bg-[#F2F2F2] placeholder:text-[#CACACA]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-title text-sm font-semibold">
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.status}
                      onValueChange={handleStatusChange}
                      defaultValue="publish"
                    >
                      <SelectTrigger
                        className={`mt-2 border-none bg-[#F2F2F2] ${
                          form.status ? 'text-[#CACACA]' : 'text-title'
                        }`}
                      >
                        <SelectValue placeholder="Publish" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="publish">Publish</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column - Form inputs */}
                <div className="flex-1 space-y-6 px-4 pb-6 pt-6 md:px-4 md:pb-8 md:pt-8 lg:w-3/4 lg:pl-8 lg:pr-0">
                  {/* Price Type Selection */}
                  <div>
                    <Label className="text-title text-base font-semibold">
                      การตั้งรูปแบบราคา <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-3 flex flex-wrap gap-3 rounded-lg bg-[#355FF5] p-4">
                      <RadioGroup
                        value={priceType}
                        onValueChange={handlePriceTypeChange}
                        className="flex w-full flex-wrap gap-6"
                      >
                        <div
                          className={`flex items-center space-x-2 rounded-xl px-6 py-3 transition-colors ${
                            priceType === 'PER_KWH'
                              ? 'bg-white/20 text-white'
                              : 'bg-[#2B58F7] text-white'
                          }`}
                        >
                          <RadioGroupItem
                            value="PER_KWH"
                            id="radio-kwh"
                            className={`${
                              priceType === 'PER_KWH'
                                ? 'border-2 border-white text-white'
                                : 'border-2 border-white/20'
                            }`}
                          />
                          <Label
                            className={`cursor-pointer ${
                              priceType === 'PER_KWH' ? 'text-card' : 'text-white'
                            }`}
                          >
                            บาท/kWh
                          </Label>
                        </div>
                        <div
                          className={`flex items-center space-x-2 rounded-xl px-6 py-3 transition-colors ${
                            priceType === 'PER_MINUTE'
                              ? 'bg-white/20 text-white'
                              : 'bg-[#2B58F7] text-white'
                          }`}
                        >
                          <RadioGroupItem
                            value="PER_MINUTE"
                            id="radio-hrs"
                            className={`${
                              priceType === 'PER_MINUTE'
                                ? 'border-2 border-white text-white'
                                : 'border-2 border-white/20'
                            }`}
                          />
                          <Label
                            htmlFor="radio-hrs"
                            className={`cursor-pointer ${
                              priceType === 'PER_MINUTE' ? 'text-white' : 'text-white'
                            }`}
                          >
                            ฿/Hrs.
                          </Label>
                        </div>
                        <div
                          className={`flex items-center space-x-2 rounded-xl px-6 py-3 transition-colors ${
                            priceType === 'PEAK'
                              ? 'bg-white/20 font-semibold text-white'
                              : 'bg-[#2B58F7] text-white'
                          }`}
                        >
                          <RadioGroupItem
                            value="PEAK"
                            id="radio-onpeak"
                            className={`${
                              priceType === 'PEAK'
                                ? 'border-2 border-white text-white'
                                : 'border-2 border-white/20'
                            }`}
                          />
                          <Label
                            htmlFor="radio-onpeak"
                            className={`cursor-pointer ${
                              priceType === 'PEAK' ? 'text-white' : 'text-white'
                            }`}
                          >
                            On Peak Off Peak
                          </Label>
                        </div>
                        <div
                          className={`flex items-center space-x-2 rounded-xl px-6 py-3 transition-colors ${
                            priceType === 'free'
                              ? 'bg-white/20 text-[#4361ee]'
                              : 'bg-[#2B58F7] text-white'
                          }`}
                        >
                          <RadioGroupItem
                            value="free"
                            id="radio-free"
                            className={`${
                              priceType === 'free'
                                ? 'border-2 border-white text-white'
                                : 'border-2 border-white/20'
                            }`}
                          />
                          <Label
                            htmlFor="radio-free"
                            className={`cursor-pointer ${
                              priceType === 'free' ? 'text-white' : 'text-white'
                            }`}
                          >
                            Free Charge Promotion
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Price Input Sections */}
                  {priceType === 'PER_KWH' && (
                    <div className="mt-4 rounded-xl border p-6">
                      <Label htmlFor="price" className="text-title font-medium">
                        บาท/kWh <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative mt-2 w-1/2">
                        <Input
                          id="pricePerKwh"
                          placeholder="ระบุ"
                          className="pr-8"
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step="0.01"
                          value={priceForm.pricePerKwh}
                          onChange={handlePriceInputChange}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b9c6]">
                          ฿
                        </span>
                      </div>
                    </div>
                  )}

                  {priceType === 'PER_MINUTE' && (
                    <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border p-6">
                      <div>
                        <Label htmlFor="price-kwh" className="text-title font-medium">
                          บาท/kWh <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative mt-2">
                          <Input
                            id="pricePerKwhMinute"
                            placeholder="ระบุ"
                            className="pr-8"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="0.01"
                            value={priceForm.pricePerKwhMinute}
                            onChange={handlePriceInputChange}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b9c6]">
                            ฿
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="price_per_minute" className="text-title font-medium">
                          /ชั่วโมง <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative mt-2">
                          <Input
                            id="price_per_minute"
                            placeholder="ระบุ"
                            className="pr-12"
                            type="number"
                            inputMode="decimal"
                            min={0}
                            step="0.01"
                            value={priceForm.price_per_minute}
                            onChange={handlePriceInputChange}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b9c6]">
                            Hrs.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {priceType === 'PEAK' && (
                    <div className="mt-4 flex flex-col gap-4">
                      <div className="grid grid-cols-1 overflow-hidden rounded-xl border md:grid-cols-10 md:divide-x">
                        {/* Left Labels */}
                        <div className="flex flex-col divide-y md:col-span-2 md:justify-center">
                          <div className="flex h-28 items-center justify-center px-4">
                            <span className="text-title font-semibold">On Peak</span>
                          </div>
                          <div className="flex h-28 items-center justify-center px-4">
                            <span className="text-title font-semibold">Off Peak</span>
                          </div>
                        </div>

                        {/* Price Inputs */}
                        <div className="flex flex-col divide-y md:col-span-4">
                          <div className="px-4 py-6">
                            <Label htmlFor="onPeakPrice" className="text-title font-medium">
                              บาท/kWh <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative mt-2">
                              <Input
                                id="onPeakPrice"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                placeholder="ระบุ"
                                className="pr-8"
                                value={priceForm.onPeakPrice}
                                onChange={handlePriceInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b9c6]">
                                ฿
                              </span>
                            </div>
                          </div>
                          <div className="px-4 py-6">
                            <Label htmlFor="offPeakPrice" className="text-title font-medium">
                              บาท/kWh <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative mt-2">
                              <Input
                                id="offPeakPrice"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                placeholder="ระบุ"
                                className="pr-8"
                                value={priceForm.offPeakPrice}
                                onChange={handlePriceInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b9c6]">
                                ฿
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Info Box */}
                        <div className="flex flex-col justify-center p-4 md:col-span-4">
                          <div className="dark:bg-primary/7 mx-4 flex items-start gap-2 rounded-lg bg-[#EDF1FF] p-3 text-xs text-[#355FF5] dark:border dark:border-primary dark:text-primary">
                            <div className="text-prim flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-3 w-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                />
                              </svg>
                            </div>
                            <div className="leading-tight">
                              <p className="mb-1">
                                อัตราค่าไฟฟ้า TOU ปัจจุบัน คือ อัตราการจัดเก็บค่าไฟฟ้า
                                ที่ขึ้นอยู่กับช่วงเวลาการใช้ โดยแบ่งออกเป็น 2 ช่วง คือ
                              </p>
                              <div className="grid grid-cols-1 gap-x-3 gap-y-0.5">
                                <div className="flex items-baseline gap-1">
                                  <span className="whitespace-nowrap font-semibold">
                                    On Peak: จันทร์–ศุกร์ 09:00–22:00 น.
                                  </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span className="whitespace-nowrap font-semibold">
                                    Off Peak: จันทร์–ศุกร์ 22:00–09:00 น.
                                  </span>
                                </div>
                                <div className="mt-0.5">
                                  <span className="whitespace-nowrap font-semibold">
                                    และวันเสาร์–อาทิตย์/วันหยุดราชการทั้งวัน
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {priceType === 'free' && (
                    <div className="mt-4 overflow-hidden rounded-xl border">
                      <div className="grid grid-cols-5 border-b">
                        <div className="col-span-1 flex items-center justify-center border-r p-4">
                          <span className="text-title font-medium">Free</span>
                        </div>
                        <div className="col-span-4 p-4">
                          <Label htmlFor="freeKw" className="text-title mb-2 block font-medium">
                            kW <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative mt-2">
                            <Input
                              id="freeKw"
                              placeholder="ระบุ"
                              className="pr-10"
                              type="number"
                              min={0}
                              value={priceForm.freeKw}
                              onChange={handlePriceInputChange}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                              kW
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-5">
                        <div className="col-span-1 flex items-center justify-center border-r p-4">
                          <span className="text-title text-base font-medium">หลังจากชาร์จฟรี</span>
                        </div>
                        <div className="col-span-4 p-4">
                          <Label htmlFor="freeKwh" className="text-title mb-2 block font-medium">
                            บาท/kWh <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative mt-2">
                            <Input
                              id="freeKwh"
                              placeholder="ระบุ"
                              className="pr-8"
                              type="number"
                              inputMode="decimal"
                              min={0}
                              step="0.01"
                              value={priceForm.freeKwh}
                              onChange={handlePriceInputChange}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                              ฿
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Fee Section */}
                  {false && (
                    <div>
                      <div className="text-title mb-2 text-base font-semibold">Additional Fee</div>

                      {/* Starting Fee */}
                      <div className="mb-6 rounded-xl border bg-white p-6">
                        <div className="text-title font-medium">Starting fee</div>
                        <div className="mb-2 text-xs text-[#8a94a6]">
                          A one-time fee will be applied when starting the charge session.
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label htmlFor="startingFeeDescription" className="text-title text-xs">
                              Description
                            </Label>
                            <Input
                              id="startingFeeDescription"
                              placeholder="ระบุ"
                              className="mt-1"
                              value={feeForm.startingFeeDescription}
                              onChange={handleFeeDescriptionChange}
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="fee" className="text-title text-xs">
                              Fee
                            </Label>
                            <div className="relative">
                              <Input
                                id="fee"
                                placeholder="ระบุ"
                                className="mt-1"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={feeForm.fee}
                                onChange={handleFeeInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                                ฿
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Charging Fee */}
                      <div className="rounded-xl border bg-card p-6">
                        <div className="text-title font-medium">Charging fee</div>
                        <div className="mb-2 text-xs text-[#8a94a6]">
                          A one-time fee to be applied after a specified time of charging.
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label htmlFor="chargingFeeDescription" className="text-title text-xs">
                              Description
                            </Label>
                            <Input
                              id="chargingFeeDescription"
                              placeholder="ระบุ"
                              className="mt-1"
                              value={feeForm.chargingFeeDescription}
                              onChange={handleFeeDescriptionChange}
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="feePrice" className="text-title text-xs">
                              Fee price
                            </Label>
                            <div className="relative">
                              <Input
                                id="feePrice"
                                placeholder="0"
                                className="mt-1"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={feeForm.feePrice}
                                onChange={handleFeeInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                                ฿
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-4">
                          <div className="flex-1">
                            <Label htmlFor="applyAfterMinute" className="text-title text-xs">
                              Apply fee after
                            </Label>
                            <div className="relative">
                              <Input
                                id="applyAfterMinute"
                                placeholder="0"
                                className="mt-1"
                                type="number"
                                min={0}
                                value={feeForm.applyAfterMinute}
                                onChange={handleFeeInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                                Min.
                              </span>
                            </div>
                          </div>
                          <div className="flex-1"></div>
                        </div>
                      </div>

                      {/* Minute Fee */}
                      <div className="my-6 rounded-xl border bg-card p-6">
                        <div className="text-title font-medium">Minute fee</div>
                        <div className="mb-2 text-xs text-[#8a94a6]">
                          A minute fee too be applied after a specified time of charging.
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label htmlFor="minuteFeeDescription" className="text-title text-xs">
                              Description
                            </Label>
                            <Input
                              id="minuteFeeDescription"
                              placeholder="ระบุ"
                              className="mt-1"
                              value={feeForm.minuteFeeDescription}
                              onChange={handleFeeDescriptionChange}
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="feePerMin" className="text-title text-xs">
                              Fee per min
                            </Label>
                            <div className="relative">
                              <Input
                                id="feePerMin"
                                placeholder="0"
                                className="mt-1"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={feeForm.feePerMin}
                                onChange={handleFeeInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                                ฿/min
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-4">
                          <div className="flex-1">
                            <Label htmlFor="applyFeeAfterMinute" className="text-title text-xs">
                              Apply fee after
                            </Label>
                            <div className="relative">
                              <Input
                                id="applyFeeAfterMinute"
                                placeholder="0"
                                className="mt-1"
                                type="number"
                                min={0}
                                value={feeForm.applyFeeAfterMinute}
                                onChange={handleFeeInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                                Min.
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="feeStopsAfterMinute" className="text-title text-xs">
                              Fee Stops after
                            </Label>
                            <div className="relative">
                              <Input
                                id="feeStopsAfterMinute"
                                placeholder="0"
                                className="mt-1"
                                type="number"
                                min={0}
                                value={feeForm.feeStopsAfterMinute}
                                onChange={handleFeeInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                                Min.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Idle Fee */}
                      <div className="my-6 rounded-xl border bg-card p-6">
                        <div className="text-title font-medium">Idle fee</div>
                        <div className="mb-2 text-xs text-[#8a94a6]">
                          Will be applied after charging if car remains connected to charger.
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label htmlFor="idleFeeDescription" className="text-title text-xs">
                              Description
                            </Label>
                            <Input
                              id="idleFeeDescription"
                              placeholder="ระบุ"
                              className="mt-1"
                              value={feeForm.idleFeeDescription}
                              onChange={handleFeeDescriptionChange}
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="feePerMinIdle" className="text-title text-xs">
                              Fee per min
                            </Label>
                            <div className="relative">
                              <Input
                                id="feePerMinIdle"
                                placeholder="0"
                                className="mt-1"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={feeForm.feePerMinIdle}
                                onChange={handleFeeInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                                ฿/min
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-4">
                          <div className="flex-1">
                            <Label
                              htmlFor="timeBeforeIdleFeeApplied"
                              className="text-title text-xs"
                            >
                              Time before idle fee applied
                            </Label>
                            <div className="relative">
                              <Input
                                id="timeBeforeIdleFeeApplied"
                                placeholder="0"
                                className="mt-1"
                                type="number"
                                min={0}
                                value={feeForm.timeBeforeIdleFeeApplied}
                                onChange={handleFeeInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                                Min.
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="maxTotalIdleFee" className="text-title text-xs">
                              Maximum total idle fee
                            </Label>
                            <div className="relative">
                              <Input
                                id="maxTotalIdleFee"
                                placeholder="0"
                                className="mt-1 pr-8"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                value={feeForm.maxTotalIdleFee}
                                onChange={handleFeeInputChange}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b3b9c6]">
                                ฿
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
