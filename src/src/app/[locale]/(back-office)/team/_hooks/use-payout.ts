import { toast } from "@/hooks/use-toast";
import {
  confirmPayoutTransaction,
  initPayoutTransaction,
} from "@/lib/api/team-group/payout";
import { QUERY_KEYS } from "@/lib/constants";
import type {
  PayoutConfirmRequest,
  PayoutInitRequest,
} from "@/lib/schemas/payout";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ==========================
// MUTATIONS
// ==========================

// Initialize payout transaction mutation
export const useInitPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PayoutInitRequest) => initPayoutTransaction(data),
    onSuccess: (data) => {
      // Invalidate revenue balance to get updated data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVENUE_BALANCE,
      });

      toast({
        title: "สำเร็จ",
        description: data.message || "ส่ง OTP เรียบร้อยแล้ว",
      });
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string;
            statusCode?: number;
          };
          status?: number;
        };
      },
    ) => {
      const errorMessage = error?.response?.data?.message;
      const statusCode =
        error?.response?.data?.statusCode || error?.response?.status;

      if (errorMessage) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (statusCode === 400) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่",
          variant: "destructive",
        });
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    },
    retry: false, // Disable retry to prevent multiple API calls
  });
};

// Confirm payout transaction mutation
export const useConfirmPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PayoutConfirmRequest) => confirmPayoutTransaction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVENUE_BALANCE,
      });

      toast({
        title: "สำเร็จ",
        description: data.message || "ถอนเงินเรียบร้อยแล้ว",
      });
    },
    onError: (
      error: Error & {
        response?: {
          data?: {
            message?: string;
            statusCode?: number;
          };
          status?: number;
        };
      },
    ) => {
      const errorMessage = error?.response?.data?.message;
      const statusCode =
        error?.response?.data?.statusCode || error?.response?.status;

      if (errorMessage) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (statusCode === 404) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่พบรายการถอนเงิน กรุณาเริ่มต้นใหม่",
          variant: "destructive",
        });
      } else if (statusCode === 500) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่",
          variant: "destructive",
        });
      }
    },
    retry: false, // Disable retry to prevent multiple API calls
  });
};

// Export types for convenience
export type { PayoutConfirmRequest, PayoutInitRequest };
