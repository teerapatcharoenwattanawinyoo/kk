'use client'

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
import { useTeamById, useUpdateTeam } from '@/modules/teams/hooks/use-teams'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

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

  // ดึงข้อมูลทีมจาก hook
  const { team: teamData, isLoading, error } = useTeamById(teamId)
  const updateTeamMutation = useUpdateTeam()

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
      toast.error('ประเภทไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ PDF, PNG, JPG หรือ JPEG')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ไฟล์มีขนาดใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10MB')
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

      // แสดง success toast หลังจาก render cycle เสร็จ
      setTimeout(() => {
        toast.success('อัปเดตข้อมูลทีมเรียบร้อยแล้ว')
      }, 100)

      setHasChanges(false)
      setSelectedFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error('Error updating team:', error)

      // แสดง error toast หลังจาก render cycle เสร็จ
      setTimeout(() => {
        toast.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล กรุณาลองอีกครั้ง')
      }, 100)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Warning Message */}
      {hasChanges && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              มีการเปลี่ยนแปลงข้อมูล กรุณากดปุ่ม UPDATE เพื่อบันทึกการเปลี่ยนแปลง
            </span>
          </div>
        </div>
      )}

      {/* General Setting Header */}
      <div className="mb-6">
        <h2 className="text-title mb-2 text-lg font-semibold">General Setting</h2>
        <p className="text-sm text-muted-foreground">Update your profile team here</p>
      </div>

      {/* Form */}
      <form id="settings-form" onSubmit={handleSubmit}>
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
                  <Input
                    id="settings-file-input"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileInput}
                    className="hidden"
                  />

                  {/* Upload area */}
                  <div
                    className={`flex h-[181px] w-[181px] cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed transition-all ${
                      isDragging
                        ? 'border-primary bg-primary/5'
                        : selectedFile
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-muted bg-muted/30'
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
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile()
                          }}
                          size="sm"
                          variant="outline"
                          className="absolute right-2 top-2 h-7 w-7 rounded-full p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : selectedFile ? (
                      // File selected (non-image)
                      <div className="space-y-2 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
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
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile()
                          }}
                          className="text-xs text-destructive hover:text-destructive/90"
                        >
                          Remove file
                        </Button>
                      </div>
                    ) : (
                      // Default upload state
                      <div className="space-y-2 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-primary"
                          >
                            <path d="M17 0H3C2.20435 0 1.44129 0.316071 0.87868 0.87868C0.316071 1.44129 0 2.20435 0 3V17C0 17.7956 0.316071 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H17C17.1645 19.9977 17.3284 19.981 17.49 19.95L17.79 19.88H17.86H17.91L18.28 19.74L18.41 19.67C18.51 19.61 18.62 19.56 18.72 19.49C18.8535 19.3918 18.9805 19.2849 19.1 19.17L19.17 19.08C19.2682 18.9805 19.3585 18.8735 19.44 18.76L19.53 18.63C19.5998 18.5187 19.6601 18.4016 19.71 18.28C19.7374 18.232 19.7609 18.1818 19.78 18.13C19.83 18.01 19.86 17.88 19.9 17.75V17.6C19.9567 17.4046 19.9903 17.2032 20 17V3C20 2.20435 19.6839 1.44129 19.1213 0.87868C18.5587 0.316071 17.7956 0 17 0ZM3 18C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V12.69L5.29 9.39C5.38296 9.29627 5.49356 9.22188 5.61542 9.17111C5.73728 9.12034 5.86799 9.0942 6 9.0942C6.13201 9.0942 6.26272 9.12034 6.38458 9.17111C6.50644 9.22188 6.61704 9.29627 6.71 9.39L15.31 18H3ZM18 17C17.9991 17.1233 17.9753 17.2453 17.93 17.36C17.9071 17.4087 17.8804 17.4556 17.85 17.5C17.8232 17.5423 17.7931 17.5825 17.76 17.62L12.41 12.27L13.29 11.39C13.383 11.2963 13.4936 11.2219 13.6154 11.1711C13.7373 11.1203 13.868 11.0942 14 11.0942C14.132 11.0942 14.2627 11.1203 14.3846 11.1711C14.5064 11.2219 14.617 11.2963 14.71 11.39L18 14.69V17ZM18 11.86L16.12 10C15.5477 9.45699 14.7889 9.15428 14 9.15428C13.2111 9.15428 12.4523 9.45699 11.88 10L11 10.88L8.12 8C7.54772 7.45699 6.7889 7.15428 6 7.15428C5.2111 7.15428 4.45228 7.45699 3.88 8L2 9.86V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H17C17.2652 2 17.5196 2.10536 17.7071 2.29289C17.8946 2.48043 18 2.73478 18 3V11.86ZM11.5 4C11.2033 4 10.9133 4.08797 10.6666 4.2528C10.42 4.41762 10.2277 4.65189 10.1142 4.92597C10.0006 5.20006 9.97094 5.50166 10.0288 5.79264C10.0867 6.08361 10.2296 6.35088 10.4393 6.56066C10.6491 6.77044 10.9164 6.9133 11.2074 6.97118C11.4983 7.02906 11.7999 6.99935 12.074 6.88582C12.3481 6.77229 12.5824 6.58003 12.7472 6.33335C12.912 6.08668 13 5.79667 13 5.5C13 5.10218 12.842 4.72064 12.5607 4.43934C12.2794 4.15804 11.8978 4 11.5 4Z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          Choose PDF, PNG, JPG File
                        </p>
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
    </div>
  )
}
