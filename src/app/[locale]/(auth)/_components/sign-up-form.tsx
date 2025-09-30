'use client'
import { registerByEmailAction, registerByPhoneAction } from '@/app/[locale]/(auth)/_actions'
import { PolicyDialog } from '@/app/[locale]/(auth)/_components'
import { PhoneFormSchema, SignUpFormSchema } from '@/app/[locale]/(auth)/_schemas'
import { PhoneInput } from '@/components/phone-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocale } from '@/hooks'
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js'
import { ArrowLeft, ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

// Example country data
const countries = [{ value: 'TH', label: 'Thai' }]

function toNationalPhone(phone: string, country: string = 'TH') {
  // country อาจเป็น "" ได้ ให้ fallback เป็น "TH"
  const countryCode = (country || 'TH') as CountryCode
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode)
  // คืนค่าเฉพาะตัวเลข (เช่น 0943718956)
  return phoneNumber ? phoneNumber.formatNational().replace(/\D/g, '') : phone
}

export default function SignUpForm() {
  const router = useRouter()
  const { localizePath, locale } = useLocale()
  console.log('Current locale:', locale)
  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('email')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [phoneValue, setPhoneValue] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false)
  const [error, setError] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  const filteredCountries = countries.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    let result
    if (activeTab === 'email') {
      result = SignUpFormSchema.safeParse({
        email,
        country,
        acceptedTerms,
      })
    } else {
      result = PhoneFormSchema.safeParse({
        phone: phoneValue,
        country,
        acceptedTerms,
      })
    }

    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }

    startTransition(async () => {
      try {
        if (activeTab === 'email') {
          console.log('Calling registerByEmailAction...')
          const response = await registerByEmailAction({
            email,
            country_code: country,
          })
          console.log('Response from registerByEmailAction:', response)

          if (response.success && response.redirectTo) {
            const redirectPath = localizePath(response.redirectTo)
            console.log('Redirecting to:', redirectPath)
            // Also try hardcoded path for testing
            console.log('Trying hardcoded path: /en/verify-email')
            router.push('/en/verify-email')
          } else if (!response.success) {
            console.log('Registration failed:', response.message)
            setError(response.message || 'Registration failed')
          }
        } else {
          console.log('Calling registerByPhoneAction...')
          const response = await registerByPhoneAction({
            phone: toNationalPhone(phoneValue, country),
            country_code: country,
          })
          console.log('Response from registerByPhoneAction:', response)

          if (response.success && response.redirectTo) {
            const redirectPath = localizePath(response.redirectTo)
            console.log('Redirecting to:', redirectPath)
            router.push(redirectPath)
          } else if (!response.success) {
            console.log('Registration failed:', response.message)
            setError(response.message || 'Registration failed')
          }
        }
      } catch (err) {
        console.error('Error in handleSubmit:', err)
        setError('Registration failed')
      }
    })
  }

  const handleCheckboxClick = () => {
    if (!acceptedTerms) {
      // If not already accepted, open the dialog
      setPolicyDialogOpen(true)
    } else {
      // If already accepted, allow unchecking
      setAcceptedTerms(false)
    }
  }

  const handleAcceptPolicy = () => {
    setAcceptedTerms(true)
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none">
      <CardHeader className="px-0 pb-6">
        <CardTitle className="text-4xl font-bold">Sign Up</CardTitle>
        <CardDescription>Empower your experience, sign up for a free account today</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-0">
        {/* Tab Toggle */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'phone' | 'email')}>
          <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent">
            <TabsTrigger
              value="phone"
              className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
            >
              Phone
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
            >
              Email
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Input */}
          {activeTab === 'phone' && (
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm text-muted-foreground">
                Phone number
              </Label>
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
          )}

          {/* Email Input */}
          {activeTab === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12"
                required
              />
            </div>
          )}

          {/* Country Select */}
          <div className="space-y-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-auto w-full justify-between py-3.5 hover:bg-transparent"
                >
                  <p className="text-left font-normal text-muted-foreground">
                    {country
                      ? countries.find((c) => c.value === country)?.label || 'Select your country'
                      : 'Select your country'}
                  </p>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full p-5 sm:max-w-md">
                <div className="mb-4 flex items-center gap-2">
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-[#F4F4F4]"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </Button>
                  </SheetClose>
                </div>
                <div className="">
                  <SheetTitle>Select your country</SheetTitle>
                  <p className="text-sm text-muted-foreground">for sign in OneCharge Application</p>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#515151]" />
                  <Input
                    placeholder="Search"
                    className="rounded-full bg-[#E8E6EA] pl-9 placeholder:text-[#B0B0B0]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  {filteredCountries.map((c) => {
                    const isChecked = country === c.value
                    return (
                      <div
                        key={c.value}
                        className="flex items-center space-x-2 border-b px-1 py-2"
                        onClick={() => setCountry(c.value)}
                      >
                        <Checkbox
                          id={`country-${c.value}`}
                          checked={isChecked}
                          onCheckedChange={() => setCountry(c.value)}
                          className="rounded-full border-[#E4E4E4] data-[state=checked]:border-[#0DBE34] data-[state=checked]:bg-[#0DBE34] data-[state=checked]:text-white"
                        />
                        <Label
                          htmlFor={`country-${c.value}`}
                          className={`w-full cursor-pointer ${
                            isChecked ? 'text-primary' : 'text-[#717171]'
                          }`}
                        >
                          {c.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={handleCheckboxClick}
              className="data-[state=checked]:bg-success data-[state=checked]:border-success-dark mt-0.5 rounded-full border-muted-foreground"
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer text-sm leading-5 text-muted-foreground"
              onClick={handleCheckboxClick}
            >
              I accept the{' '}
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary underline"
                onClick={(e) => {
                  e.stopPropagation()
                  setPolicyDialogOpen(true)
                }}
              >
                Privacy Policy
              </Button>{' '}
              and{' '}
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary underline"
                onClick={(e) => {
                  e.stopPropagation()
                  setPolicyDialogOpen(true)
                }}
              >
                Terms Condition
              </Button>
            </Label>
          </div>

          {/* Next Button */}
          <Button
            type="submit"
            variant={'default'}
            className="h-12 w-full font-medium"
            disabled={
              activeTab === 'email'
                ? !email || !acceptedTerms || country === '' || isPending
                : !phoneValue || !acceptedTerms || country === '' || isPending
            }
          >
            {isPending ? 'Loading...' : 'Next'}
          </Button>

          {/* Divider */}
          {/* <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">
                or
              </span>
            </div>
          </div> */}

          {/* Google Sign Up */}
          {/* <Button
            type="button"
            variant="outline"
            className="h-12 w-full font-medium"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
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
            Sign up with Google
          </Button> */}
        </form>

        {/* Sign In Link */}
        <div className="text-left">
          <p className="text-sm text-muted-foreground">
            You have an account?{' '}
            <Button variant="link" size="sm" className="h-auto px-0 font-medium text-primary">
              <Link href={'/sign-in'}>Sign in</Link>
            </Button>
          </p>
        </div>
      </CardContent>

      {/* Policy Dialog */}
      <PolicyDialog
        open={policyDialogOpen}
        onOpenChange={setPolicyDialogOpen}
        onAccept={handleAcceptPolicy}
      />
    </Card>
  )
}
