'use client'
import {
  useDeleteStationImage,
  useStationCategories,
} from '@/app/[locale]/(back-office)/team/[teamId]/charging-stations'
import { ErrorDialog, SuccessDialog } from '@/components/notifications'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useI18n } from '@/lib/i18n'
import { CheckIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  type WorkTime,
  type ChargingStationFormData as ZodChargingStationFormData,
  type DayOfWeek as ZodDayOfWeek,
  type OpenCloseFormState as ZodOpenCloseFormState,
  type OpenCloseTime as ZodOpenCloseTime,
} from '../_schemas/charging-stations.schema'
import { ChargingStationForm } from './charging-station-form'

// ============================
// Types & Interfaces
// ============================

interface EditChargingStationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ZodChargingStationFormData) => Promise<void>
  initialData: ZodChargingStationFormData
  onShowSuccess?: () => void
}

interface WorkTimeItem {
  work_day: string | number
  work_status: string | number
  work_time_start: string
  work_time_end: string
  id: number
}

// interface StepProps {
//   number: number;
//   name: string;
// }

// ============================
// Constants
// ============================

const DAY_OF_WEEK_MAP: Record<ZodDayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} as const

const DAY_NUMBER_TO_NAME: Record<number, ZodDayOfWeek> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
} as const

const DEFAULT_DAY_STATE = {
  enabled: false,
  open: '00:00',
  close: '00:00',
} as const

const MAX_FILES = 5

// ============================
// Utility Functions
// ============================

const createDefaultOpenCloseState = (): ZodOpenCloseFormState => ({
  open24hrs: false,
  sameEveryday: false,
  days: {
    monday: { ...DEFAULT_DAY_STATE },
    tuesday: { ...DEFAULT_DAY_STATE },
    wednesday: { ...DEFAULT_DAY_STATE },
    thursday: { ...DEFAULT_DAY_STATE },
    friday: { ...DEFAULT_DAY_STATE },
    saturday: { ...DEFAULT_DAY_STATE },
    sunday: { ...DEFAULT_DAY_STATE },
  },
})

const parseOpenCloseString = (openClose?: string): ZodOpenCloseFormState => {
  if (!openClose) return createDefaultOpenCloseState()

  try {
    const parsed = JSON.parse(openClose)
    return parsed
  } catch {
    return createDefaultOpenCloseState()
  }
}

const openCloseFormToWorkTimePayload = (
  openCloseForm: ZodOpenCloseFormState,
): WorkTime[] => {
  return (Object.keys(openCloseForm.days) as ZodDayOfWeek[]).map((day) => {
    const dayData = openCloseForm.days[day]
    if (!dayData) {
      return {
        work_day: DAY_OF_WEEK_MAP[day].toString(),
        work_status: '0',
        work_time_start: '00:00',
        work_time_end: '00:00',
      }
    }
    return {
      work_day: DAY_OF_WEEK_MAP[day].toString(),
      work_status: dayData.enabled ? '1' : '0',
      work_time_start: dayData.open,
      work_time_end: dayData.close,
    }
  })
}

// ============================
// Main Component
// ============================

export default function EditsChargingStationDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  onShowSuccess,
}: EditChargingStationDialogProps) {
  // ============================
  // Hooks & Data
  // ============================
  const { t } = useI18n()
  const deleteImageMutation = useDeleteStationImage()

  const {
    data: stationCategories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useStationCategories()

  // ============================
  // State Management
  // ============================
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] =
    useState<ZodChargingStationFormData>(initialData)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]) // เก็บ ID ของรูปที่จะลบ
  const [openCloseDialogOpen, setOpenCloseDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('th')
  const [openCloseForm, setOpenCloseForm] = useState<ZodOpenCloseFormState>(
    parseOpenCloseString(initialData.openClose),
  )

  // Staging area สำหรับเก็บข้อมูลระหว่างการกรอก
  const [stagingData, setStagingData] = useState({
    th: { name: '', detail: '' },
    en: { name: '', detail: '' },
    lo: { name: '', detail: '' },
  })

  // ============================
  // Computed Values
  // ============================
  const dayLabels: Record<ZodDayOfWeek, string> = {
    monday: t('common.days.monday'),
    tuesday: t('common.days.tuesday'),
    wednesday: t('common.days.wednesday'),
    thursday: t('common.days.thursday'),
    friday: t('common.days.friday'),
    saturday: t('common.days.saturday'),
    sunday: t('common.days.sunday'),
  }

  const steps = [
    { number: 1, name: t('charging-stations.step_edit') },
    { number: 2, name: t('charging-stations.step_detail') },
  ]

  const isFormValid = (() => {
    // ตรวจสอบว่าต้องกรอก EN ด้วยหรือไม่ (ถ้าเลือก TH หรือ LO)
    const needsEnglish = selectedLanguage === 'th' || selectedLanguage === 'lo'

    if (needsEnglish) {
      // ต้องกรอกทั้งภาษาที่เลือกและภาษาอังกฤษ
      const currentLangValid = (() => {
        if (selectedLanguage === 'th') {
          return (
            (formData.station_name_th?.trim() ?? '') !== '' &&
            (formData.station_detail_th?.trim() ?? '') !== ''
          )
        } else if (selectedLanguage === 'lo') {
          return (
            (formData.station_name_lao?.trim() ?? '') !== '' &&
            (formData.station_detail_lao?.trim() ?? '') !== ''
          )
        }
        return true
      })()

      const englishValid =
        formData.station_name.trim() !== '' &&
        formData.station_detail.trim() !== ''

      return currentLangValid && englishValid
    } else {
      // เลือกภาษาอังกฤษ ก็กรอกแค่อังกฤษ
      return (
        formData.station_name.trim() !== '' &&
        formData.station_detail.trim() !== ''
      )
    }
  })()

  const getStepStyles = (isCompleted: boolean, isActive: boolean) => {
    if (isCompleted) {
      return {
        circleBgClass: 'bg-[#25c870]',
        circleContent: <CheckIcon className="h-4 w-4 text-white" />,
        textClass: 'font-normal text-[#25c870]',
      }
    }

    if (isActive) {
      return {
        circleBgClass: 'bg-[#25c870]',
        circleContent: <span className="text-sm font-normal text-white"></span>,
        textClass: 'font-normal text-[#25c870]',
      }
    }

    return {
      circleBgClass: 'bg-card border border-[#D6D6D6]',
      circleContent: (
        <span className="text-sm font-normal text-[#8D93A5]"></span>
      ),
      textClass: 'font-normal text-[#8d93a5]',
    }
  }

  // ============================
  // Event Handlers
  // ============================
  const handleLanguageChange = (language: string) => {
    // บันทึกข้อมูลปัจจุบันก่อนเปลี่ยนภาษา
    if (selectedLanguage === 'th') {
      setStagingData((prev) => ({
        ...prev,
        th: {
          name: formData.station_name_th ?? '',
          detail: formData.station_detail_th ?? '',
        },
      }))
    } else if (selectedLanguage === 'en') {
      setStagingData((prev) => ({
        ...prev,
        en: {
          name: formData.station_name ?? '',
          detail: formData.station_detail ?? '',
        },
      }))
    } else if (selectedLanguage === 'lo') {
      setStagingData((prev) => ({
        ...prev,
        lo: {
          name: formData.station_name_lao ?? '',
          detail: formData.station_detail_lao ?? '',
        },
      }))
    }

    setSelectedLanguage(language)

    // โหลดข้อมูลของภาษาใหม่
    if (language === 'th') {
      setFormData((prev) => ({
        ...prev,
        station_name_th: stagingData.th.name,
        station_detail_th: stagingData.th.detail,
      }))
    } else if (language === 'en') {
      setFormData((prev) => ({
        ...prev,
        station_name: stagingData.en.name,
        station_detail: stagingData.en.detail,
      }))
    } else if (language === 'lo') {
      setFormData((prev) => ({
        ...prev,
        station_name_lao: stagingData.lo.name,
        station_detail_lao: stagingData.lo.detail,
      }))
    }
  }

  const handleInputChange = (
    field: keyof ZodChargingStationFormData,
    value: string | number | boolean | { lat: number; lng: number },
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // อัปเดต staging data ไปด้วย
    if (typeof value === 'string') {
      if (field === 'station_name_th' || field === 'station_detail_th') {
        setStagingData((prev) => ({
          ...prev,
          th: {
            ...prev.th,
            [field === 'station_name_th' ? 'name' : 'detail']: value,
          },
        }))
      } else if (field === 'station_name' || field === 'station_detail') {
        setStagingData((prev) => ({
          ...prev,
          en: {
            ...prev.en,
            [field === 'station_name' ? 'name' : 'detail']: value,
          },
        }))
      } else if (
        field === 'station_name_lao' ||
        field === 'station_detail_lao'
      ) {
        setStagingData((prev) => ({
          ...prev,
          lo: {
            ...prev.lo,
            [field === 'station_name_lao' ? 'name' : 'detail']: value,
          },
        }))
      }
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData(initialData)
    setDeletedImageIds([]) // รีเซ็ตรายการรูปที่จะลบ
    setUploadedFiles([]) // รีเซ็ตรูปที่อัพโหลดใหม่
  }

  const resetForm = () => {
    setFormData(initialData)
    setCurrentStep(1)
    setUploadedFiles([])
    setDeletedImageIds([]) // รีเซ็ตรายการรูปที่จะลบ
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    resetForm()
    onOpenChange(false)
    // แสดง toast success เมื่อปิด dialog
    toast.success('Charging Station has been updated successfully')
  }

  const handleErrorDialogClose = () => {
    setShowErrorDialog(false)
    setErrorMessage('')
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmitForm()
    }
  }

  const handleSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // debug logs removed

    setIsLoading(true)
    try {
      // ลบรูปที่ถูกเลือกให้ลบก่อน
      if (deletedImageIds.length > 0) {
        // ลบรูปทีละรูป
        for (const imageId of deletedImageIds) {
          try {
            await new Promise((resolve, reject) => {
              deleteImageMutation.mutate(imageId, {
                onSuccess: () => {
                  resolve(true)
                },
                onError: (error) => {
                  console.error(`🔥 Failed to delete image ${imageId}:`, error)
                  reject(error)
                },
              })
            })
          } catch (error) {
            console.error(`🔥 Error deleting image ${imageId}:`, error)
            // ถ้าลบรูปไม่สำเร็จ ให้แสดง error แต่ยังคง submit ต่อไป
            toast.error(`Failed to delete image ${imageId}`)
          }
        }
      }

      const workTimeUpdate = openCloseFormToWorkTimePayload(openCloseForm)

      const submitData = {
        ...formData,
        work: workTimeUpdate,
        images: uploadedFiles, // ส่ง array เสมอ (ไม่ว่าจะมีหรือไม่มีรูป)
        contact: formData.contact || '', // ensure contact is included
      }

      // debug logs removed

      await onSubmit(submitData)

      // รีเซ็ต deletedImageIds หลังจาก submit สำเร็จ
      setDeletedImageIds([])

      if (onShowSuccess) {
        setTimeout(() => onShowSuccess(), 100)
      } else {
        setTimeout(() => setShowSuccessDialog(true), 100)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage('Failed to Update charging station')
      setShowErrorDialog(true)
      toast.error('Failed to update charging station')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files)
    setUploadedFiles((prev) => {
      const combined = [...prev, ...newFiles]
      if (combined.length > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files allowed`)
        return combined.slice(0, MAX_FILES)
      }
      return combined
    })
    event.target.value = ''
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingImage = (imageId: number) => {
    // mark image for deletion (log removed)

    // เพิ่ม imageId เข้า deletedImageIds เพื่อซ่อนรูปใน UI (staging)
    // ไม่ลบจาก API ทันที รอจนกว่าจะ submit form
    setDeletedImageIds((prev) => [...prev, imageId])

    toast.success(
      'Image marked for deletion. It will be removed when you save.',
    )
  }

  const handleUndoDeleteImage = (imageId: number) => {
    // เอา imageId ออกจาก deletedImageIds เพื่อให้รูปกลับมาแสดง
    setDeletedImageIds((prev) => prev.filter((id) => id !== imageId))

    toast.success('Image deletion cancelled.')
  }

  const handleOpenCloseChange = (
    day: ZodDayOfWeek,
    field: 'enabled' | 'open' | 'close',
    value: boolean | string,
  ) => {
    setOpenCloseForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...(prev.days[day] ?? {
            ...DEFAULT_DAY_STATE,
          }),
          [field]: value,
        },
      },
    }))
  }

  const handleSameEveryday = (checked: boolean) => {
    setOpenCloseForm((prev) => {
      const mondayData = prev.days.monday
      if (!mondayData) return prev

      const { open, close } = mondayData
      const newDays = Object.fromEntries(
        Object.entries(prev.days).map(([day, val]) => [
          day,
          { ...val, open, close, enabled: true },
        ]),
      ) as Record<ZodDayOfWeek, ZodOpenCloseTime>

      return {
        ...prev,
        sameEveryday: checked,
        days: checked ? newDays : prev.days,
      }
    })
  }

  const handleOpen24hrs = (checked: boolean) => {
    setOpenCloseForm((prev) => {
      const newDays = Object.fromEntries(
        Object.entries(prev.days).map(([day, val]) => [
          day,
          { ...val, open: '00:00', close: '23:59', enabled: true },
        ]),
      ) as Record<ZodDayOfWeek, ZodOpenCloseTime>

      return {
        ...prev,
        open24hrs: checked,
        days: checked ? newDays : prev.days,
      }
    })
  }

  // ============================
  // Effects
  // ============================
  useEffect(() => {
    if (categoriesError) {
      console.error('Error loading station categories:', categoriesError)
    }
  }, [categoriesError])

  useEffect(() => {
    if (!open) return

    setCurrentStep(1)
    setFormData(initialData)

    // Initialize staging data with initial values
    setStagingData({
      th: {
        name: initialData.station_name_th || '',
        detail: initialData.station_detail_th || '',
      },
      en: {
        name: initialData.station_name || '',
        detail: initialData.station_detail || '',
      },
      lo: {
        name: initialData.station_name_lao || '',
        detail: initialData.station_detail_lao || '',
      },
    })

    // Note: partner_station_work is not available in Zod schema
    // Only use openClose string for initialization
    setOpenCloseForm(parseOpenCloseString(initialData.openClose))
  }, [open, initialData])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[calc(100vh-40px)] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-card p-0">
          <DialogTitle className="sr-only">
            {t('charging-stations.edit_charging_station')}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Edit charging station information.
          </DialogDescription>
          <div className="relative flex h-[70px] shrink-0 items-center border-b px-4 sm:px-6 md:px-12 lg:px-[35px]">
            <h2 className="text-lg font-semibold text-primary md:text-xl">
              {t('charging-stations.edit_charging_station')}
            </h2>
          </div>
          <div className="-my-4 flex flex-1 flex-col overflow-hidden md:flex-row">
            <div className="mx-14 hidden w-[180px] shrink-0 border-l border-r md:flex md:flex-col lg:w-[180px]">
              <div className="-mx-10 grow items-start py-2 lg:py-8">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.number
                  const { circleBgClass, textClass } = getStepStyles(
                    false, // ไม่ต้องใช้ isCompleted แล้ว
                    isActive,
                  )

                  // stepContent: ถ้าเป็น step ปัจจุบัน ให้เน้นสี, step อื่นเป็นเลขปกติ
                  const stepContent = (
                    <span
                      className={`text-sm font-normal ${isActive ? 'text-white' : 'text-[#8D93A5]'}`}
                    >
                      {step.number}
                    </span>
                  )

                  // ทุก step สามารถคลิกได้
                  const canClick = true

                  return (
                    <div key={step.number}>
                      <div
                        className={`ml-[73px] flex cursor-pointer select-none items-center transition-opacity ${
                          canClick
                            ? 'opacity-100 hover:opacity-80'
                            : 'cursor-default opacity-60'
                        }`}
                        onClick={() => setCurrentStep(step.number)}
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${circleBgClass}`}
                        >
                          {stepContent}
                        </div>
                        <span className={`ml-3 text-sm ${textClass}`}>
                          {step.name}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="my-2 ml-[calc(73px+(--spacing(3))-1px)] h-10 w-px bg-none" />
                      )}
                    </div>
                  )
                })}
              </div>
              {currentStep === 2 && (
                <div className="mt-auto border-t px-6 py-4">
                  <div className="flex flex-col items-start justify-between space-y-4">
                    <div className="flex flex-col">
                      <Label
                        htmlFor="show-on-map-sidebar"
                        className="mb-4 text-sm font-normal tracking-[0.15px]"
                      >
                        {t('charging-stations.show_on_map')}
                      </Label>
                      <Switch
                        id="show-on-map-sidebar"
                        checked={formData.show_on_map}
                        onCheckedChange={(checked) =>
                          handleInputChange('show_on_map', checked)
                        }
                        className="data-[state=checked]:bg-[#00DD9C]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Label
                        htmlFor="status-sidebar"
                        className="mb-4 text-sm font-normal tracking-[0.15px]"
                      >
                        {t('status.status')}
                        <span className="ml-1 text-[15px] font-normal text-destructive">
                          *
                        </span>
                      </Label>
                      <Switch
                        // Mock ไว้ก่อน ยังไม่มี key จาก API request body
                        className="data-[state=checked]:bg-[#00DD9C]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="block w-full border-b md:hidden">
              <div className="flex justify-center gap-4 py-3 sm:gap-6 sm:py-4">
                {steps.map((step) => {
                  const isCompleted = currentStep > step.number
                  const isActive = currentStep === step.number
                  const { circleBgClass, textClass } = getStepStyles(
                    isCompleted,
                    isActive,
                  )

                  let stepContent
                  if (isCompleted) {
                    stepContent = <CheckIcon className="h-4 w-4 text-white" />
                  } else {
                    stepContent = (
                      <span
                        className={`text-sm font-normal ${isActive ? 'text-white' : 'text-[#8D93A5]'}`}
                      >
                        {step.number}
                      </span>
                    )
                  }

                  return (
                    <div
                      key={step.number}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${circleBgClass}`}
                      >
                        {stepContent}
                      </div>
                      <span className={`mt-1 text-xs ${textClass}`}>
                        {step.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mr-4 flex flex-1 flex-col overflow-y-auto p-4 md:p-6">
              <ChargingStationForm
                mode="edit"
                currentStep={currentStep}
                formData={formData}
                selectedLanguage={selectedLanguage}
                openCloseForm={openCloseForm}
                openCloseDialogOpen={openCloseDialogOpen}
                uploadedFiles={uploadedFiles}
                dayLabels={dayLabels}
                existingGallery={(
                  (initialData as any).existingGallery || []
                ).filter((img: any) => !deletedImageIds.includes(img.id))}
                allGalleryImages={(initialData as any).existingGallery || []}
                deletedImageIds={deletedImageIds}
                maxImages={5}
                remainingSlots={Math.max(
                  0,
                  5 -
                    uploadedFiles.length -
                    (((initialData as any).existingGallery || []).length -
                      deletedImageIds.length),
                )}
                onSubmit={handleSubmitForm}
                onInputChange={handleInputChange}
                onLanguageChange={handleLanguageChange}
                onOpenCloseDialogChange={setOpenCloseDialogOpen}
                onOpenCloseChange={handleOpenCloseChange}
                onOpen24hrs={handleOpen24hrs}
                onSameEveryday={handleSameEveryday}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
                onRemoveExistingImage={handleRemoveExistingImage}
                onUndoDeleteImage={handleUndoDeleteImage}
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2 border-t bg-card p-4 sm:gap-3 sm:p-4 md:p-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="h-10 w-full font-normal sm:h-11 sm:w-[175px]"
            >
              {t('buttons.cancel')}
            </Button>
            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className={`h-10 w-full font-normal text-white sm:h-11 sm:w-[175px] ${
                  isFormValid
                    ? 'bg-[#355ff5] hover:bg-[#2a4dd4]'
                    : 'cursor-not-allowed bg-muted-foreground'
                }`}
                disabled={currentStep === 1 && !isFormValid}
              >
                {t('buttons.next')}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isLoading}
                onClick={handleSubmitForm}
                className="h-10 w-full font-normal text-white sm:h-11 sm:w-[175px]"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  t('buttons.update')
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title="Error"
        message={errorMessage}
        buttonText="Try Again"
        onButtonClick={handleErrorDialogClose}
      />

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          setShowSuccessDialog(open)
        }}
        title="Success"
        message="Charging Station has been updated successfully"
        buttonText="Done"
        onButtonClick={handleSuccessDialogClose}
      />
    </>
  )
}
