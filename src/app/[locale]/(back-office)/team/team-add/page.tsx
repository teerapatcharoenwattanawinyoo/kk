"use client";

import { SuccessDialog } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { buildLocalizedPath } from "@/lib/helpers/localized-path";
import { useI18n } from "@/lib/i18n";
import { colors } from "@/lib/utils/colors";
import TeamAddForm from "@/modules/teams/components/team-add-form";
import { TeamFormData } from "@/modules/teams/schemas/team.schema";
import { useCreateTeam, useTeamHostId } from "@modules/teams/hooks";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TeamAddPage = () => {
  const router = useRouter();
  const teamHostId = useTeamHostId();
  const createTeamMutation = useCreateTeam();
  const { t, locale } = useI18n();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleBack = () => {
    router.push(buildLocalizedPath(locale, ROUTES.TEAM));
  };

  const handleSubmit = async (data: TeamFormData) => {
    try {
      const formData = new FormData();
      formData.append("team_name", data.team_name);
      formData.append("team_email", data.team_email);
      formData.append("team_phone", data.team_phone);
      formData.append("team_status", data.team_status);

      // เพิ่มไฟล์กลับมา - ลองใช้ field name ที่แตกต่างกัน
      if (data.file && data.file instanceof File) {
        formData.append("icon_group", data.file);
        console.log(
          "File will be sent as 'icon_group':",
          data.file.name,
          data.file.type,
          data.file.size
        );
      }

      console.log(
        "Sending FormData with file:",
        data.file ? "included" : "not included"
      );

      // ส่ง FormData ไปให้ mutation
      await createTeamMutation.mutateAsync(formData);

      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error creating team:", error);
      console.error("Error details:", error);
      throw error;
    }
  };

  // ฟังก์ชันสำหรับตรวจสอบความครบถ้วนของข้อมูล
  const handleFormValidation = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    router.push(buildLocalizedPath(locale, ROUTES.TEAM));
  };

  return (
    <div className="p-3 md:p-6">
      <div className="shadow-xs mx-auto flex max-w-4xl flex-col rounded-lg bg-card p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleBack}
              className="h-7 w-7 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </Button>
            <h1
              className="text-xl font-medium md:text-2xl"
              style={{ color: colors.teamCard.header.title }}
            >
              {t("team.add_team")}
            </h1>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            form="add-team-form"
            size="sm"
            variant={"success"}
            disabled={createTeamMutation.isPending || !isFormValid}
            className="w-40 text-white"
          >
            {createTeamMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-light uppercase">
                  {t("team.submitting")}
                </span>
              </div>
            ) : (
              <p className="text-sm font-normal uppercase">
                {t("buttons.submit")}
              </p>
            )}
          </Button>
        </div>

        {/* Form Component */}
        <div className="mt-2">
          <TeamAddForm
            onSubmit={handleSubmit}
            isSubmitting={createTeamMutation.isPending}
            teamHostId={teamHostId}
            onValidationChange={handleFormValidation}
          />
        </div>

        {/* Success Dialog */}
        <SuccessDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          title={t("messages.success")}
          message={t("team.team_created_success")}
          buttonText={t("team.done")}
          onButtonClick={handleDialogClose}
        />
      </div>
    </div>
  );
};

export default TeamAddPage;
