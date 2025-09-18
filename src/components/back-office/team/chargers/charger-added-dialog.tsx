import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ChargerAddedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default function ChargerAddedDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Not now (later)",
  confirmText = "Continue",
  onConfirm,
}: ChargerAddedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-auto w-full max-w-[98vw] flex-col items-center justify-center rounded-2xl px-4 py-4 sm:h-[557px] sm:w-[561px] sm:max-w-full sm:px-6 sm:py-7">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <div className="mb-3 mt-3 flex w-full flex-1 flex-col items-center justify-center text-center sm:mb-6 sm:mt-6">
          <div className="mb-3 sm:mb-6">
            <Image
              src="/assets/images/logo/success-logo.svg"
              alt="Success"
              width={48}
              height={48}
              className="sm:h-[81.68px] sm:w-[81.68px]"
            />
          </div>
          <h2 className="mb-2 pt-1 text-base font-semibold text-[#767676] sm:pt-4 sm:text-2xl">
            {title}
          </h2>
          <p className="my-3 mt-2 pt-1 text-sm font-light text-[#1F1F1F]/50 sm:my-8 sm:mt-4 sm:text-lg">
            {description}
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-full flex-col items-center justify-center gap-2 pt-3 sm:w-60 sm:max-w-xs sm:gap-3 sm:pt-8">
          <Button
            onClick={onConfirm}
            className="h-9 w-full max-w-[340px] rounded-2xl bg-[#355FF5] text-sm font-medium text-white hover:bg-[#2a4dd4] sm:h-11 sm:text-base"
          >
            {confirmText}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 w-full max-w-[340px] rounded-2xl border border-[#E5E7EB] bg-white text-sm font-normal text-[#2E2E2E] hover:bg-[#F3F4F6] sm:h-11 sm:text-base"
          >
            {cancelText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
