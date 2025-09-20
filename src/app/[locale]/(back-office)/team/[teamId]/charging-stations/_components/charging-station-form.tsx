'use client'

import { useStationCategories } from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations'
import MapLandmark from '@/components/maps/mapLandmark'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/lib/i18n'
import { ChevronDown, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import {
  ChargingStationFormData,
  DayOfWeek,
  OpenCloseFormState,
} from '../_schemas/charging-stations.schema'
import { LanguageSelectorBodyRequest } from './select-lang-body-requset'

// ============================
// Types & Interfaces
// ============================

interface ChargingStationFormProps {
  mode: 'add' | 'edit'
  currentStep: number
  formData: ChargingStationFormData
  selectedLanguage: string
  openCloseForm: OpenCloseFormState
  openCloseDialogOpen: boolean
  uploadedFiles: File[]
  dayLabels: Record<DayOfWeek, string>
  existingGallery?: { id: number; image: string; sort_order: number }[] // เพิ่มรูปที่มีอยู่แล้ว
  allGalleryImages?: { id: number; image: string; sort_order: number }[] // รูปทั้งหมดรวมที่จะลบ
  deletedImageIds?: number[] // เพิ่มรายการ ID ของรูปที่จะลบ
  maxImages?: number // เพิ่มจำนวนรูปสูงสุด
  remainingSlots?: number // เพิ่มจำนวนที่เหลือ
  onSubmit: (e: React.FormEvent) => void
  onInputChange: (field: keyof ChargingStationFormData, value: any) => void
  onLanguageChange: (language: string) => void
  onOpenCloseDialogChange: (open: boolean) => void
  onOpenCloseChange: (
    day: DayOfWeek,
    field: 'enabled' | 'open' | 'close',
    value: boolean | string,
  ) => void
  onOpen24hrs: (checked: boolean) => void
  onSameEveryday: (checked: boolean) => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: (index: number) => void
  onRemoveExistingImage?: (imageId: number) => void // เพิ่มสำหรับลบรูปเก่า
  onUndoDeleteImage?: (imageId: number) => void // เพิ่มสำหรับยกเลิกการลบ
}

// ============================
// Main Component
// ============================

export function ChargingStationForm({
  mode,
  currentStep,
  formData,
  selectedLanguage,
  openCloseForm,
  openCloseDialogOpen,
  uploadedFiles,
  dayLabels,
  existingGallery = [], // default empty array
  allGalleryImages = [], // default empty array
  deletedImageIds = [], // default empty array
  maxImages = 5, // default 5 images
  remainingSlots = 5, // default 5 slots
  onSubmit,
  onInputChange,
  onLanguageChange,
  onOpenCloseDialogChange,
  onOpenCloseChange,
  onOpen24hrs,
  onSameEveryday,
  onFileUpload,
  onRemoveFile,
  onRemoveExistingImage, // เพิ่มสำหรับลบรูปเก่า
  onUndoDeleteImage, // เพิ่มสำหรับยกเลิกการลบ
}: ChargingStationFormProps) {
  // ============================
  // Hooks & Data
  // ============================
  const { t } = useI18n()
  const formRef = useRef<HTMLFormElement>(null)

  const {
    data: stationCategories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useStationCategories()

  // ============================
  // Return JSX
  // ============================
  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
      {currentStep === 1 && (
        <>
          <div className="mb-6 sm:mb-8">
            <LanguageSelectorBodyRequest
              onLanguageChange={onLanguageChange}
              defaultLanguage="en"
            />
            <p className="mt-2 text-xs text-gray-500">
              กรอกชื่อสถานีในแต่ละภาษา
              เพื่อให้ผู้ใช้เห็นข้อมูลถูกต้องตามภาษาที่เลือก
            </p>
          </div>
          <div>
            <div className="mb-2 flex items-center">
              <Label className="text-sm font-normal tracking-[0.15px] text-black">
                {t('charging-stations.station_name')} (
                {selectedLanguage.toUpperCase()})
              </Label>
              <span className="ml-1 text-[15px] font-normal text-destructive">
                *
              </span>
            </div>
            <Input
              id="station_name"
              value={
                selectedLanguage === 'th'
                  ? formData.station_name_th
                  : selectedLanguage === 'en'
                    ? formData.station_name
                    : formData.station_name_lao
              }
              onChange={(e) => {
                const field =
                  selectedLanguage === 'th'
                    ? 'station_name_th'
                    : selectedLanguage === 'en'
                      ? 'station_name'
                      : 'station_name_lao'
                onInputChange(
                  field as keyof ChargingStationFormData,
                  e.target.value,
                )
              }}
              placeholder={`Specify Name in ${selectedLanguage.toUpperCase()}`}
              className="h-10 border-none bg-[#f2f2f2] text-sm placeholder:text-[#CACACA] sm:h-11"
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-normal tracking-[0.15px] text-black">
              {t('charging-stations.station_detail')} (
              {selectedLanguage.toUpperCase()})
            </Label>
            <Textarea
              id="description"
              value={
                selectedLanguage === 'th'
                  ? formData.station_detail_th
                  : selectedLanguage === 'en'
                    ? formData.station_detail
                    : formData.station_detail_lao
              }
              onChange={(e) => {
                const field =
                  selectedLanguage === 'th'
                    ? 'station_detail_th'
                    : selectedLanguage === 'en'
                      ? 'station_detail'
                      : 'station_detail_lao'
                onInputChange(
                  field as keyof ChargingStationFormData,
                  e.target.value,
                )
              }}
              placeholder={`Add Charging Station Description in ${selectedLanguage.toUpperCase()}`}
              className="h-[120px] resize-none border-none bg-[#f2f2f2] text-sm placeholder:text-[#CACACA] sm:h-[195px]"
              rows={4}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center">
              <Label className="text-sm font-normal tracking-[0.15px] text-black">
                {t('charging-stations.station_category')}
              </Label>
              <span className="ml-1 text-[15px] font-normal text-destructive">
                *
              </span>
            </div>
            <Select
              value={
                formData.station_type_id
                  ? formData.station_type_id.toString()
                  : undefined
              }
              onValueChange={(value) =>
                onInputChange('station_type_id', Number(value))
              }
              disabled={isLoadingCategories}
            >
              <SelectTrigger
                className={`!h-12 w-full border-none bg-[#f2f2f2] text-sm sm:h-11 ${formData.station_type_id ? 'text-zinc-900' : 'text-[#CACACA]'}`}
              >
                {isLoadingCategories ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading categories...
                  </div>
                ) : (
                  <SelectValue
                    placeholder={t(
                      'charging-stations.station_category_placeholder',
                    )}
                  />
                )}
              </SelectTrigger>
              <SelectContent className="z-[1000] bg-background text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                <SelectGroup>
                  <SelectLabel className="px-2 py-1.5 text-xs font-medium text-[#8D93A5]">
                    {t('charging-stations.station_category_placeholder')}
                  </SelectLabel>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    </SelectItem>
                  ) : categoriesError ? (
                    <SelectItem value="error" disabled>
                      Error loading categories
                    </SelectItem>
                  ) : stationCategories.length === 0 ? (
                    <SelectItem value="no-categories" disabled>
                      No categories available
                    </SelectItem>
                  ) : (
                    stationCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.station_type_id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <MapLandmark
            onCoordinatesChange={(lat, lng) => {
              onInputChange('coordinates', { lat, lng })
            }}
            onAddressChange={(address) => {
              onInputChange('address', address)
            }}
            initialCoordinates={formData.coordinates}
            initialAddress={formData.address}
          />

          <div className="border-t py-4">
            <Label className="mb-2 block text-sm font-normal tracking-[0.15px] text-black">
              {t('charging-stations.working_hours_label')}
            </Label>
            <Dialog
              open={openCloseDialogOpen}
              onOpenChange={onOpenCloseDialogChange}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto w-full justify-between border-none bg-[#f2f2f2] py-3.5 text-sm hover:bg-[#f2f2f2] sm:py-4"
                >
                  <div className="text-left">
                    {openCloseForm.open24hrs ? (
                      <div>
                        <p className="font-normal text-[#364A63]">
                          เปิดให้บริการ 24 ชั่วโมง
                        </p>
                        <p className="mt-1 text-xs text-green-600">
                          ทุกวัน 00:00 - 23:59
                        </p>
                      </div>
                    ) : openCloseForm.sameEveryday ? (
                      <div>
                        <p className="font-normal text-[#364A63]">
                          เวลาเดียวกันทุกวัน
                        </p>
                        <p className="mt-1 text-xs text-blue-600">
                          {openCloseForm.days.monday?.open} -{' '}
                          {openCloseForm.days.monday?.close}
                        </p>
                      </div>
                    ) : Object.values(openCloseForm.days).some(
                        (day) => day.enabled,
                      ) ? (
                      <div>
                        <p className="mt-1 text-xs">
                          {Object.entries(openCloseForm.days)
                            .filter(([_, day]) => day.enabled)
                            .map(
                              ([dayName, day]) =>
                                `${dayLabels[dayName as DayOfWeek]}`,
                            )
                            .slice(0, 7)
                            .join(', ')}
                          {Object.values(openCloseForm.days).filter(
                            (day) => day.enabled,
                          ).length > 7}
                        </p>
                      </div>
                    ) : (
                      <p className="font-normal text-[#CACACA]">
                        {t('charging-stations.working_hours_placeholder')}
                      </p>
                    )}
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[min(96vw,800px)]! md:w-[800px]! max-h-[min(92vh,800px)] w-full overflow-y-auto p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl text-primary">
                    Add Open - Closed
                  </DialogTitle>
                </DialogHeader>
                <div className="my-4 flex flex-col gap-6 md:flex-row">
                  {/* Left: Date And Time */}
                  <div className="flex-1">
                    {(Object.keys(dayLabels) as DayOfWeek[]).map((day) => (
                      <div
                        key={day}
                        className="mb-3 flex items-center gap-3 rounded-xl border border-[#E8E6EA] py-2"
                      >
                        <Switch
                          checked={openCloseForm.days[day]?.enabled ?? false}
                          onCheckedChange={(checked) =>
                            onOpenCloseChange(day, 'enabled', checked)
                          }
                          disabled={openCloseForm.open24hrs}
                          className="ml-4 data-[state=checked]:bg-[#1ED86B] data-[state=unchecked]:bg-[#CECECE]"
                        />
                        <span
                          className={`w-24 ${
                            openCloseForm.days[day]?.enabled
                              ? 'font-normal'
                              : 'font-light text-[#606060]'
                          }`}
                        >
                          {dayLabels[day]}
                        </span>
                        {openCloseForm.days[day]?.enabled && (
                          <>
                            <Input
                              type="time"
                              value={openCloseForm.days[day]?.open ?? '00:00'}
                              onChange={(e) => {
                                if (openCloseForm.sameEveryday) {
                                  // sync ทุกวัน
                                  ;(
                                    Object.keys(
                                      openCloseForm.days,
                                    ) as DayOfWeek[]
                                  ).forEach((d) => {
                                    if (openCloseForm.days[d]?.enabled) {
                                      onOpenCloseChange(
                                        d,
                                        'open',
                                        e.target.value,
                                      )
                                    }
                                  })
                                } else {
                                  onOpenCloseChange(day, 'open', e.target.value)
                                }
                              }}
                              disabled={openCloseForm.open24hrs}
                              className="w-24 rounded-xl border-[#ECECEC] text-xl text-[#7C7C7C]"
                            />
                            <span className="text-[#7C7C7C]">-</span>
                            <Input
                              type="time"
                              value={openCloseForm.days[day]?.close ?? '00:00'}
                              onChange={(e) => {
                                if (openCloseForm.sameEveryday) {
                                  ;(
                                    Object.keys(
                                      openCloseForm.days,
                                    ) as DayOfWeek[]
                                  ).forEach((d) => {
                                    if (openCloseForm.days[d]?.enabled) {
                                      onOpenCloseChange(
                                        d,
                                        'close',
                                        e.target.value,
                                      )
                                    }
                                  })
                                } else {
                                  onOpenCloseChange(
                                    day,
                                    'close',
                                    e.target.value,
                                  )
                                }
                              }}
                              disabled={openCloseForm.open24hrs}
                              className="w-24 rounded-xl border-[#ECECEC] text-xl text-[#7C7C7C]"
                            />
                          </>
                        )}
                        {openCloseForm.open24hrs && (
                          <span className="ml-3 text-xs text-green-600">
                            24 ชั่วโมง
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Right: */}
                  <div className="flex w-64 flex-col gap-6">
                    <div>
                      <Label className="font-semibold">Open 24hrs</Label>
                      <p className="mb-2 text-xs text-gray-500">
                        for station ev charger
                      </p>
                      <Switch
                        checked={openCloseForm.open24hrs}
                        onCheckedChange={onOpen24hrs}
                        className="mr-2 data-[state=checked]:bg-[#1ED86B] data-[state=unchecked]:bg-[#CECECE]"
                      />
                    </div>
                    <div>
                      <Label className="font-semibold">
                        Set the same time every day
                      </Label>
                      <p className="mb-2 text-xs text-gray-500">
                        Auto–charge your EV at your preferred time every day.
                      </p>
                      <Switch
                        checked={openCloseForm.sameEveryday}
                        onCheckedChange={onSameEveryday}
                        disabled={openCloseForm.open24hrs}
                        className="mr-2 data-[state=checked]:bg-[#1ED86B] data-[state=unchecked]:bg-[#CECECE]"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onOpenCloseDialogChange(false)}
                    className="w-40"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      onInputChange('openClose', JSON.stringify(openCloseForm))
                      onOpenCloseDialogChange(false)
                    }}
                    className="w-40 bg-zinc-800 transition hover:bg-zinc-700"
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <Label className="mb-2 block text-sm font-normal tracking-[0.15px] text-black">
              {t('charging-stations.contact')}
            </Label>
            <Input
              id="contact"
              type="tel"
              value={formData.contact || ''}
              onChange={(e) => {
                // กรองให้เฉพาะตัวเลข
                const numericValue = e.target.value.replace(/[^0-9]/g, '')
                onInputChange('contact', numericValue)
              }}
              placeholder={t('charging-stations.contact_placeholder')}
              className="h-10 border-none bg-[#f2f2f2] text-sm placeholder:text-[#CACACA] sm:h-11"
              maxLength={15} // จำกัดความยาวเบอร์โทร
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-normal tracking-[0.15px] text-black">
              {t('charging-stations.place_photo')}
            </Label>
            <p className="mb-4 text-sm text-gray-600">
              {t('charging-stations.place_photo_description')}
            </p>

            {/* แสดงข้อมูลรูปภาพ */}
            {/* <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex justify-between text-sm">
                <span>
                  Total images: {existingGallery.length + uploadedFiles.length}/
                  {maxImages}
                </span>
                <span
                  className={`${remainingSlots > 0 ? "text-primary" : "text-destructive"}`}
                >
                  Remaining slots: {remainingSlots}
                </span>
              </div>
            </div> */}

            {/* Hidden file input */}
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              multiple
              onChange={onFileUpload}
              className="hidden"
              disabled={remainingSlots <= 0}
            />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                className={`flex h-12 items-center gap-2 rounded-full border ${
                  remainingSlots > 0
                    ? 'text-primary hover:text-primary'
                    : 'cursor-not-allowed text-gray-400'
                }`}
                onClick={() => {
                  if (remainingSlots > 0) {
                    document.getElementById('photo-upload')?.click()
                  }
                }}
                disabled={remainingSlots <= 0}
              >
                <Image
                  src="/assets/images/icons/photo-add.png"
                  alt="Add photos"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                {remainingSlots > 0
                  ? `${t('charging-stations.add_photo')} (${remainingSlots} / 5)`
                  : `${t('charging-stations.add_photo')}`}
              </Button>

              {/* Display images marked for deletion with undo option */}
              {mode === 'edit' && deletedImageIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {deletedImageIds.map((imageId) => {
                    // หารูปจาก allGalleryImages
                    const originalImage = allGalleryImages.find(
                      (img: any) => img.id === imageId,
                    )
                    if (!originalImage) return null

                    return (
                      <Button
                        key={imageId}
                        type="button"
                        variant={'link'}
                        size={'lg'}
                        onClick={() =>
                          onUndoDeleteImage && onUndoDeleteImage(imageId)
                        }
                        className="flex items-center gap-1 text-sm text-destructive"
                        title="Undo deletion"
                      >
                        Undo
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Display existing gallery images */}
            {existingGallery.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {existingGallery.map((item) => (
                    <div key={item.id} className="relative">
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <Image
                          src={item.image}
                          alt={`Station image ${item.sort_order}`}
                          className="h-full w-full object-cover"
                          width={100}
                          height={100}
                        />
                      </div>

                      {/* เพิ่มปุ่มลบสำหรับโหมด edit */}
                      {mode === 'edit' && onRemoveExistingImage && (
                        <Button
                          type="button"
                          variant={'destructive'}
                          size={'icon'}
                          onClick={() => onRemoveExistingImage(item.id)}
                          className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full"
                          title="Delete image"
                        >
                          <X className="size-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  New photos to upload ({uploadedFiles.length}):
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-full w-full object-cover"
                          width={100}
                          height={100}
                        />
                      </div>
                      <Button
                        type="button"
                        variant={'destructive'}
                        onClick={() => onRemoveFile(index)}
                        className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full"
                      >
                        <X className="size-3" />
                      </Button>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500">
              {t('charging-stations.place_photo_detail')}
            </p>
          </div>

          <div className="my-2">
            <Label className="block py-2 font-normal">
              {t('status.status')}
            </Label>
            <Select
              value={formData.status?.toString() || '1'}
              onValueChange={(value) => onInputChange('status', Number(value))}
            >
              <SelectTrigger className="w-full bg-[#f2f2f2] text-sm placeholder:text-[#CACACA]">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('status.status')}</SelectLabel>
                  <SelectItem value="1">Public</SelectItem>
                  <SelectItem value="4">Private</SelectItem>
                  <SelectItem value="6">Restricted</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Status Switch for mobile view only */}
          <div className="mt-4 md:hidden">
            <div className="flex flex-col items-start justify-between pb-4">
              <Label
                htmlFor="status-sidebar"
                className="mb-4 text-sm font-normal tracking-[0.15px] text-black"
              >
                Show On Map
              </Label>
              <Switch
                id="status-sidebar"
                checked={formData.show_on_map}
                onCheckedChange={(checked) =>
                  onInputChange('show_on_map', checked)
                }
                className="data-[state=checked]:bg-[#00DD9C]"
              />
            </div>
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Label
                  htmlFor="status-mobile"
                  className="text-sm font-normal tracking-[0.15px] text-black"
                >
                  Status
                </Label>
                <span className="ml-1 text-[15px] font-normal text-destructive">
                  *
                </span>
              </div>
              <Switch
                id="status-mobile"
                className="data-[state=checked]:bg-[#00DD9C]"
              />
            </div> */}
          </div>
        </>
      )}
    </form>
  )
}
