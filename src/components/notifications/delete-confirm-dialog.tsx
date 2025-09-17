import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  itemName?: string
  onConfirm: () => void
  isLoading?: boolean
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = '',
  description,
  itemName,
  onConfirm,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[325px]">
        <div className="p-6">
          <DialogHeader className="space-y-0">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <DialogTitle className="text-xl font-semibold text-gray-900">{title}</DialogTitle>
                <DialogDescription className="max-w-sm text-lg text-black">
                  {description || defaultDescription}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>
        <DialogFooter className="flex-col items-center gap-3 p-6 pt-0 sm:flex-col sm:space-x-0">
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            size={'lg'}
            className="rounded-full bg-[#F46262] px-20 py-6"
          >
            {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Confirm
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-full px-20 py-6"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
