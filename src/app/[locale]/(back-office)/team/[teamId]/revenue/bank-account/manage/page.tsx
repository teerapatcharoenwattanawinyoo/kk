"use client";

import { ManageBankAccountPage } from "@/components/back-office/team/revenue/bank-account/manage-bank-account-page";
import { TeamGuard } from "@/components/back-office/team/team-guard";
import { useParams } from "next/navigation";

export default function BankAccountManagePage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const locale = params.locale as string;

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <ManageBankAccountPage teamId={teamId} locale={locale} />
    </TeamGuard>
  );
}
