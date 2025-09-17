'use client'

import { ChargingStationForm } from '@/components/back-office/team/form'
import { ErrorDialog, SuccessDialog } from '@/components/notifications'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import type {
  ChargingStationFormData,
  CreateChargingStationRequest,
  DayOfWeek,
  OpenCloseFormState,
  OpenCloseTime,
  WorkTime,
} from '@/modules/charging-stations/schemas/charging-stations.schema'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CheckIcon, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface AddChargingStationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateChargingStationRequest) => void
  initialData?: ChargingStationFormData
  teamGroupId: number // เพิ่ม team_group_id
  existingGallery?: { id: number; image: string; sort_order: number }[] // เพิ่มรูปที่มีอยู่แล้ว
}

const initialFormData: ChargingStationFormData = {
  station_name: '',
  station_name_th: '',
  station_name_lao: '',
  station_detail: '',
  station_detail_th: '',
  station_detail_lao: '',
  address: '',
  station_type_id: 0,
  coordinates: {
    lat: 0,
    lng: 0,
  },
  status: 1,
  show_on_map: false,
  openClose: '',
  contact: '',
}

const initialOpenCloseFormState: OpenCloseFormState = {
  open24hrs: false,
  sameEveryday: false,
  days: {
    monday: { enabled: false, open: '00:00', close: '00:00' },
    tuesday: { enabled: false, open: '00:00', close: '00:00' },
    wednesday: { enabled: false, open: '00:00', close: '00:00' },
    thursday: { enabled: false, open: '00:00', close: '00:00' },
    friday: { enabled: false, open: '00:00', close: '00:00' },
    saturday: { enabled: false, open: '00:00', close: '00:00' },
    sunday: { enabled: false, open: '00:00', close: '00:00' },
  },
}

const dayOfWeekMap: Record<DayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

export function openCloseToWorkArray(openCloseForm: OpenCloseFormState): WorkTime[] {
  return (Object.keys(openCloseForm.days) as DayOfWeek[]).map((day) => ({
    work_day: dayOfWeekMap[day].toString(),
    work_status: openCloseForm.days[day]?.enabled ? '1' : '0',
    work_time_start: openCloseForm.days[day]?.open ?? '00:00',
    work_time_end: openCloseForm.days[day]?.close ?? '00:00',
  }))
}

export default function AddChargingStationDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  teamGroupId,
  existingGallery = [], // default empty array
}: AddChargingStationDialogProps) {
  const { t } = useI18n()

  // คำนวณจำนวนรูปที่เหลือสำหรับอัปโหลด
  const maxImages = 5
  const existingImageCount = existingGallery.length
  const remainingSlots = maxImages - existingImageCount

  // Local state
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ChargingStationFormData>(initialFormData)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [openCloseDialogOpen, setOpenCloseDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en') // เพิ่ม state สำหรับภาษา

  // Staging area สำหรับเก็บข้อมูลระหว่างการกรอก
  const [stagingData, setStagingData] = useState({
    th: { name: '', detail: '' },
    en: { name: '', detail: '' },
    lo: { name: '', detail: '' },
  })

  useEffect(() => {
    console.log('Error dialog state changed:', {
      showErrorDialog,
      errorMessage,
    })
  }, [showErrorDialog, errorMessage])

  // ฟอร์มเวลาเปิด-ปิด
  const [openCloseForm, setOpenCloseForm] = useState<OpenCloseFormState>(initialOpenCloseFormState)

  const dayLabels: Record<DayOfWeek, string> = {
    monday: t('common.days.monday'),
    tuesday: t('common.days.tuesday'),
    wednesday: t('common.days.wednesday'),
    thursday: t('common.days.thursday'),
    friday: t('common.days.friday'),
    saturday: t('common.days.saturday'),
    sunday: t('common.days.sunday'),
  }

  const steps = [
    { number: 1, name: t('charging-stations.step_create') },
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
            (formData.station_name_th?.trim() ?? '').length > 0 &&
            (formData.station_detail_th?.trim() ?? '').length > 0
          )
        } else if (selectedLanguage === 'lo') {
          return (
            (formData.station_name_lao?.trim() ?? '').length > 0 &&
            (formData.station_detail_lao?.trim() ?? '').length > 0
          )
        }
        return false
      })()

      const englishValid =
        formData.station_name.trim() !== '' && formData.station_detail.trim() !== ''

      return currentLangValid && englishValid
    } else {
      // เลือกภาษาอังกฤษ ก็กรอกแค่อังกฤษ
      return formData.station_name.trim() !== '' && formData.station_detail.trim() !== ''
    }
  })()

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmitForm()
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData(initialData || initialFormData)
  }

  const handleLanguageChange = (language: string) => {
    console.log('Language changed to:', language)

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

  const handleSubmitForm = async (e?: React.FormEvent) => {
    try {
      if (e) e.preventDefault()
      setIsLoading(true)

      // แปลง formData ให้ตรงกับ CreateChargingStationRequest
      const submitData: CreateChargingStationRequest = {
        latitude: formData.coordinates.lat.toString(),
        longtitude: formData.coordinates.lng.toString(),
        // ส่งข้อมูลตามภาษาที่กรอก
        station_name: formData.station_name,
        station_name_th: formData.station_name_th,
        station_name_lao: formData.station_name_lao,
        station_detail: formData.station_detail,
        station_detail_th: formData.station_detail_th,
        station_detail_lao: formData.station_detail_lao,
        station_type_id: formData.station_type_id,
        address: formData.address,
        contact: formData.contact, // เพิ่ม contact field
        status: formData.status,
        show_on_map: formData.show_on_map,
        work: openCloseToWorkArray(openCloseForm),
        team_group_id: teamGroupId,
        image: uploadedFiles.length > 0 ? uploadedFiles : undefined, // เพิ่มรูปภาพ
      }

      console.log('🔥 formData.contact value (CREATE):', formData.contact)
      console.log('🔥 submitData.contact value (CREATE):', submitData.contact)
      console.log('🔥 uploadedFiles:', uploadedFiles)
      console.log('🔥 uploadedFiles.length:', uploadedFiles.length)
      console.log('🔥 submitData.images:', submitData.image)
      console.log('Submitting data:', submitData)
      console.log('Uploaded files:', uploadedFiles)

      // เรียก onSubmit และรอผลลัพธ์
      await onSubmit(submitData)

      // ถ้าถึงจุดนี้แสดงว่าสำเร็จ (ไม่มี error)
      setShowSuccessDialog(true)
      onOpenChange(false)
      toast.success('Charging station created successfully')
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage('Failed to create charging station')
      setShowErrorDialog(true)
      console.log('Showing error dialog') // Debug log
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    resetForm()
  }

  const handleErrorDialogClose = () => {
    setShowErrorDialog(false)
    setErrorMessage('')
  }

  const resetForm = () => {
    setFormData(initialData || initialFormData)
    setCurrentStep(1)
    setUploadedFiles([]) // Reset uploaded files
    setOpenCloseForm(initialOpenCloseFormState) // Reset open/close form
    setStagingData({
      th: { name: '', detail: '' },
      en: { name: '', detail: '' },
      lo: { name: '', detail: '' },
    })
    setSelectedLanguage('en')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)

      // ตรวจสอบว่าสามารถอัปโหลดได้หรือไม่
      if (remainingSlots <= 0) {
        toast.error(
          `Maximum ${maxImages} images allowed. Station already has ${existingImageCount} images.`,
        )
        event.target.value = ''
        return
      }

      // Validate file types (ภาพเท่านั้น)
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
      const invalidFiles = newFiles.filter((file) => !validTypes.includes(file.type))

      if (invalidFiles.length > 0) {
        alert('Please upload only image files (JPG, PNG, WEBP)')
        event.target.value = ''
        return
      }

      // Validate file sizes (10MB limit per file)
      const oversizedFiles = newFiles.filter((file) => file.size > 10 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        alert('Each image must be smaller than 10MB')
        event.target.value = ''
        return
      }

      setUploadedFiles((prev) => {
        const totalAfterUpload = prev.length + newFiles.length + existingImageCount

        // ตรวจสอบไม่ให้เกินขีดจำกัด
        if (totalAfterUpload > maxImages) {
          const allowedNewFiles = maxImages - existingImageCount - prev.length
          if (allowedNewFiles <= 0) {
            toast.error(
              `Cannot upload more images. Station already has ${existingImageCount} images and you have ${prev.length} images ready to upload. Maximum ${maxImages} images allowed.`,
            )
            return prev
          } else {
            toast.error(
              `You can only upload ${allowedNewFiles} more image(s). Only the first ${allowedNewFiles} files will be added.`,
            )
            return [...prev, ...newFiles.slice(0, allowedNewFiles)]
          }
        }

        return [...prev, ...newFiles]
      })
    }
    event.target.value = ''
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (
    field: keyof ChargingStationFormData,
    value: string | number | boolean | { lat: number; lng: number },
  ) => {
    // console.log("Input change:", field, value); // Debug logging
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

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
      } else if (field === 'station_name_lao' || field === 'station_detail_lao') {
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

  // ฟังก์ชันอัปเดตฟอร์มเวลาเปิด-ปิด
  const handleOpenCloseChange = (
    day: DayOfWeek,
    field: 'enabled' | 'open' | 'close',
    value: boolean | string,
  ) => {
    setOpenCloseForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          [field]: value,
        },
      },
    }))
  }

  // กรณี set เหมือนกันทุกวัน
  const handleSameEveryday = (checked: boolean) => {
    setOpenCloseForm((prev) => {
      const mondayData = prev.days.monday ?? {
        enabled: false,
        open: '00:00',
        close: '00:00',
      }
      const { open, close } = mondayData
      const newDays = Object.fromEntries(
        Object.entries(prev.days).map(([day, val]) => [
          day,
          { ...val, open, close, enabled: true },
        ]),
      ) as Record<DayOfWeek, OpenCloseTime>
      return {
        ...prev,
        sameEveryday: checked,
        days: checked ? newDays : prev.days,
      }
    })
  }

  // กรณี 24 ชั่วโมง
  const handleOpen24hrs = (checked: boolean) => {
    setOpenCloseForm((prev) => {
      const newDays = Object.fromEntries(
        Object.entries(prev.days).map(([day, val]) => [
          day,
          { ...val, open: '00:00', close: '23:59', enabled: true },
        ]),
      ) as Record<DayOfWeek, OpenCloseTime>
      return {
        ...prev,
        open24hrs: checked,
        days: checked ? newDays : prev.days,
      }
    })
  }

  useEffect(() => {
    if (open) {
      setCurrentStep(1)
      setFormData(initialData || initialFormData)
    }
  }, [open, initialData])

  const getStepStyles = (isCompleted: boolean, isActive: boolean) => {
    let circleBgClass = ''
    let circleContent: React.ReactNode
    let textClass = ''

    if (isCompleted) {
      circleBgClass = 'bg-[#25c870]'
      circleContent = <CheckIcon className="h-4 w-4 text-white" />
      textClass = 'font-normal text-[#25c870]'
    } else if (isActive) {
      circleBgClass = 'bg-[#25c870]'
      circleContent = (
        <span className="text-sm font-normal text-white">
          {/* step number will be passed in when used */}
        </span>
      )
      textClass = 'font-normal text-[#25c870]'
    } else {
      circleBgClass = 'bg-card border border-[#D6D6D6]'
      circleContent = (
        <span className="text-sm font-normal text-[#8D93A5]">
          {/* step number will be passed in when used */}
        </span>
      )
      textClass = 'font-normal text-[#8d93a5]'
    }

    return { circleBgClass, circleContent, textClass }
  }

  return (
    <>
      <Dialog open={open && !showErrorDialog} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[calc(100vh-40px)] w-full max-w-[940px] flex-col overflow-hidden rounded-lg bg-card p-0 sm:max-w-[min(94vw,940px)]">
          <DialogTitle className="sr-only">Add Charging Station</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new charging station by filling out the form.
          </DialogDescription>
          {/* Header */}
          <div className="relative flex h-[70px] shrink-0 items-center border-b px-4 sm:px-6 md:px-10 lg:px-[35px]">
            <h2 className="text-lg font-semibold text-primary md:text-xl">
              {t('charging-stations.add_charging_station')}
            </h2>
          </div>

          {/* Main Content - Responsive Grid */}
          <div className="-my-4 flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Left Column - Step Navigation (Desktop only) */}
            <div className="mx-14 hidden w-[180px] shrink-0 border-l border-r md:flex md:flex-col lg:w-[180px]">
              {/* Top section with steps */}
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
                          canClick ? 'opacity-100 hover:opacity-80' : 'cursor-default opacity-60'
                        }`}
                        onClick={() => setCurrentStep(step.number)}
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${circleBgClass}`}
                        >
                          {stepContent}
                        </div>
                        <span className={`ml-3 text-sm ${textClass}`}>{step.name}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="my-2 ml-[calc(73px+(--spacing(3))-1px)] h-10 w-px bg-none" />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Bottom section with status switch - only visible in step 2 */}
              {currentStep === 2 && (
                <div className="mt-auto border-t px-6 py-4">
                  <div className="flex flex-col items-start justify-between pb-4">
                    <Label
                      htmlFor="status-sidebar"
                      className="mb-4 text-sm font-normal tracking-[0.15px] text-black"
                    >
                      {t('charging-stations.show_on_map')}
                    </Label>
                    <Switch
                      id="status-sidebar"
                      checked={formData.show_on_map}
                      onCheckedChange={(checked) => handleInputChange('show_on_map', checked)}
                      className="data-[state=checked]:bg-[#00DD9C]"
                    />
                  </div>
                  <div className="flex flex-col items-start justify-between">
                    <Label
                      htmlFor="status-sidebar"
                      className="mb-4 text-sm font-normal tracking-[0.15px] text-black"
                    >
                      {t('status.status')}
                      <span className="ml-1 text-[15px] font-normal text-destructive">*</span>
                    </Label>
                    <Switch
                      // Mock ไว้ก่อน ยังไม่มี key จาก API request body
                      className="data-[state=checked]:bg-[#00DD9C]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step Navigation (Mobile only) */}
            <div className="block w-full border-b md:hidden">
              <div className="flex justify-center gap-4 py-3 sm:gap-6 sm:py-4">
                {steps.map((step) => {
                  const isCompleted = currentStep > step.number
                  const isActive = currentStep === step.number
                  const { circleBgClass, textClass } = getStepStyles(isCompleted, isActive)

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
                    <div key={step.number} className="flex flex-col items-center">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${circleBgClass}`}
                      >
                        {stepContent}
                      </div>
                      <span className={`mt-1 text-xs ${textClass}`}>{step.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column - Form Content */}
            <div className="mr-4 flex flex-1 flex-col overflow-y-auto sm:p-4 md:p-6">
              <ChargingStationForm
                mode="add"
                currentStep={currentStep}
                formData={formData}
                selectedLanguage={selectedLanguage}
                openCloseForm={openCloseForm}
                openCloseDialogOpen={openCloseDialogOpen}
                uploadedFiles={uploadedFiles}
                dayLabels={dayLabels}
                existingGallery={existingGallery} // เพิ่มรูปที่มีอยู่แล้ว
                maxImages={maxImages} // เพิ่มจำนวนรูปสูงสุด
                remainingSlots={remainingSlots} // เพิ่มจำนวนที่เหลือ
                onSubmit={handleSubmitForm}
                onInputChange={handleInputChange}
                onLanguageChange={handleLanguageChange}
                onOpenCloseDialogChange={setOpenCloseDialogOpen}
                onOpenCloseChange={handleOpenCloseChange}
                onOpen24hrs={handleOpen24hrs}
                onSameEveryday={handleSameEveryday}
                onFileUpload={handleFileUpload}
                onRemoveFile={removeFile}
              />
            </div>
          </div>

          {/* Footer */}
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
                  isFormValid ? 'bg-primary' : 'cursor-not-allowed bg-muted-foreground'
                }`}
                disabled={currentStep === 1 && !isFormValid}
              >
                {t('buttons.next')}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmitForm}
                className="h-10 w-full font-normal text-white sm:h-11 sm:w-[175px]"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : t('buttons.submit')}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title="Error"
        message={errorMessage}
        buttonText="Try Again"
        onButtonClick={handleErrorDialogClose}
      />

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="Success"
        message="Charging Stations has created completed"
        buttonText="Done"
        onButtonClick={handleSuccessDialogClose}
      />
    </>
  )
}
