"use client";

import {
  PriceGroupForm,
  type FeeFormData,
  type FormData,
  type PriceFormData,
  type PriceType,
} from "@/components/back-office/team/form";
import { SuccessDialog } from "@/components/notifications";
import { useUpdatePriceSet } from "@/hooks/use-price-group";
import { useTeam } from "@/hooks/use-teams";
import { toast } from "@/hooks/use-toast";
import {
  getPriceSet,
  PriceGroup,
  UpdatePriceRequest,
} from "@/lib/api/team-group/price-groups";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMemberPriceGroup() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const teamId = params.id as string;
  const priceId = searchParams.get("priceId");
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialData, setInitialData] = useState<
    | {
        form: FormData;
        priceForm: PriceFormData;
        feeForm: FeeFormData;
        priceType: PriceType;
      }
    | undefined
  >(undefined);

  // Hooks for API calls
  const updatePriceSetMutation = useUpdatePriceSet();
  const { data: teamData } = useTeam(teamId);
  const isLoading = updatePriceSetMutation.isPending;

  // Fetch and populate current price group data
  useEffect(() => {
    const fetchData = async () => {
      if (!priceId) return;
      try {
        const res = await getPriceSet("member", 1, 100);
        const found = res.data.data.find(
          (g: PriceGroup) => g.id.toString() === priceId,
        );
        if (found) {
          setInitialData({
            form: {
              groupName: found.name || "",
              status: "publish",
            },
            priceForm: {
              pricePerKwh: found.price_per_kwh || "",
              pricePerKwhMinute: found.price_per_kwh || "",
              price_per_minute: found.price_per_minute || "",
              onPeakPrice: found.price_on_peak || "",
              offPeakPrice: found.price_off_peak || "",
              freeKw: "",
              freeKwh: "",
            },
            feeForm: {
              startingFeeDescription: found.starting_fee?.description || "",
              fee: found.starting_fee?.fee || "",
              chargingFeeDescription: found.charging_fee?.description || "",
              feePrice: found.charging_fee?.fee_price || "",
              applyAfterMinute:
                found.charging_fee?.apply_after_minute?.toString() || "",
              minuteFeeDescription: found.minute_fee?.description || "",
              feePerMin: found.minute_fee?.fee_per_min || "",
              applyFeeAfterMinute:
                found.minute_fee?.apply_fee_after_minute?.toString() || "",
              feeStopsAfterMinute:
                found.minute_fee?.fee_stops_after_minute?.toString() || "",
              idleFeeDescription: found.idle_fee?.description || "",
              feePerMinIdle: found.idle_fee?.fee_per_min || "",
              timeBeforeIdleFeeApplied:
                found.idle_fee?.time_before_idle_fee_applied?.toString() || "",
              maxTotalIdleFee:
                found.idle_fee?.max_total_idle_fee?.toString() || "",
            },
            priceType: found.type as PriceType,
          });
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "โหลดข้อมูลไม่สำเร็จ",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [priceId]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (data: {
    form: FormData;
    priceForm: PriceFormData;
    feeForm: FeeFormData;
    priceType: PriceType;
  }) => {
    if (!priceId) {
      toast({
        title: "Error",
        description: "Price ID not found. Please try again.",
        variant: "destructive",
      });
      return;
    }
    if (!teamData?.team_group_id) {
      toast({
        title: "Error",
        description: "Team group ID not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // แก้ไข type ให้ตรงกับ API (free ต้องเป็น PER_KWH)
      const requestData: UpdatePriceRequest = {
        type: data.priceType === "free" ? "PER_KWH" : data.priceType,
        name: data.form.groupName,
        status_type: "MEMBER",
      };

      // Main price fields
      if (data.priceType === "PER_KWH" || data.priceType === "free") {
        if (data.priceForm.pricePerKwh)
          requestData.price_per_kwh = Number(data.priceForm.pricePerKwh);
        // free: ใช้ freeKwh เป็น price_per_kwh, freeKw ไม่ต้องส่ง
        if (data.priceType === "free" && data.priceForm.freeKwh)
          requestData.price_per_kwh = Number(data.priceForm.freeKwh);
      } else if (data.priceType === "PER_MINUTE") {
        if (data.priceForm.pricePerKwhMinute)
          requestData.price_per_kwh = Number(data.priceForm.pricePerKwhMinute);
        if (data.priceForm.price_per_minute)
          requestData.price_per_minute = Number(
            data.priceForm.price_per_minute,
          );
      } else if (data.priceType === "PEAK") {
        if (data.priceForm.onPeakPrice)
          requestData.price_on_peak = Number(data.priceForm.onPeakPrice);
        if (data.priceForm.offPeakPrice)
          requestData.price_off_peak = Number(data.priceForm.offPeakPrice);
      }

      // Additional fees: mapping ให้ตรงกับ API
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
          apply_after_minute: data.feeForm.applyAfterMinute
            ? Number(data.feeForm.applyAfterMinute)
            : 0,
        };
      }
      if (data.feeForm.feePerMin) {
        requestData.minute_fee = {
          description: data.feeForm.minuteFeeDescription,
          feePerMin: data.feeForm.feePerMin,
          apply_fee_after_minute: data.feeForm.applyFeeAfterMinute
            ? Number(data.feeForm.applyFeeAfterMinute)
            : 0,
          fee_stops_after_minute: data.feeForm.feeStopsAfterMinute
            ? Number(data.feeForm.feeStopsAfterMinute)
            : undefined,
        };
      }
      if (data.feeForm.feePerMinIdle) {
        requestData.idle_fee = {
          description: data.feeForm.idleFeeDescription,
          feePerMin: data.feeForm.feePerMinIdle,
          time_before_idle_fee_applied: data.feeForm.timeBeforeIdleFeeApplied
            ? Number(data.feeForm.timeBeforeIdleFeeApplied)
            : 0,
          max_total_idle_fee: data.feeForm.maxTotalIdleFee
            ? Number(data.feeForm.maxTotalIdleFee)
            : undefined,
        };
      }

      await updatePriceSetMutation.mutateAsync({ priceId, data: requestData });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error updating price set:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update price set",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <PriceGroupForm
        mode="edit"
        statusType="MEMBER"
        initialData={initialData}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />

      <SuccessDialog
        open={isSuccess}
        onOpenChange={setIsSuccess}
        title="Success"
        message="Member Price Group has been updated successfully"
        buttonText="Done"
        onButtonClick={() => {
          setIsSuccess(false);
          router.back();
        }}
      />
    </>
  );
}
