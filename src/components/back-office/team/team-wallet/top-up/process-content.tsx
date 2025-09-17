"use client";

import { SuccessDialog } from "@/components/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProcessContentProps {
  amount: string;
  method: string;
  orderId: string;
  teamId: string;
  locale: string;
}

export function ProcessContent({
  amount,
  method,
  orderId,
  teamId,
  locale,
}: ProcessContentProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 3000); // 3 seconds simulation

    return () => clearTimeout(timer);
  }, []);

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Navigate back to team wallet
    router.push(`/${locale}/team/${teamId}/team-wallet`);
  };

  return (
    <>
      <div className="space-y-4 text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
        <h3 className="text-lg font-semibold">กำลังประมวลผลการชำระเงิน</h3>
        <p className="text-muted-foreground">
          เลขที่อ้างอิง: {orderId}
          <br />
          จำนวนเงิน: {amount} ฿<br />
          วิธีการชำระ: {method}
        </p>
        <p className="text-sm text-muted-foreground">กรุณารอสักครู่...</p>
      </div>

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Success"
        message="Top up success&#10;Thank you."
        buttonText="Done"
        onButtonClick={handleSuccessClose}
      />
    </>
  );
}
