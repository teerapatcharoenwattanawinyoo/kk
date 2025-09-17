"use client";

import { TransactionDetail } from "@/components/back-office/team/overview/transaction-detail";
import { useParams } from "next/navigation";

export default function TransactionDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const transactionId = params.transactionId as string;
  const locale = params.locale as string;

  return (
    <TransactionDetail
      transactionId={transactionId}
      teamId={teamId}
      locale={locale}
    />
  );
}
