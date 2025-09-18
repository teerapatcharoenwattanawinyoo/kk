"use client";

import { TaxInformationForm } from "@/components/back-office/team/settings/tab/tax-information-form";
import { TeamGuard } from "@/components/back-office/team/team-guard";
import { useRouter } from "next/navigation";
import { use } from "react";

interface TaxInformationCreatePageProps {
  params: Promise<{
    locale: string;
    teamId: string;
  }>;
}

const TaxInformationCreatePage = ({
  params,
}: TaxInformationCreatePageProps) => {
  const { locale, teamId } = use(params);
  const router = useRouter();

  const handleBack = () => {
    router.push(`/${locale}/team/${teamId}/settings/tax`);
  };

  const handleSave = () => {
    router.push(`/${locale}/team/${teamId}/settings/tax`);
  };

  const handleCancel = () => {
    router.push(`/${locale}/team/${teamId}/settings/tax`);
  };

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <div className="h-full border-b bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Create Tax Information
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-4xl p-6">
          <TaxInformationForm
            teamId={teamId}
            onBack={handleBack}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </TeamGuard>
  );
};

export default TaxInformationCreatePage;
