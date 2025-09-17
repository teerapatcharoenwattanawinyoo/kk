"use client";

import { PaymentMethodSelector } from "@/components/back-office/team/team-wallet/top-up/payment-method-selector";
import { useRouter } from "next/navigation";

interface CheckoutContentProps {
  amount: string;
  teamId: string;
  locale: string;
}

export function CheckoutContent({
  amount,
  teamId,
  locale,
}: CheckoutContentProps) {
  const router = useRouter();

  const handlePaymentSelect = (methodId: string, methodData: any) => {
    // Navigate to summary page with method data
    const methodParams = encodeURIComponent(JSON.stringify(methodData));
    router.push(
      `/${locale}/team/${teamId}/team-wallet/top-up/checkout/summary?amount=${amount}&method=${methodId}&methodData=${methodParams}`,
    );
  };

  return (
    <div className="mx-auto max-w-md">
      <PaymentMethodSelector
        amount={amount}
        onPaymentSelect={handlePaymentSelect}
      />
    </div>
  );
}
