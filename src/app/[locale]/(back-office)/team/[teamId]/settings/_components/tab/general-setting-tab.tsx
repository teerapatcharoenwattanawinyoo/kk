'use client'

import ErrorDialog from '@/components/notifications/error-dialog'
import SuccessDialog from '@/components/notifications/success-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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
import { AlertTriangle, Loader2, Pencil, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { useTeamById, useUpdateTeam } from '../../../../_hooks/use-teams'

interface GeneralSettingProps {
  teamId: string
  onCancel: () => void
}

export const GeneralSettingTab = ({ teamId, onCancel }: GeneralSettingProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [teamNameError, setTeamNameError] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('th')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states for change detection
  const [formData, setFormData] = useState({
    team_name: '',
    team_email: '',
    team_phone: '',
    team_status: '',
  })
  const [originalData, setOriginalData] = useState<{
    team_name: string
    team_email: string
    team_phone: string
    team_status: string
  } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Dialog states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // ดึงข้อมูลทีมจาก hook
  const { team: teamData, isLoading, error } = useTeamById(teamId)
  const updateTeamMutation = useUpdateTeam()
  const queryClient = useQueryClient()

  // Load existing data into form
  useEffect(() => {
    if (teamData) {
      const data = {
        team_name: teamData.team_name || '',
        team_email: teamData.team_email || '',
        team_phone: teamData.team_phone || '',
        team_status: teamData.team_status || '',
      }
      setFormData(data)
      setOriginalData(data)
      setSelectedLanguage('th') // Default language
      setHasChanges(false)

      // แสดงรูปภาพที่มีอยู่แล้ว (ถ้ามี)
      if (teamData.team_icon_group) {
        setPreviewUrl(teamData.team_icon_group)
      }
    }
  }, [teamData])

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const dataChanged =
        formData.team_name !== originalData.team_name ||
        formData.team_email !== originalData.team_email ||
        formData.team_phone !== originalData.team_phone ||
        formData.team_status !== originalData.team_status ||
        selectedFile !== null || // File changes also count
        (Boolean(teamData?.team_icon_group) && !previewUrl) // Or removing existing image
      setHasChanges(dataChanged)
    }
  }, [formData, originalData, selectedFile, teamData?.team_icon_group, previewUrl])

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('ประเภทไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ PDF, PNG, JPG หรือ JPEG')
      setShowErrorDialog(true)
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('ไฟล์มีขนาดใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10MB')
      setShowErrorDialog(true)
      return
    }

    setSelectedFile(file)

    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }, [])

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
    if (previewUrl) {
      // ถ้าเป็น object URL ที่สร้างขึ้นใหม่ ให้ revoke
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
    }
  }, [previewUrl])

  const triggerFileInput = useCallback(() => {
    const input = document.getElementById('settings-file-input') as HTMLInputElement
    input?.click()
  }, [])

  const handleTeamNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFormData((prev) => ({ ...prev, team_name: value }))
      if (teamNameError && value.trim() !== '') {
        setTeamNameError('')
      }
    },
    [teamNameError],
  )

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, team_email: e.target.value }))
  }, [])

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, team_phone: e.target.value }))
  }, [])

  const handleStatusChange = useCallback((value: string) => {
    if (value) {
      setFormData((prev) => ({ ...prev, team_status: value }))
    }
  }, [])

  const handleLanguageChange = useCallback((language: string) => {
    setSelectedLanguage(language)
  }, [])

  const handleSuccessDialogConfirm = useCallback(() => {
    setShowSuccessDialog(false)
    void queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.TEAMS, 'list'],
      refetchType: 'inactive',
    })
  }, [queryClient, setShowSuccessDialog])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  // Error or team not found
  if (error || !teamData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">ไม่สามารถโหลดข้อมูลทีมได้</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTeamNameError('')

    const form = e.target as HTMLFormElement
    const formDataObj = new FormData(form)
    const teamName = formDataObj.get('name') as string

    if (!teamName || teamName.trim() === '') {
      setTeamNameError('Team name is required')
      setIsSubmitting(false)
      return
    }

    try {
      const updateData = {
        id: teamId,
        team_name: teamName,
        team_email: formDataObj.get('email') as string,
        team_phone: formDataObj.get('phone') as string,
        team_status: formDataObj.get('status') as 'publish' | 'draft' | 'inactive',
        file: selectedFile || undefined,
        team_img: selectedFile || undefined,
      }

      await updateTeamMutation.mutateAsync(updateData)

      setTimeout(() => {
        setSuccessMessage('อัปเดตข้อมูลทีมเรียบร้อยแล้ว')
        setShowSuccessDialog(true)
      }, 100)

      setHasChanges(false)
      setSelectedFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error('Error updating team:', error)

      setTimeout(() => {
        setErrorMessage('เกิดข้อผิดพลาดในการอัปเดตข้อมูล กรุณาลองอีกครั้ง')
        setShowErrorDialog(true)
      }, 100)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Warning Message */}
      {hasChanges && (
        <Alert className="border-oc-warning bg-oc-warning-soft/50 mb-6">
          <AlertTitle className="text-oc-warning">คำเตือน</AlertTitle>
          <AlertDescription className="text-oc-warning">
            มีการเปลี่ยนแปลงข้อมูล กรุณากดปุ่ม UPDATE เพื่อบันทึกการเปลี่ยนแปลง
          </AlertDescription>
        </Alert>
      )}

      {/* General Setting Header */}
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-foreground">General Setting</h2>
        <p className="text-sm text-muted-foreground">Update your profile team here</p>
      </div>

      {/* Form */}
      <form id="settings-form" onSubmit={handleSubmit}>
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Left Column - File Upload */}
              <div className="flex flex-1 items-start justify-center border-b pb-6 pt-2 md:pb-0 md:pt-4 lg:border-b-0 lg:border-r lg:pr-8">
                <div className="mt-0 w-[250px]">
                  {/* Hidden file input */}
                  <Input
                    id="settings-file-input"
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
                    className={`group relative flex h-[250px] w-[250px] cursor-pointer items-center justify-center rounded-xl border border-dashed shadow-sm ring-1 ring-border/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 ${
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
                      <div className="relative h-[250px] w-[250px] p-4">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={250}
                          height={250}
                          className="h-full w-full rounded-lg object-cover ring-1 ring-border"
                          unoptimized
                        />
                      </div>
                    ) : selectedFile ? (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-lg">
                          <UploadCloud className="text-success h-5 w-5" />
                        </div>
                        <p className="text-success max-w-[200px] truncate text-sm font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-success/80 text-xs">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile()
                          }}
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive/90"
                        >
                          Remove file
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="bg-primary/8 mx-auto flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-105">
                          <UploadCloud className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-primary">Upload Image</p>
                        <p className="text-xs text-muted-foreground"> PNG, JPG (≤ 10MB)</p>
                        <p className="text-[11px] text-muted-foreground/80">Drag & drop or click</p>
                      </div>
                    )}

                    {/* Subtle inner ring & shadow layer */}

                    {/* Hover overlay (full cover, sleek) */}
                    <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center rounded-xl bg-gradient-to-t from-muted-foreground/60 to-muted-foreground/50 text-white opacity-0 transition-all duration-200 group-hover:opacity-100">
                      <Pencil className="mb-1 h-5 w-5 text-white" />
                      <span className="text-xs font-medium">
                        {previewUrl || selectedFile ? 'เปลี่ยนรูปภาพ' : 'อัพโหลดรูปภาพ'}
                      </span>
                    </div>

                    {isDragging && (
                      <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-xl bg-primary/10">
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
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter team name"
                    value={formData.team_name}
                    className={`${teamNameError ? 'border-destructive' : ''}`}
                    onChange={handleTeamNameChange}
                  />
                  {teamNameError && <p className="text-sm text-destructive">{teamNameError}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.team_email}
                    onChange={handleEmailChange}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.team_phone}
                    onChange={handlePhoneChange}
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.team_status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="publish">Publish</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end space-x-3 border-t border-muted pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="px-6">
            CANCEL
          </Button>
          <Button
            form="settings-form"
            type="submit"
            variant={'success'}
            disabled={!hasChanges || isSubmitting || updateTeamMutation.isPending}
            className="px-6"
          >
            {isSubmitting || updateTeamMutation.isPending ? 'กำลังอัปเดต...' : 'UPDATE'}
          </Button>
        </div>
      </form>

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="สำเร็จ"
        message={successMessage}
        buttonText="ตกลง"
        onButtonClick={handleSuccessDialogConfirm}
      />

      {/* Error Dialog */}
      <ErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        title="เกิดข้อผิดพลาด"
        message={errorMessage}
        buttonText="ตกลง"
      />
    </div>
  )
}
