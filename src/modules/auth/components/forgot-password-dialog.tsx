"use client"

import { PhoneInput } from "@/components/phone-input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/ui/atoms/button"
import { Input } from "@/ui/atoms/input"
import { Eye, EyeOff } from "lucide-react"
import { useCallback } from "react"

import { useForgotPasswordDialog } from "../hooks/use-forgot-password-dialog"

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ForgotPasswordDialog({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) {
  const {
    state,
    step,
    showPassword,
    showConfirmPassword,
    formError,
    actions,
    mutations,
  } = useForgotPasswordDialog()

  const handleClose = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        actions.reset()
      }
      onOpenChange(nextOpen)
    },
    [actions, onOpenChange],
  )

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      actions.setOtpValue(index, value)

      if (value && index < state.otp.length - 1) {
        const nextInput = document.querySelector(
          `input[name="otp-${index + 1}"]`,
        ) as HTMLInputElement | null
        nextInput?.focus()
      }
    },
    [actions, state.otp.length],
  )

  const renderContent = () => {
    switch (step) {
      case "select":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Forgot Password</h2>
              <p className="text-gray-600">
                Forgot your password? Reset it in seconds
              </p>
            </div>

            <Tabs
              value={state.method}
              onValueChange={(value: string) =>
                actions.setMethod(value as "phone" | "email")
              }
            >
              <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent">
                <TabsTrigger
                  value="phone"
                  className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
                >
                  Phone number
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
                >
                  Email
                </TabsTrigger>
              </TabsList>

              <form onSubmit={actions.handleSendOtp} className="mt-6 space-y-4">
                <TabsContent value="phone" className="mt-0">
                  <PhoneInput
                    international
                    defaultCountry="TH"
                    value={state.phone}
                    onChange={actions.setPhone}
                    className="w-full"
                    placeholder="99-902-0922"
                    required
                  />
                </TabsContent>

                <TabsContent value="email" className="mt-0">
                  <Input
                    type="email"
                    value={state.email}
                    onChange={(event) => actions.setEmail(event.target.value)}
                    placeholder="onecharge@gmail.com"
                    className="py-3"
                    required
                  />
                </TabsContent>

                {formError && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {formError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={mutations.forgotPassword.isPending}
                >
                  {mutations.forgotPassword.isPending ? "Sending..." : "Next"}
                </Button>
              </form>
            </Tabs>
          </div>
        )

      case "verify":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Verify OTP</h2>
              <p className="text-blue-600">
                {state.method === "phone" ? state.phone : state.email}
              </p>
              <p className="text-gray-600">
                Please enter the code received from{" "}
                {state.method === "phone" ? "phone SMS Number" : "email"}
              </p>
            </div>

            <form onSubmit={actions.handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-3">
                {state.otp.map((digit, index) => (
                  <Input
                    key={index}
                    name={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength={1}
                    value={digit}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    className="h-14 w-14 text-center text-xl font-semibold"
                    required
                  />
                ))}
              </div>

              {formError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  state.otp.join("").length !== 6 ||
                  mutations.verifyEmail.isPending ||
                  mutations.verifyPhone.isPending
                }
              >
                {mutations.verifyEmail.isPending || mutations.verifyPhone.isPending
                  ? "Verifying..."
                  : "Submit"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Code Sent. Resend Code in 00:50</p>
                <p>Ref: #2739</p>
              </div>
            </form>
          </div>
        )

      case "reset":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Create New Password</h2>
            </div>

            <form onSubmit={actions.handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-blue-600">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={state.password}
                    onChange={(event) => actions.setPassword(event.target.value)}
                    placeholder="••••••"
                    className="py-3 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={actions.togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={state.confirmPassword}
                    onChange={(event) =>
                      actions.setConfirmPassword(event.target.value)
                    }
                    placeholder="••••••"
                    className="py-3 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={actions.toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {formError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={
                  !state.password ||
                  !state.confirmPassword ||
                  state.password !== state.confirmPassword ||
                  mutations.resetPassword.isPending
                }
              >
                {mutations.resetPassword.isPending ? "Resetting..." : "Submit"}
              </Button>
            </form>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Forgot Password</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
