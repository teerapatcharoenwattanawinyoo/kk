"use client";
import { TeamGuard } from "@/components/back-office/team/team-guard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

interface EditMemberGroupPageProps {
  params: Promise<{ locale: string; teamId: string }>;
}

export default function EditMemberGroup({ params }: EditMemberGroupPageProps) {
  const router = useRouter();
  const { teamId, locale } = use(params);

  const handleBack = () => {
    router.back();
  };

  return (
    <TeamGuard teamId={teamId} locale={locale}>
      <div className="p-3 md:p-6">
        <div className="shadow-xs mx-auto flex max-w-4xl flex-col rounded-lg bg-card p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBack}
                variant={"secondary"}
                size={"icon"}
                className="h-7 w-7 rounded-full"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </Button>
              <h1 className="text-title text-xl font-semibold">
                Edit Member Group
              </h1>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size={"sm"}
              className="w-40 text-primary-foreground"
              variant={"success"}
            >
              Update
            </Button>
          </div>

          <div className="mt-2">
            <div>Edit Member Group Form</div>
          </div>
        </div>
      </div>
    </TeamGuard>
  );
}
