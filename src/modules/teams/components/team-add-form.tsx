'use client'

import { ImageUploadFormIcon } from '@/components/icons'
import { useI18n } from '@/lib/i18n'
import { colors } from '@/lib/utils/colors'
import { teamFormDataSchema, type TeamFormData } from '@/modules/teams/schemas'
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface TeamAddFormProps {
  onSubmit: (data: TeamFormData) => Promise<void>
  isSubmitting?: boolean
  teamHostId?: string | null
  onValidationChange?: (isValid: boolean) => void
}

const TeamAddForm = ({ onSubmit, teamHostId, onValidationChange }: TeamAddFormProps) => {
  const { t } = useI18n()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormDataSchema),
    defaultValues: {
      team_name: '',
      team_email: '',
      team_phone: '',
      team_status: 'publish',
      file: undefined,
    },
    mode: 'onChange',
  })

  const watchedValues = watch()

  const onFormSubmit = async (data: TeamFormData) => {
    try {
      // Debug: ดูข้อมูลที่จะส่ง
      console.log('Form data before submit:', data)
      console.log('Selected file:', selectedFile)

      const formDataWithFile = {
        ...data,
        file: selectedFile || undefined,
      }

      console.log('Final data to submit:', formDataWithFile)
      await onSubmit(formDataWithFile)
    } catch (error) {
      console.error('Error creating team:', error)
      alert(t('team.create_team_failed'))
    }
  }

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        alert(t('team.invalid_file_type'))
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(t('team.file_too_large'))
        return
      }

      setSelectedFile(file)
      setValue('file', file)

      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null)
      }
    },
    [t, setValue],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null)
    setValue('file', undefined)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }, [previewUrl, setValue])

  const triggerFileInput = useCallback(async () => {
    if ('showOpenFilePicker' in window) {
      try {
        const fileHandles = await (
          window as unknown as {
            showOpenFilePicker: (options: {
              types: Array<{
                description: string
                accept: Record<string, string[]>
              }>
              excludeAcceptAllOption?: boolean
              multiple?: boolean
              startIn?: string
            }) => Promise<Array<{ getFile: () => Promise<File> }>>
          }
        ).showOpenFilePicker({
          types: [
            {
              description: 'Team Images',
              accept: {
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              },
            },
          ],
          excludeAcceptAllOption: true,
          multiple: false,
          startIn: 'desktop',
        })

        const file = await fileHandles[0].getFile()
        if (file) {
          handleFileSelect(file)
        }
      } catch {
        const input = document.getElementById('file-input') as HTMLInputElement

        input?.click()
      }
    } else {
      const input = document.getElementById('file-input') as HTMLInputElement
      input?.click()
    }
  }, [handleFileSelect])

  // ตรวจสอบความครบถ้วนของข้อมูล
  useEffect(() => {
    const allFieldsValid =
      watchedValues.team_name.trim() !== '' &&
      watchedValues.team_email.trim() !== '' &&
      watchedValues.team_phone.trim() !== '' &&
      watchedValues.team_status.trim() !== ''

    onValidationChange?.(allFieldsValid && isValid)
  }, [watchedValues, isValid, onValidationChange])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div>
      {/* แสดงข้อมูล team_host_id  */}
      {teamHostId && (
        <div className="mb-4 text-xs text-gray-500">(DEBUG:) Team Host ID: {teamHostId}</div>
      )}

      {/* Form */}
      <form id="add-team-form" onSubmit={handleSubmit(onFormSubmit)}>
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Left Column - File Upload */}
              <div
                className="flex flex-1 items-start justify-center border-b pb-6 pt-2 md:pb-0 md:pt-4 lg:border-b-0 lg:border-r lg:pr-8"
                style={{ minHeight: 'max(300px, 100%)' }}
              >
                <div className="mt-0 w-[181px]">
                  {/* Hidden file input */}
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileInput}
                    className="hidden"
                  />

                  {/* Upload area */}
                  <div
                    className={`border-3 flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg border-dashed transition-all ${
                      isDragging
                        ? `border-[${colors.primary[500]}] bg-[${colors.primary[500]}]/5`
                        : selectedFile
                          ? 'border-success bg-success/10'
                          : 'bg-muted'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                  >
                    {previewUrl ? (
                      // Image preview
                      <div className="relative h-full w-full p-4">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="h-full w-full rounded object-cover"
                          unoptimized
                        />
                        <Button
                          type="button"
                          variant={'destructive'}
                          size={'icon'}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile()
                          }}
                          className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full border"
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    ) : selectedFile ? (
                      // File selected (non-image)
                      <div className="space-y-2 text-center">
                        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-lg bg-green-100">
                          <svg
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
                        <p className="text-xs text-green-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile()
                          }}
                          className="text-xs"
                        >
                          {t('team.remove_file')}
                        </Button>
                      </div>
                    ) : (
                      // Default upload state
                      <div className="space-y-2 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center">
                          <ImageUploadFormIcon className="text-primary" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          {t('team.image_upload_label')}
                        </p>
                        <p className="text-xs text-gray-500">{t('team.supported_formats')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Form Inputs */}
              <div className="flex-1 space-y-4 px-4 pb-6 pt-6 md:px-6 md:pb-8 md:pt-8 lg:pl-8 lg:pr-0">
                {/* Team Name */}
                <div className="space-y-2">
                  <Label htmlFor="team_name">{t('team.forms.team_name')}</Label>
                  <Input
                    id="team_name"
                    {...register('team_name')}
                    placeholder="Specify"
                    className={`bg-muted ${errors.team_name ? 'border-destructive' : ''}`}
                  />
                  {errors.team_name && (
                    <p className="text-sm text-destructive">
                      {t(errors.team_name.message as string)}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="team_email">{t('team.forms.email')}</Label>
                  <Input
                    id="team_email"
                    type="email"
                    {...register('team_email')}
                    placeholder="Specify"
                    className="bg-muted"
                  />
                  {errors.team_email && (
                    <p className="text-sm text-destructive">{errors.team_email.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="team_phone">{t('team.forms.phone_number')}</Label>
                  <Input
                    id="team_phone"
                    type="tel"
                    {...register('team_phone')}
                    placeholder="Specify"
                    className="bg-muted"
                  />
                  {errors.team_phone && (
                    <p className="text-sm text-destructive">{errors.team_phone.message}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="team_status">{t('team.forms.status')}</Label>
                  <Select
                    value={watchedValues.team_status}
                    onValueChange={(value) =>
                      setValue('team_status', value as 'publish' | 'draft' | 'inactive')
                    }
                  >
                    <SelectTrigger className="w-full bg-muted">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publish">Publish</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.team_status && (
                    <p className="text-sm text-destructive">{errors.team_status.message}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default TeamAddForm
