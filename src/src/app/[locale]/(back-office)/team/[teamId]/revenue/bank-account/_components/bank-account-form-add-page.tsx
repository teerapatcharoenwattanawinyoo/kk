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
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import type { IBankListItem } from '@/lib/schemas/bank.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  BANK_QUERY_KEYS,
  useBankLists,
  useCreateBankAccount,
} from '../_hooks/use-bank'

const bankAccountSchema = z.object({
  bank_id: z.string().min(1, 'กรุณาเลือกธนาคาร'),
  account_name: z.string().min(1, 'กรุณาระบุชื่อบัญชี'),
  account_number: z.string().min(10, 'กรุณาระบุเลขบัญชีให้ถูกต้อง'),
  is_primary: z.boolean().default(false),
})

type BankAccountFormData = z.infer<typeof bankAccountSchema>

interface BankAccountFormAddPageProps {
  teamId: string
  locale: string
}

export const BankAccountFormAddPage = ({
  teamId,
  locale,
}: BankAccountFormAddPageProps) => {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data: bankListsResponse, isLoading: bankListsLoading } =
    useBankLists()
  const createBankAccountMutation = useCreateBankAccount()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const isSubmittingRef = useRef(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bank_id: '',
      account_name: '',
      account_number: '',
      is_primary: false,
    },
    mode: 'onChange',
  })

  const bankLists = useMemo(
    () => bankListsResponse?.data || [],
    [bankListsResponse?.data],
  )

  const handleBack = useCallback(() => {
    router.push(`/${locale}/team/${teamId}/revenue/bank-account/manage`)
  }, [router, locale, teamId])

  // File handling
  const triggerFileInput = useCallback(() => {
    const input = document.getElementById('bank-file-input') as HTMLInputElement
    input?.click()
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Simple file validation
      const maxSize = 5 * 1024 * 1024 // 5MB (ลดจาก 10MB)
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/pdf',
      ]

      if (file.size > maxSize) {
        toast({
          title: 'ข้อผิดพลาด',
          description: 'ไฟล์มีขนาดใหญ่เกิน 5MB กรุณาลดขนาดไฟล์แล้วลองอีกครั้ง',
          variant: 'destructive',
        })
        return
      }

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'ข้อผิดพลาด',
          description: 'รองรับเฉพาะไฟล์ JPG, PNG และ PDF เท่านั้น',
          variant: 'destructive',
        })
        return
      }

      setSelectedFile(file)
      toast({
        title: 'สำเร็จ',
        description: 'อัพโหลดไฟล์เรียบร้อย',
      })
    },
    [toast],
  )

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null)
    const input = document.getElementById('bank-file-input') as HTMLInputElement
    if (input) {
      input.value = ''
    }
  }, [])

  const onSubmit = useCallback(
    async (data: BankAccountFormData) => {
      if (createBankAccountMutation.isPending || isSubmittingRef.current) {
        return
      }

      if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'ข้อผิดพลาด',
          description: 'ไฟล์มีขนาดใหญ่เกิน 5MB กรุณาลดขนาดไฟล์แล้วลองอีกครั้ง',
          variant: 'destructive',
        })
        return
      }

      isSubmittingRef.current = true

      const formData = {
        ...data,
        bank_id: parseInt(data.bank_id),
        file: selectedFile || undefined,
      }

      createBankAccountMutation.mutate(formData, {
        onSuccess: () => {
          router.push(`/${locale}/team/${teamId}/revenue/bank-account/manage`)

          // Force refetch หลัง navigate
          setTimeout(() => {
            queryClient.refetchQueries({
              queryKey: BANK_QUERY_KEYS.BANK_ACCOUNTS,
            })
          }, 100)

          isSubmittingRef.current = false
        },
        onError: (error: Error) => {
          console.error('Bank account creation error:', error)
          isSubmittingRef.current = false
        },
      })
    },
    [
      selectedFile,
      createBankAccountMutation,
      queryClient,
      toast,
      router,
      locale,
      teamId,
    ],
  )

  if (bankListsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Add Receivable Account
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Add Receivable Account
            </h1>
          </div>
          <Button
            type="submit"
            form="bank-account-form"
            disabled={
              !isValid ||
              isSubmitting ||
              createBankAccountMutation.isPending ||
              isSubmittingRef.current
            }
            className="bg-green-500 text-white hover:bg-green-600"
          >
            {createBankAccountMutation.isPending || isSubmittingRef.current
              ? 'กำลังบันทึก...'
              : 'SUBMIT'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <Card className="bg-white">
            <CardContent className="p-6">
              <form
                id="bank-account-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* ธนาคาร */}
                <div className="space-y-2">
                  <Label
                    htmlFor="bank_id"
                    className="text-sm font-medium text-gray-700"
                  >
                    ธนาคาร <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="bank_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="เลือกธนาคาร" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankLists.map((bank: IBankListItem) => (
                            <SelectItem
                              key={bank.id}
                              value={bank.id.toString()}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="relative h-6 w-6 overflow-hidden rounded">
                                  <Image
                                    src={bank.logo}
                                    alt={bank.name}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                  />
                                </div>
                                <span>{bank.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.bank_id && (
                    <p className="text-sm text-red-500">
                      {errors.bank_id.message}
                    </p>
                  )}
                </div>

                {/* ชื่อบัญชี */}
                <div className="space-y-2">
                  <Label
                    htmlFor="account_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    ชื่อบัญชี <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="account_name"
                    {...register('account_name')}
                    placeholder="ชื่อบัญชี"
                    className="w-full"
                  />
                  {errors.account_name && (
                    <p className="text-sm text-red-500">
                      {errors.account_name.message}
                    </p>
                  )}
                </div>

                {/* เลขบัญชี */}
                <div className="space-y-2">
                  <Label
                    htmlFor="account_number"
                    className="text-sm font-medium text-gray-700"
                  >
                    เลขบัญชี <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="account_number"
                    {...register('account_number')}
                    placeholder="เลขบัญชี"
                    className="w-full"
                  />
                  {errors.account_number && (
                    <p className="text-sm text-red-500">
                      {errors.account_number.message}
                    </p>
                  )}
                </div>

                {/* ตั้งเป็นบัญชีหลัก */}
                <div className="flex items-center space-x-3">
                  <Controller
                    name="is_primary"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="is_primary"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label
                    htmlFor="is_primary"
                    className="text-sm font-medium text-gray-700"
                  >
                    ตั้งเป็นบัญชีหลัก <span className="text-red-500">*</span>
                  </Label>
                </div>

                {/* อัพโหลดสมุดบัญชี */}
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-full">
                      <div className="flex w-full items-center gap-4">
                        <div className="flex items-center gap-3">
                          <input
                            id="bank-file-input"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileInput}
                            className="hidden"
                          />

                          {selectedFile ? (
                            // Uploaded state
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex w-32 items-center justify-center gap-1 bg-white px-4 py-1 text-xs text-[#0D8A72]"
                            >
                              Uploaded
                            </Button>
                          ) : (
                            // Choose File state
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={triggerFileInput}
                              className="flex w-32 items-center justify-center gap-1 bg-black px-4 py-1 text-xs text-white hover:bg-gray-800"
                            >
                              Choose File
                            </Button>
                          )}
                        </div>
                        <div
                          className="flex w-full items-center justify-between rounded-lg border p-3"
                          style={{
                            backgroundColor: selectedFile
                              ? '#2563EB'
                              : 'transparent',
                            color: selectedFile ? 'white' : 'gray',
                          }}
                        >
                          <span className="text-sm">
                            {selectedFile
                              ? selectedFile.name
                              : 'อัปโหลดสมุดบัญชีที่นี่'}
                          </span>
                          {selectedFile && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveFile}
                              className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
