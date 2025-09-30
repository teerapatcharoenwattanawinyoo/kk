'use client'
import { Button } from '@/components/ui/button'
import { CustomScrollArea } from '@/components/ui/custom-scroll-area'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

interface PolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
}

export default function PolicyDialog({ open, onOpenChange, onAccept }: PolicyDialogProps) {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-xl px-6 py-6 sm:max-w-[600px] md:max-w-[720px]">
          <DialogHeader className="relative mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute left-4 top-[26px] h-8 w-8 -translate-y-1/2 rounded-full bg-[#F4F4F4] hover:bg-secondary"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <DialogTitle className="text-center text-3xl font-medium text-[#132150]">
              Privacy Policy
            </DialogTitle>
          </DialogHeader>

          <CustomScrollArea className="h-[50vh] pr-4">
            <div className="mb-8 space-y-6 px-4 py-4 pb-10 pt-4 text-[14px] text-muted-foreground">
              <div>
                <h3 className="mb-3 text-[16px] font-medium text-foreground">Privacy Policy</h3>
                <p className="font-light text-[#393939]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum.
                </p>
                <p className="mt-3 font-light text-[#393939]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting indus
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-[16px] font-medium text-foreground">Terms & Conditions</h3>
                <p className="font-light text-[#393939]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum.
                </p>
                <p className="mt-3 font-light text-[#393939]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting indus
                </p>
              </div>
            </div>
          </CustomScrollArea>

          <DialogFooter className="mt-4 flex flex-col items-center gap-4">
            <div className="flex w-full items-center justify-center">
              <div className="flex w-full max-w-[216px] flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="h-[34px] w-full rounded-xl border border-[#c8c8c8] text-[14px] font-light text-[#575757] hover:bg-[#afafaf] hover:text-[#e4e4e4]"
                >
                  ฉันได้อ่านแล้ว
                </Button>

                <Button
                  onClick={() => {
                    setShowConfirmationDialog(true)
                    onOpenChange(false)
                  }}
                  type="submit"
                  className="h-[44px] w-full rounded-xl bg-blue-600 text-[14px] hover:bg-blue-700"
                >
                  Accept
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="max-h-xl px-6 py-6 sm:max-w-[600px] md:max-w-[720px]">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-center text-2xl font-medium text-[#132150]">
              TERM & CONDITION
            </DialogTitle>
          </DialogHeader>

          <CustomScrollArea className="h-[50vh] pr-4">
            <div className="mb-8 space-y-6 px-4 py-4 pb-10 pt-4 text-[14px] text-muted-foreground">
              <div>
                <h3 className="mb-3 text-[16px] font-medium text-foreground">Privacy Policy</h3>
                <p className="font-light text-[#393939]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum.
                </p>
                <p className="mt-3 font-light text-[#393939]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting indus
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-[16px] font-medium text-foreground">Terms & Conditions</h3>
                <p className="font-light text-[#393939]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum.
                </p>
                <p className="mt-3 font-light text-[#393939]">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when
                  an unknown printer took a galley of type and scrambled it to make a type specimen
                  book. It has survived not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                  with desktop publishing software like Aldus PageMaker including versions of Lorem
                  Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting indus
                </p>
              </div>
            </div>
          </CustomScrollArea>

          <DialogFooter className="mt-4 flex flex-col items-center gap-4">
            <div className="flex w-full items-center justify-center">
              <div className="flex w-full max-w-[216px] flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirmationDialog(false)}
                  className="h-[34px] w-full rounded-xl border border-[#c8c8c8] text-[14px] font-light text-[#575757] hover:bg-[#afafaf] hover:text-[#e4e4e4]"
                >
                  ฉันได้อ่านแล้ว
                </Button>

                <Button
                  onClick={() => {
                    onAccept()
                    setShowConfirmationDialog(false)
                  }}
                  type="submit"
                  className="h-[44px] w-full rounded-xl bg-blue-600 text-[14px] hover:bg-blue-700"
                >
                  Accept
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
