'use client'

import { PhoneInput } from '@/components/phone-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useI18n } from '@/lib/i18n'
import { formatPhoneForAPI } from '@/lib/utils/phone'
import { useLogin } from '@/modules/auth/hooks/use-auth'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import ForgotPasswordDialog from './forgot-password-dialog'

export default function SignInForm() {
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [phoneValue, setPhoneValue] = useState<string>('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const { t } = useI18n()
  const loginMutation = useLogin()

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      const loginData = {
        ...(activeTab === 'phone'
          ? { phone: formatPhoneForAPI(phoneValue) }
          : { email }),
        password,
      }

      console.log('Login data:', loginData) // Debug log
      loginMutation.mutate(loginData)
    },
    [activeTab, phoneValue, email, password, loginMutation],
  )

  return (
    <Card className="w-full max-w-xl border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-4xl font-bold">
          {t('auth.sign_in')}
        </CardTitle>
        <CardDescription className="font-normal text-[#969696]">
          {t('auth.please_login_to_continue')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-0">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'phone' | 'email')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent">
            <TabsTrigger
              value="phone"
              className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
            >
              {t('auth.phone')}
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
            >
              {t('auth.email')}
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <TabsContent value="phone" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.phone_number')}</Label>
                <PhoneInput
                  international
                  defaultCountry="TH"
                  value={phoneValue}
                  onChange={setPhoneValue}
                  className="w-full"
                  id="phone"
                  name="phone"
                  placeholder="99-902-0922"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="email" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="py-6"
                  required
                />
              </div>
            </TabsContent>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.password')}
                  className="py-6 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto px-0"
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                >
                  <p className="font-normal text-muted-foreground transition-all hover:text-primary">
                    {t('auth.forgot_password')}
                  </p>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="keep-logged-in"
                className="rounded-xl border-muted-foreground"
                checked={keepLoggedIn}
                onCheckedChange={(checked) =>
                  setKeepLoggedIn(checked as boolean)
                }
              />
              <Label
                htmlFor="keep-logged-in"
                className="cursor-pointer text-sm font-normal"
              >
                {t('auth.remember_me')}
              </Label>
            </div>

            {loginMutation.error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'}
              </div>
            )}

            <Button
              type="submit"
              className="h-12 w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('auth.signing')}
                </>
              ) : (
                t('auth.sign_in')
              )}
            </Button>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-sm text-muted-foreground">
                  {t('auth.or')}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full font-medium"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <p className="font-normal">{t('auth.sign_in_with_google')}</p>
            </Button>
          </form>

          <div className="mt-6 text-start">
            <p className="text-sm text-[#969696]">
              {t('auth.need_an_account')}{' '}
              <Link
                href={'/sign-up'}
                className="h-auto px-0 text-sm font-medium text-primary underline hover:text-primary/80"
              >
                {t('auth.create_one')}
              </Link>
            </p>
          </div>
        </Tabs>
      </CardContent>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </Card>
  )
}
