'use client'

import { UploadProfile } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react' // Assuming lucide-react for icons
import Image from 'next/image' // If you plan to show a preview
import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { CreateProfileFormSchema } from '../_schemas/create-profile.schema'
import { createProfileAction } from '../_server/create-profile.action'

export default function CreateProfile() {
  const [profileName, setProfileName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  type ActionState = { ok?: boolean; error?: string }
  const [state, formAction] = useActionState<ActionState, FormData>(
    createProfileAction as any,
    {} as ActionState,
  )

  // reflect server action result into UI
  useEffect(() => {
    if (!state) return
    if (state.error) {
      setFormErrors({ general: state.error })
    }
  }, [state])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(URL.createObjectURL(event.target.files[0]))
    }
  }

  return (
    <>
      <Card className="w-full max-w-md border-0 shadow-none">
        <CardHeader className="pb-8 text-center">
          <CardTitle className="text-4xl font-bold text-[#232323]">
            Create Password , Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={formAction}
            className="space-y-6"
            onSubmit={(e) => {
              // Validate before submitting
              const result = CreateProfileFormSchema.safeParse({
                profilename: profileName,
                password,
                confirmPassword,
              })
              if (!result.success) {
                e.preventDefault()
                const errors: { [key: string]: string } = {}
                result.error.errors.forEach((err: any) => {
                  if (err.path[0]) errors[err.path[0] as string] = err.message
                })
                setFormErrors(errors)
                return
              }
              setFormErrors({})
            }}
          >
            <div className="mb-8 flex justify-center">
              <Label
                htmlFor="profile-picture"
                className="relative flex h-[124px] w-[124px] cursor-pointer items-center justify-center rounded-full border border-[#D9D9D9] bg-[#F9F9F9] transition-colors hover:bg-[#f0f0f0]"
              >
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile Preview"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                ) : (
                  <UploadProfile />
                )}
                <Input
                  id="profile-picture"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileName" className="sr-only">
                Profile name
              </Label>
              <Input
                id="profileName"
                name="profilename"
                type="text"
                placeholder="Profile name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className={`h-12 rounded-lg ${formErrors.profilename ? 'border-destructive' : ''}`}
                required
              />
              {formErrors.profilename && (
                <p className="text-sm text-destructive">{formErrors.profilename}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-12 rounded-lg pr-10 ${formErrors.password ? 'border-destructive' : ''}`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-destructive">{formErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`h-12 rounded-lg pr-10 ${formErrors.confirmPassword ? 'border-destructive' : ''}`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-sm text-destructive">{formErrors.confirmPassword}</p>
              )}
            </div>

            {/* General error */}
            {formErrors.general && <p className="text-sm text-destructive">{formErrors.general}</p>}

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant={'default'} className="h-12 w-full rounded-lg" disabled={pending}>
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Submitting...
        </span>
      ) : (
        'Submit'
      )}
    </Button>
  )
}
