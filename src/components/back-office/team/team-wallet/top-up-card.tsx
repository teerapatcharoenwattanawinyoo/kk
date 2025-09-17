"use client";

import { TopUpCardIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TopUpCardProps {
  teamId?: string;
}

export function TopUpCard({ teamId }: TopUpCardProps = {}) {
  const params = useParams();
  const currentTeamId = teamId || params.teamId;

  return (
    <Link href={`/${params.locale}/team/${currentTeamId}/team-wallet/top-up`}>
      <Button
        type="button"
        variant="outline"
        className="shadow-xs group relative grid h-44 w-40 place-items-center rounded-2xl border border-primary/20 p-4 text-center transition-colors"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <TopUpCardIcon className="size-6 text-primary" />
        </span>
        Top Up
      </Button>
    </Link>
  );
}
