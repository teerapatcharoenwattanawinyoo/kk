import { PricingPage } from "@/components/back-office/team/pricing/pricing-page";
import { TeamGuard } from "@/components/back-office/team/team-guard";

interface PricingPageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

export default async function TeamPricingPage({ params }: PricingPageProps) {
  const { teamId, locale } = await params;
  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <PricingPage teamId={teamId} />
    </TeamGuard>
  );
}
