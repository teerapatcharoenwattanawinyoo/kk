"use client";

import {
  PriceGroupForm,
  type FeeFormData,
  type FormData,
  type PriceFormData,
  type PriceType,
} from "@/components/back-office/team/form";
import { SuccessDialog } from "@/components/notifications";
import { useCreatePriceSet } from "@/hooks/use-price-group";
import { toast } from "@/hooks/use-toast";
import { CreatePriceRequest } from "@/lib/api/team-group/price-groups";
import { useTeam } from "@/modules/teams/hooks/use-teams";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AddMemberPriceGroup() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;
  const [isSuccess, setIsSuccess] = useState(false);

  // Hooks for API calls
  const createPriceSetMutation = useCreatePriceSet();
  const isLoading = createPriceSetMutation.isPending;
  const { data: teamData } = useTeam(teamId);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (data: {
    form: FormData;
    priceForm: PriceFormData;
    feeForm: FeeFormData;
    priceType: PriceType;
  }) => {
    if (!teamData?.team_group_id) {
      toast({
        title: "Error",
        description: "Team group ID not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Form values before submit:", data);

      // Prepare the request data based on the form
      const requestData: CreatePriceRequest = {
        type: data.priceType === "free" ? "PER_KWH" : data.priceType,
        team_group_id: teamData.team_group_id,
        name: data.form.groupName,
        status_type: "MEMBER", // Different from regular price group
      };

      // Add pricing fields based on type
      if (data.priceType === "PER_KWH" || data.priceType === "free") {
        requestData.price_per_kwh = parseFloat(data.priceForm.pricePerKwh);
      } else if (data.priceType === "PER_MINUTE") {
        requestData.price_per_kwh = parseFloat(
          data.priceForm.pricePerKwhMinute
        );
        requestData.price_per_minute = parseFloat(
          data.priceForm.price_per_minute
        );
      } else if (data.priceType === "PEAK") {
        requestData.price_on_peak = parseFloat(data.priceForm.onPeakPrice);
        requestData.price_off_peak = parseFloat(data.priceForm.offPeakPrice);
      }

      // Add fees if provided
      if (data.feeForm.fee) {
        requestData.starting_fee = {
          description: data.feeForm.startingFeeDescription,
          fee: data.feeForm.fee,
        };
      }

      if (data.feeForm.feePrice) {
        requestData.charging_fee = {
          description: data.feeForm.chargingFeeDescription,
          feePrice: data.feeForm.feePrice,
          apply_after_minute: parseInt(data.feeForm.applyAfterMinute),
        };
      }

      if (data.feeForm.feePerMin) {
        requestData.minute_fee = {
          description: data.feeForm.minuteFeeDescription,
          feePerMin: data.feeForm.feePerMin,
          apply_fee_after_minute: parseInt(data.feeForm.applyFeeAfterMinute),
          fee_stops_after_minute: data.feeForm.feeStopsAfterMinute
            ? parseInt(data.feeForm.feeStopsAfterMinute)
            : undefined,
        };
      }

      if (data.feeForm.feePerMinIdle) {
        requestData.idle_fee = {
          description: data.feeForm.idleFeeDescription,
          feePerMin: data.feeForm.feePerMinIdle,
          time_before_idle_fee_applied: parseInt(
            data.feeForm.timeBeforeIdleFeeApplied
          ),
          max_total_idle_fee: data.feeForm.maxTotalIdleFee
            ? parseFloat(data.feeForm.maxTotalIdleFee)
            : undefined,
        };
      }

      await createPriceSetMutation.mutateAsync(requestData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating price set:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create price set",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PriceGroupForm
        mode="add"
        statusType="MEMBER"
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onBack={handleBack}
        teamGroupId={teamData?.team_group_id?.toString()}
      />

      <SuccessDialog
        open={isSuccess}
        onOpenChange={setIsSuccess}
        title="Success"
        message="Member Price Group has created completed"
        buttonText="Done"
        onButtonClick={() => {
          setIsSuccess(false);
          router.back();
        }}
      />
    </>
  );
}
