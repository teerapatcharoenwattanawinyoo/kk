'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n } from '@/lib/i18n'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { teamFormDataSchema, type TeamFormData } from '../../_schemas/team.schema'

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
      const formDataWithFile = {
        ...data,
        file: selectedFile || undefined,
      }

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

  // --- Phone formatting helpers ---
  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    const p1 = digits.slice(0, 3)
    const p2 = digits.slice(3, 6)
    const p3 = digits.slice(6, 10)
    let out = p1
    if (p2) out += `-${p2}`
    if (p3) out += `-${p3}`
    return out
  }

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value)
      setValue('team_phone', formatted, { shouldValidate: true, shouldTouch: true })
    },
    [setValue],
  )

  const handlePhoneKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block manual hyphen entry and any non-digit except controls
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab']
    if (allowedKeys.includes(e.key)) return
    if (/^\d$/.test(e.key)) return // allow digits only; hyphen will be auto-inserted
    e.preventDefault()
  }, [])

  const handlePhonePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const text = e.clipboardData.getData('text') || ''
      const formatted = formatPhone(text)
      setValue('team_phone', formatted, { shouldValidate: true, shouldTouch: true })
    },
    [setValue],
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
      {/* Form */}
      <form id="add-team-form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
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
                    role="button"
                    tabIndex={0}
                    aria-label="Upload team image"
                    className={`group relative flex h-[181px] w-[181px] cursor-pointer items-center justify-center rounded-xl border border-dashed shadow-sm ring-1 ring-border/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 ${
                      isDragging
                        ? 'border-primary/60 bg-primary/5 ring-2 ring-primary/30'
                        : selectedFile
                          ? ''
                          : 'border-muted-foreground/20 bg-muted/20 hover:border-accent-foreground/30 hover:bg-accent/20'
                    } group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-primary/30`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        triggerFileInput()
                      }
                    }}
                  >
                    {previewUrl ? (
                      // Image preview
                      <div className="relative h-full w-full p-3">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="h-full w-full rounded-lg object-cover shadow-sm ring-1 ring-border"
                          unoptimized
                        />
                      </div>
                    ) : selectedFile ? (
                      // File selected (non-image)
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                          <UploadCloud className="h-5 w-5 text-emerald-600" />
                        </div>
                        <p className="max-w-[150px] truncate text-sm font-medium text-emerald-700">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-emerald-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile()
                          }}
                          className="text-xs text-destructive underline hover:text-destructive/90"
                        >
                          {t('team.remove_file')}
                        </button>
                      </div>
                    ) : (
                      // Default upload state
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm transition-transform group-hover:scale-105">
                          <UploadCloud className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          {t('team.image_upload_label')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('team.supported_formats')}
                        </p>
                      </div>
                    )}

                    {/* Subtle inner ring & shadow layer */}
                    <div className="pointer-events-none absolute inset-0 z-[1] rounded-xl ring-1 ring-border/40 transition-all group-hover:shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)] group-hover:ring-primary/30" />

                    {/* Corner accents (hover only) */}
                    <div className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="absolute left-2 top-2 h-px w-5 bg-primary/50" />
                      <span className="absolute left-2 top-2 h-5 w-px bg-primary/50" />
                      <span className="absolute bottom-2 right-2 h-px w-5 bg-primary/50" />
                      <span className="absolute bottom-2 right-2 h-5 w-px bg-primary/50" />
                    </div>

                    {/* Hover overlay (full cover, sleek) */}
                    <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center rounded-xl bg-gradient-to-t from-muted-foreground/60 to-muted-foreground/30 text-white opacity-0 backdrop-blur-[2px] transition-all duration-200 group-hover:opacity-100">
                      <UploadCloud className="mb-1 h-5 w-5 text-white/90" />
                      <span className="text-xs font-medium">
                        {previewUrl || selectedFile ? 'เปลี่ยนรูปภาพ' : 'อัพโหลดรูปภาพ'}
                      </span>
                    </div>

                    {/* Bottom-right camera badge (only show if file/image exists) */}
                    {(previewUrl || selectedFile) && (
                      <Badge
                        variant="secondary"
                        className="pointer-events-none absolute bottom-2 right-2 z-[4] rounded-full bg-background/80 p-1.5 text-foreground shadow-sm ring-1 ring-border transition-colors group-hover:bg-muted-foreground/70 group-hover:text-white"
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </Badge>
                    )}

                    {/* Drag overlay above all */}
                    {isDragging && (
                      <div className="pointer-events-none absolute inset-0 z-[5] grid place-items-center rounded-xl bg-primary/10">
                        <span className="rounded-md bg-primary/15 px-2 py-1 text-xs font-medium text-primary shadow-sm">
                          Drop to upload
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Form Inputs */}
              <div className="flex-1 space-y-4 px-4 pb-6 pt-6 md:px-6 md:pb-8 md:pt-8 lg:pl-8 lg:pr-0">
                {/* Team Name */}
                <div className="space-y-2">
                  <Label htmlFor="team_name">
                    {t('team.forms.team_name')} <span className="text-destructive">*</span>
                  </Label>
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
                    className={errors.team_email ? 'border-destructive' : 'bg-muted'}
                  />
                  {errors.team_email && (
                    <p className="text-sm text-destructive">
                      {t(errors.team_email.message as string)}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="team_phone">{t('team.forms.phone_number')}</Label>
                  <Input
                    id="team_phone"
                    type="tel"
                    value={watchedValues.team_phone}
                    {...register('team_phone', { onChange: handlePhoneChange })}
                    onKeyDown={handlePhoneKeyDown}
                    onPaste={handlePhonePaste}
                    placeholder="094-371-8956"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={12}
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
