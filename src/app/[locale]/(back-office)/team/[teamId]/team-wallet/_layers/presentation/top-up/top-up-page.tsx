'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { TeamHeader } from '@/app/[locale]/(back-office)/team/_components/team-header'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@ui'
import { ChevronLeft, Smartphone } from 'lucide-react'

import { TopUpTransaction } from '../../../_components/team-wallet/top-up-transaction-list'

import { type TopUpPresetAmount } from '../../../_schemas/top-up.schema'
import { topUpPresetAmountsMock } from '../../../mock/top-up.mock'

interface TopUpPageProps {
  teamId: string
  locale: string
  presetAmounts?: TopUpPresetAmount[]
}

const MIN_TOP_UP_AMOUNT = 300
const MAX_TOP_UP_AMOUNT = 70000

export function TopUpPage({
  teamId,
  locale,
  presetAmounts = topUpPresetAmountsMock,
}: TopUpPageProps) {
  const router = useRouter()

  const [amount, setAmount] = useState<number>(presetAmounts?.[0] ?? MIN_TOP_UP_AMOUNT)

  const THB = useMemo(
    () => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }),
    [],
  )

  const handleContinue = () => {
    router.push(`/${locale}/team/${teamId}/team-wallet/top-up/checkout?amount=${amount}`)
  }

  const disableContinue = amount < MIN_TOP_UP_AMOUNT || amount > MAX_TOP_UP_AMOUNT

  return (
    <div className="space-y-6 p-4">
      <TeamHeader teamId={teamId} pageTitle="Team-Wallet" />
      <div className="flex-1">
        <div className="shadow-xs rounded-lg border bg-card">
          <div className="p-4 md:p-6">
            <div className="border-b">
              <div className="flex items-center gap-6 pb-4">
                <Link href={`/${locale}/team/${teamId}/team-wallet`}>
                  <Button
                    className="h-8 w-8 rounded-full bg-muted lg:h-9 lg:w-9"
                    variant={'ghost'}
                    size={'icon'}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                </Link>

                <h2 className="text-oc-title-secondary text-2xl font-semibold">Top-Up</h2>
              </div>
            </div>
            <div className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-12">
              <section className="space-y-4 lg:col-span-7">
                <Card className="bg-primary text-primary-foreground">
                  <CardHeader className="sr-only">
                    <CardTitle className="text-lg">ช่องทางเติมเงิน</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <RadioGroup defaultValue="online" className="grid gap-3 sm:grid-cols-2">
                      <label
                        className="flex w-full cursor-pointer items-start gap-4 rounded-xl p-4"
                        htmlFor="m-online"
                      >
                        <RadioGroupItem
                          id="m-online"
                          value="online"
                          className="mt-1 border-primary-foreground data-[state=checked]:border-white data-[state=checked]:text-white"
                        />
                        <div className="flex items-start gap-4">
                          <Smartphone className="h-10 w-10" />
                          <div className="leading-tight">
                            <div className="text-base font-semibold">ออนไลน์</div>
                            <div className="text-xs text-primary-foreground/80 sm:text-sm/5">
                              รองรับบัตรเครดิต/เดบิต, โอน และ QR PromptPay
                            </div>
                          </div>
                        </div>
                      </label>
                    </RadioGroup>
                  </CardContent>
                </Card>
                <TopUpTransaction teamId={teamId} />
              </section>
              <aside className="px-10 py-10 lg:col-span-5">
                <div className="sticky top-20 space-y-4">
                  <Card className="border-none shadow-none">
                    <CardHeader className="sr-only">
                      <CardTitle className="text-lg">ยอดชำระ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount-input" className="sr-only">
                          จำนวนเงิน
                        </Label>
                        <Input
                          id="amount-input"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={Number.isFinite(amount) ? amount.toString() : ''}
                          placeholder="0"
                          onChange={(event) => {
                            const n = Number(event.target.value.replace(/[^0-9]/g, ''))
                            setAmount(Number.isFinite(n) ? n : 0)
                          }}
                          className="h-14 bg-muted text-center text-2xl font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {presetAmounts.map((value) => {
                          const selected = amount === value
                          return (
                            <Button
                              key={value}
                              type="button"
                              variant={selected ? 'default' : 'outline'}
                              className="h-20 border border-primary font-normal"
                              onClick={() => setAmount(value)}
                            >
                              {value.toLocaleString('th-TH')}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        className="h-11 w-full"
                        disabled={disableContinue}
                        onClick={handleContinue}
                      >
                        Continue
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        {`ยอดขั้นต่ำ ${THB.format(MIN_TOP_UP_AMOUNT)} และยอดสูงสุด ${THB.format(MAX_TOP_UP_AMOUNT)}`}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
