"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { TeamHeader } from "@/components/back-office/team/team-header";
import { CoinSolid } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, Download, Smartphone } from "lucide-react";
import Link from "next/link";

interface PaymentPageProps {
  teamId: string;
  locale: string;
}

const PRESET_AMOUNTS = [
  300, 500, 700, 3000, 5000, 7000, 30000, 50000, 70000,
] as const;

export function TopUpPage({ teamId, locale }: PaymentPageProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(300);
  const THB = useMemo(
    () =>
      new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }),
    [],
  );

  const appendDigit = (d: number) =>
    setAmount((prev) => {
      const base = Number.isFinite(prev) ? String(prev ?? 0) : "0";
      const nextNum = Number(`${base === "0" ? "" : base}${d}`);
      return Number.isFinite(nextNum) ? nextNum : prev;
    });

  const backspace = () =>
    setAmount((prev) => {
      const base = Number.isFinite(prev) ? String(prev ?? 0) : "0";
      const chopped = base.length > 1 ? base.slice(0, -1) : "0";
      return Number(chopped);
    });

  const clearAmount = () => setAmount(0);

  const handleContinue = () => {
    // Navigate to payment method selection page with amount
    router.push(
      `/${locale}/team/${teamId}/team-wallet/top-up/checkout?amount=${amount}`,
    );
  };

  const txGroups = [
    {
      date: "20 Nov 2025",
      items: [
        {
          id: "0x0000030",
          title: "Top up",
          datetime: "20/11/2025 17:35 PM",
          amount: 3220,
          channel: "PromptPay",
        },
        {
          id: "0x0000029",
          title: "Top up",
          datetime: "20/11/2025 13:36 PM",
          amount: 220,
          channel: "PromptPay",
        },
      ],
    },
    {
      date: "19 Nov 2025",
      items: [
        {
          id: "0x0000028",
          title: "Top up",
          datetime: "19/11/2025 17:35 PM",
          amount: 220,
          channel: "PromptPay",
        },
      ],
    },
  ] as const;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <TeamHeader teamId={teamId} pageTitle="Team-Wallet" />
      <div className="flex-1 px-4 py-4 md:px-6">
        <div className="shadow-xs rounded-lg border bg-card">
          <div className="p-4 md:p-6">
            <div className="border-b">
              <div className="flex items-center gap-6 pb-4">
                <Link href={`/${locale}/team/${teamId}/team-wallet`}>
                  <Button
                    className="h-8 w-8 rounded-full bg-muted lg:h-9 lg:w-9"
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                </Link>

                <h2 className="text-title text-2xl font-semibold">Top-Up</h2>
              </div>
            </div>
            <div className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-12">
              <section className="space-y-4 lg:col-span-7">
                <Card className="bg-primary text-primary-foreground">
                  <CardHeader className="sr-only">
                    <CardTitle className="text-lg">ช่องทางเติมเงิน</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <RadioGroup
                      defaultValue="online"
                      className="grid gap-3 sm:grid-cols-2"
                    >
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
                            <div className="text-base font-semibold">
                              ออนไลน์
                            </div>
                            <div className="text-xs text-primary-foreground/80 sm:text-sm/5">
                              รองรับบัตรเครดิต/เดบิต, โอน และ QR PromptPay
                            </div>
                          </div>
                        </div>
                      </label>
                    </RadioGroup>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-none">
                  <div className="flex items-center justify-between px-6 pt-5">
                    <h3 className="text-lg font-semibold">Transaction</h3>
                  </div>
                  <CardContent className="pb-6 pt-2">
                    <div className="space-y-6">
                      {txGroups.map((group) => (
                        <div key={group.date} className="space-y-3">
                          <div className="px-1 text-xs text-muted-foreground">
                            {group.date}
                          </div>
                          <div className="space-y-3">
                            {group.items.map((tx) => (
                              <div
                                key={tx.id}
                                className="flex items-center justify-between gap-4 rounded-xl border-none bg-muted/50 p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-muted">
                                    <CoinSolid className="size-4" />
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      {tx.title}
                                    </div>
                                    <div className="mt-8 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                                      <span>{tx.datetime}</span>
                                      <span className="hidden sm:inline">
                                        |
                                      </span>
                                      <span>ID: {tx.id}</span>
                                      <span className="hidden sm:inline">
                                        |
                                      </span>
                                      <span>{tx.channel}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                  <div className="text-right font-semibold text-emerald-600">
                                    +{tx.amount.toLocaleString("th-TH")} ฿
                                  </div>
                                  <Button
                                    variant={"darkwhite"}
                                    size={"sm"}
                                    className="rounded-full text-xs"
                                  >
                                    <Download className="mr-2 h-4 w-4 text-xs" />
                                    ดาวน์โหลดใบเสร็จ
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
                          value={amount ? amount.toString() : ""}
                          placeholder="0"
                          onChange={(e) => {
                            const n = Number(
                              e.target.value.replace(/[^0-9]/g, ""),
                            );
                            setAmount(Number.isFinite(n) ? n : 0);
                          }}
                          className="h-14 bg-muted text-center text-2xl font-semibold"
                        />
                      </div>

                      {/* Preset amount buttons */}
                      <div className="grid grid-cols-3 gap-3">
                        {PRESET_AMOUNTS.map((v) => {
                          const selected = amount === v;
                          return (
                            <Button
                              key={v}
                              type="button"
                              variant={selected ? "default" : "outline"}
                              className="h-20 border border-primary font-normal"
                              onClick={() => setAmount(v)}
                            >
                              {v.toLocaleString("th-TH")}
                            </Button>
                          );
                        })}
                      </div>

                      {/* Submit button */}
                      <Button
                        className="h-11 w-full"
                        disabled={amount < 300 || amount > 70000}
                        onClick={handleContinue}
                      >
                        Continue
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
