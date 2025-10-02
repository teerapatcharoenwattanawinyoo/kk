'use client'

import { useMemo } from 'react'

import { CoinSolid } from '@/components/icons'
import { Button, Card, CardContent, ScrollArea, Skeleton } from '@ui'
import { Download } from 'lucide-react'

import { useTopUpTransactionsQuery } from '../../_hooks/use-team-wallet-query'

interface TopUpTransactionProps {
  teamId: string
}

export function TopUpTransaction({ teamId }: TopUpTransactionProps) {
  const { data, isLoading } = useTopUpTransactionsQuery({
    teamId,
    params: {
      page: 1,
      limit: 50, // Get more items for scrolling
    },
  })

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    if (!data?.data.items) return []

    const groups = new Map<string, typeof data.data.items>()

    data.data.items.forEach((item) => {
      // Format date from ISO string to readable format
      const date = new Date(item.created_at)
      const dateKey = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      if (!groups.has(dateKey)) {
        groups.set(dateKey, [])
      }
      groups.get(dateKey)?.push(item)
    })

    return Array.from(groups.entries()).map(([date, items]) => ({
      date,
      items,
    }))
  }, [data?.data.items])

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      promptpay: 'PromptPay',
      credit_card: 'บัตรเครดิต',
      debit_card: 'บัตรเดบิต',
      bank_transfer: 'โอนเงิน',
    }
    return methods[method] || method
  }

  if (isLoading) {
    return (
      <Card className="border-none shadow-none">
        <div className="flex items-center justify-between px-6 pt-5">
          <h3 className="text-lg font-semibold">Transaction</h3>
        </div>
        <CardContent className="pb-6 pt-2">
          <div className="space-y-6">
            {/* Skeleton for date group 1 */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Skeleton className="size-7 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-8 w-32 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skeleton for date group 2 */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <Skeleton className="size-7 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-8 w-32 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!groupedTransactions.length) {
    return (
      <Card className="border-none shadow-none">
        <div className="flex items-center justify-between px-6 pt-5">
          <h3 className="text-lg font-semibold">Transaction</h3>
        </div>
        <CardContent className="pb-6 pt-2">
          <div className="flex h-[600px] items-center justify-center text-muted-foreground">
            ไม่มีประวัติการเติมเงิน
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-none">
      <div className="flex items-center justify-between px-6 pt-5">
        <h3 className="text-lg font-semibold">Transaction</h3>
      </div>
      <CardContent className="pb-6 pt-2">
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {groupedTransactions.map((group) => (
              <div key={group.date} className="space-y-3">
                <div className="px-1 text-xs text-muted-foreground">{group.date}</div>
                <div className="space-y-3">
                  {group.items.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between gap-4 rounded-xl border bg-muted/40 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid size-7 place-items-center rounded-full bg-muted">
                          <CoinSolid className="size-4" />
                        </div>
                        <div>
                          <div className="font-medium">เติมเงินเข้า Wallet</div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                            <span>{formatDateTime(tx.created_at)}</span>
                            <span className="hidden sm:inline">|</span>
                            <span>ID: {tx.code}</span>
                            <span className="hidden sm:inline">|</span>
                            <span>{formatPaymentMethod(tx.payment_method)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <div className="text-success text-right font-semibold">
                          +{tx.amount.toLocaleString('th-TH')} ฿
                        </div>

                        {tx.slip_file_path && (
                          <Button
                            variant={'darkwhite'}
                            size={'sm'}
                            className="rounded-full text-xs"
                            onClick={() => window.open(tx.slip_file_path ?? '', '_blank')}
                          >
                            <Download className="mr-2 h-4 w-4 text-xs" />
                            ดาวน์โหลดใบเสร็จ
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
