import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message?: string
  buttonText?: string
  onButtonClick?: () => void
}

export default function SuccessDialog({
  open,
  onOpenChange,
  title = 'Success',
  message = 'Operation completed successfully',
  buttonText = 'Done',
  onButtonClick,
}: SuccessDialogProps) {
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick()
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[250px] max-w-sm flex-col items-center justify-center rounded-xl sm:h-[291px] sm:w-[291px] [&>button]:hidden">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{message}</DialogDescription>
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 sm:mb-4">
            <Image
              src="/assets/images/logo/success-logo.svg"
              alt="Success"
              width={60}
              height={60}
              className="h-[60px] w-[60px] sm:h-[81.68px] sm:w-[81.68px]"
            />
          </div>
          <h2 className="mb-1 text-lg font-medium sm:mb-2 sm:text-xl">{title}</h2>
          <p className="mb-6 px-2 text-center text-sm font-light text-muted-foreground sm:mb-8 sm:px-0">
            {message}
          </p>
          <Button
            onClick={handleButtonClick}
            variant="default"
            className="h-9 w-32 rounded-xl px-6 text-sm sm:h-10 sm:w-40 sm:px-8"
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
