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
import { ChevronLeft, CreditCard, Loader2, Zap } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  FeeFormData,
  FeeFormSchema,
  FormData,
  FormSchema,
  PriceFormData,
  PriceFormSchema,
  PriceGroupFormProps,
  PriceGroupFormSubmissionSchema,
  PriceType,
} from '../../_schemas/price-group-form.schema'

export default function MembersPriceGroupForm({
  mode,
  statusType,
  initialData,
  isLoading = false,
  onSubmit,
  onBack,
  teamGroupId,
}: PriceGroupFormProps) {
  const [priceType, setPriceType] = useState<PriceType>(initialData?.priceType ?? 'PER_KWH')
  const [billingType, setBillingType] = useState<'USAGE' | 'CREDIT'>('USAGE')

  // Billing cycle day (1-31) for credit billing
  const [billingDay, setBillingDay] = useState<string>(
    initialData?.billingDay ? String(initialData.billingDay) : '1',
  )

  // Main form state
  const [form, setForm] = useState<FormData>({
    groupName: initialData?.form?.groupName ?? '',
    status: initialData?.form?.status ?? 'publish',
  })

  // Price-specific form state
  const [priceForm, setPriceForm] = useState<PriceFormData>(() =>
    PriceFormSchema.parse({
      pricePerKwh: initialData?.priceForm?.pricePerKwh,
      pricePerKwhMinute: initialData?.priceForm?.pricePerKwhMinute,
      price_per_minute: initialData?.priceForm?.price_per_minute,
      onPeakPrice: initialData?.priceForm?.onPeakPrice,
      offPeakPrice: initialData?.priceForm?.offPeakPrice,
      freeKw: initialData?.priceForm?.freeKw,
      freeKwh: initialData?.priceForm?.freeKwh,
    }),
  )

  // Fee form state
  const [feeForm, setFeeForm] = useState<FeeFormData>(() =>
    FeeFormSchema.parse({
      fee: initialData?.feeForm?.fee,
      startingFeeDescription: initialData?.feeForm?.startingFeeDescription,
      chargingFeeDescription: initialData?.feeForm?.chargingFeeDescription,
      feePrice: initialData?.feeForm?.feePrice,
      applyAfterMinute: initialData?.feeForm?.applyAfterMinute,
      minuteFeeDescription: initialData?.feeForm?.minuteFeeDescription,
      feePerMin: initialData?.feeForm?.feePerMin,
      applyFeeAfterMinute: initialData?.feeForm?.applyFeeAfterMinute,
      feeStopsAfterMinute: initialData?.feeForm?.feeStopsAfterMinute,
      idleFeeDescription: initialData?.feeForm?.idleFeeDescription,
      feePerMinIdle: initialData?.feeForm?.feePerMinIdle,
      timeBeforeIdleFeeApplied: initialData?.feeForm?.timeBeforeIdleFeeApplied,
      maxTotalIdleFee: initialData?.feeForm?.maxTotalIdleFee,
    }),
  )

  // Update form states when initialData changes
  useEffect(() => {
    if (!initialData) {
      return
    }

    if (initialData.form) {
      setForm((prevForm) => ({
        groupName:
          initialData.form?.groupName !== undefined && initialData.form?.groupName !== null
            ? String(initialData.form.groupName).trim()
            : prevForm.groupName,
        status:
          initialData.form?.status !== undefined && initialData.form?.status !== null
            ? String(initialData.form.status).trim()
            : prevForm.status,
      }))
    }

    if (initialData.priceForm) {
      setPriceForm((prevPriceForm) =>
        PriceFormSchema.parse({ ...prevPriceForm, ...initialData.priceForm }),
      )
    }

    if (initialData.feeForm) {
      setFeeForm((prevFeeForm) => FeeFormSchema.parse({ ...prevFeeForm, ...initialData.feeForm }))
    }

    if (initialData.priceType) {
      setPriceType(initialData.priceType)
    }
    // default billing type
    setBillingType('USAGE')
    // hydrate billing day if provided
    if (
      typeof (initialData as any)?.billingDay !== 'undefined' &&
      (initialData as any).billingDay !== null
    ) {
      setBillingDay(String((initialData as any).billingDay))
    }
  }, [initialData])

  // Form validation - แยกการตรวจสอบ teamGroupId ออกจาก isFormValid เพื่อให้ user กรอกข้อมูลได้ก่อน
  const isFormValid = FormSchema.safeParse(form).success

  // removed debug logs

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
    // removed debug logs
    const validationResult = PriceGroupFormSubmissionSchema.safeParse({
      form,
      priceForm,
      feeForm,
      priceType,
    })

    if (!validationResult.success) {
      const errorMessage = Array.from(
        new Set(validationResult.error.issues.map((issue) => issue.message)),
      )
        .filter(Boolean)
        .join('\n')

      toast.error(errorMessage || 'กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    // ตรวจสอบ teamGroupId สำหรับ mode add
    if (mode === 'add' && !teamGroupId) {
      toast.error('Team group ID not found. Please try again.')
      return
    }

    try {
      await onSubmit(validationResult.data)
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
            <h1 className="text-oc-title-secondary text-xl font-medium md:text-2xl">
              {getTitle()}
            </h1>
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
                  className="lg:w-lg flex flex-1 flex-col gap-6 border-b pb-6 pt-6 md:pb-0 md:pt-8 lg:flex-none lg:border-b-0 lg:border-r lg:pr-8"
                  style={{ minHeight: 'max(300px, 100%)' }}
                >
                  <div>
                    <Label
                      htmlFor="groupName"
                      className="text-oc-title-secondary text-sm font-semibold"
                    >
                      {getLabelText()} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="groupName"
                      value={form.groupName}
                      onChange={handleInputChange}
                      placeholder="โปรดระบุ"
                      className="text-oc-title-secondary mt-2 border-none bg-[#F2F2F2] placeholder:text-[#CACACA]"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="status"
                      className="text-oc-title-secondary text-sm font-semibold"
                    >
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.status}
                      onValueChange={handleStatusChange}
                      defaultValue="publish"
                    >
                      <SelectTrigger
                        className={`mt-2 w-full border-none bg-[#F2F2F2] ${
                          form.status ? 'text-[#CACACA]' : 'text-oc-title-secondary'
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
                  <div>
                    <Label className="text-oc-title-secondary text-sm font-semibold">
                      รูปแบบชำระเงิน<span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-3">
                      <RadioGroup
                        value={billingType}
                        onValueChange={(v) => setBillingType(v as 'USAGE' | 'CREDIT')}
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                      >
                        {/* Usage card */}
                        <div>
                          <RadioGroupItem
                            id="billing-usage"
                            value="USAGE"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="billing-usage"
                            className={`block cursor-pointer rounded-xl border p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-4 ${
                              billingType === 'USAGE'
                                ? 'border-primary/60 bg-primary/5 ring-2 ring-primary'
                                : 'border-border hover:bg-muted/40'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center rounded-md p-2">
                                <Zap
                                  aria-hidden
                                  className={
                                    billingType === 'USAGE'
                                      ? 'h-4 w-4 text-primary sm:h-5 sm:w-5'
                                      : 'h-4 w-4 text-muted-foreground sm:h-5 sm:w-5'
                                  }
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium">จ่ายตามการใช้งาน</div>
                                <p className="text-xs text-muted-foreground">
                                  คิดเงินตามหน่วยที่ใช้จริง เช่น บาท/kWh หรือรายชั่วโมง
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>

                        {/* Credit card */}
                        <div>
                          <RadioGroupItem
                            id="billing-credit"
                            value="CREDIT"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="billing-credit"
                            className={`block cursor-pointer rounded-xl border p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-4 ${
                              billingType === 'CREDIT'
                                ? 'border-primary/60 bg-primary/5 ring-2 ring-primary'
                                : 'border-border hover:bg-muted/40'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center rounded-md p-2">
                                <CreditCard
                                  aria-hidden
                                  className={
                                    billingType === 'CREDIT'
                                      ? 'h-4 w-4 text-primary sm:h-5 sm:w-5'
                                      : 'h-4 w-4 text-muted-foreground sm:h-5 sm:w-5'
                                  }
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium">เครดิต</div>
                                <p className="text-xs text-muted-foreground">
                                  ตัดเครดิต/แพ็กเกจล่วงหน้า เหมาะกับการให้สิทธิ์สมาชิก
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form inputs */}
                <div className="flex-1 space-y-6 px-4 pb-6 pt-6 md:px-4 md:pb-8 md:pt-8 lg:w-3/4 lg:pl-8 lg:pr-0">
                  {/* Price Type Selection */}
                  <div>
                    <Label className="text-oc-title-secondary text-base font-semibold">
                      การตั้งรูปแบบราคา <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-3 flex flex-wrap gap-3 rounded-lg bg-[#355FF5] p-4">
                      <RadioGroup
                        value={priceType}
                        onValueChange={handlePriceTypeChange}
                        className="flex w-full flex-wrap gap-6"
                      >
                        {/* บาท/kWh */}
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
                        {/* Tiered Credit Pricing */}
                        <div
                          className={`flex items-center space-x-2 rounded-xl px-6 py-3 transition-colors ${
                            priceType === 'TIERED_CREDIT'
                              ? 'bg-white/20 text-white'
                              : 'bg-[#2B58F7] text-white'
                          }`}
                        >
                          <RadioGroupItem
                            value="TIERED_CREDIT"
                            id="radio-tiered-credit"
                            className={`${
                              priceType === 'TIERED_CREDIT'
                                ? 'border-2 border-white text-white'
                                : 'border-2 border-white/20'
                            }`}
                          />
                          <Label
                            className={`cursor-pointer ${
                              priceType === 'TIERED_CREDIT' ? 'text-card' : 'text-white'
                            }`}
                          >
                            Tiered Credit Pricing
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Price Input Sections */}
                  {priceType === 'PER_KWH' && (
                    <div className="mt-4 rounded-xl border p-6">
                      <Label htmlFor="price" className="text-oc-title-secondary font-medium">
                        บาท <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative mt-2 w-full sm:w-2/3 md:w-1/2">
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
                      {/* Billing cycle day (only relevant for CREDIT) */}
                      <div className="mt-4">
                        <Label
                          htmlFor="billingDay"
                          className="text-oc-title-secondary text-sm font-semibold"
                        >
                          รอบวันที่วางบิล
                        </Label>
                        <Select value={billingDay} onValueChange={setBillingDay}>
                          <SelectTrigger
                            id="billingDay"
                            className={`mt-2 w-28 ${billingDay ? 'text-oc-title-secondary' : 'text-[#CACACA]'}`}
                            aria-label="Billing cycle day"
                            // Disable when paying by usage
                            disabled={billingType !== 'CREDIT'}
                          >
                            <SelectValue placeholder="เลือกวันที่ (1–31)" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => {
                              const val = String(i + 1)
                              return (
                                <SelectItem key={val} value={val}>
                                  {i + 1}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Additional Fee Section */}
                  {true && (
                    <div>
                      <div className="text-oc-title-secondary mb-2 text-base font-semibold">
                        Additional Fee
                      </div>

                      {/* Starting Fee */}
                      <div className="mb-6 rounded-xl border p-6">
                        <div className="text-oc-title-secondary font-medium">Starting fee</div>
                        <div className="mb-2 text-xs text-[#8a94a6]">
                          A one-time fee will be applied when starting the charge session.
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label
                              htmlFor="startingFeeDescription"
                              className="text-oc-title-secondary text-xs"
                            >
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
                            <Label htmlFor="fee" className="text-oc-title-secondary text-xs">
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
                        <div className="text-oc-title-secondary font-medium">Charging fee</div>
                        <div className="mb-2 text-xs text-[#8a94a6]">
                          A one-time fee to be applied after a specified time of charging.
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label
                              htmlFor="chargingFeeDescription"
                              className="text-oc-title-secondary text-xs"
                            >
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
                            <Label htmlFor="feePrice" className="text-oc-title-secondary text-xs">
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
                            <Label
                              htmlFor="applyAfterMinute"
                              className="text-oc-title-secondary text-xs"
                            >
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
                        <div className="text-oc-title-secondary font-medium">Minute fee</div>
                        <div className="mb-2 text-xs text-[#8a94a6]">
                          A minute fee too be applied after a specified time of charging.
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label
                              htmlFor="minuteFeeDescription"
                              className="text-oc-title-secondary text-xs"
                            >
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
                            <Label htmlFor="feePerMin" className="text-oc-title-secondary text-xs">
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
                            <Label
                              htmlFor="applyFeeAfterMinute"
                              className="text-oc-title-secondary text-xs"
                            >
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
                            <Label
                              htmlFor="feeStopsAfterMinute"
                              className="text-oc-title-secondary text-xs"
                            >
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
                        <div className="text-oc-title-secondary font-medium">Idle fee</div>
                        <div className="mb-2 text-xs text-[#8a94a6]">
                          Will be applied after charging if car remains connected to charger.
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label
                              htmlFor="idleFeeDescription"
                              className="text-oc-title-secondary text-xs"
                            >
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
                            <Label
                              htmlFor="feePerMinIdle"
                              className="text-oc-title-secondary text-xs"
                            >
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
                              className="text-oc-title-secondary text-xs"
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
                            <Label
                              htmlFor="maxTotalIdleFee"
                              className="text-oc-title-secondary text-xs"
                            >
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
