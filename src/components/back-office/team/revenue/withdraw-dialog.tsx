"use client";

import { WarningIcon } from "@/components/icons";
import { CardIcon } from "@/components/icons/CardIcon";
import SuccessDialog from "@/components/notifications/success-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRevenueBalance } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { useConfirmPayout, useInitPayout } from "@/hooks/use-payout";
import { Dialog, DialogContent, DialogTitle } from "@/ui";
import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface WithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  balance: string;
  teamId: string;
}

type WithdrawStep = "withdraw" | "selectOTP" | "verifyOTP";
type OTPMethod = "phone" | "email";

export const WithdrawDialog = memo(
  ({ isOpen, onClose, balance, teamId }: WithdrawDialogProps) => {
    const [step, setStep] = useState<WithdrawStep>("withdraw");
    const [autoWithdraw, setAutoWithdraw] = useState(true);
    const [amount, setAmount] = useState("");
    const [otpMethod, setOtpMethod] = useState<OTPMethod>("phone");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [initResponse, setInitResponse] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // Hooks
    const { user } = useAuth();
    const {
      data: revenueBalanceResponse,
      isLoading: isBalanceLoading,
      refetch: refetchBalance,
    } = useRevenueBalance(teamId);

    const initPayoutMutation = useInitPayout();
    const confirmPayoutMutation = useConfirmPayout();

    const currentBalance = revenueBalanceResponse?.data?.transfer_balance || 0;
    const maxWithdrawAmount = currentBalance;

    const userPhone = user?.phone;
    const userEmail = user?.email;
    const maskedPhone = userPhone
      ? userPhone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2")
      : null;
    const maskedEmail = userEmail
      ? userEmail.replace(/(.{2}).+(@.+)/, "$1****$2")
      : null;
    const hasPhone = !!userPhone;
    const hasEmail = !!userEmail;

    useEffect(() => {
      if (isOpen) {
        refetchBalance();
        if (hasPhone && !hasEmail) {
          setOtpMethod("phone");
        } else if (hasEmail && !hasPhone) {
          setOtpMethod("email");
        } else if (hasPhone) {
          setOtpMethod("phone");
        }
      }
    }, [isOpen, refetchBalance, hasPhone, hasEmail]);

    const handleReset = useCallback(() => {
      setStep("withdraw");
      setAmount("");
      setOtp(["", "", "", "", "", ""]);
      setInitResponse(null);
      setTimeLeft(0);
      setShowSuccessDialog(false);
      if (hasPhone) {
        setOtpMethod("phone");
      } else if (hasEmail) {
        setOtpMethod("email");
      }
    }, [hasPhone, hasEmail]);

    const handleClose = useCallback(() => {
      handleReset();
      onClose();
    }, [handleReset, onClose]);

    const handleSuccessDialogClose = useCallback(() => {
      setShowSuccessDialog(false);
      handleClose(); // Close the main dialog too
    }, [handleClose]);

    // Countdown timer effect
    useEffect(() => {
      let interval: NodeJS.Timeout;

      if (step === "verifyOTP" && initResponse?.expires_in) {
        setTimeLeft(initResponse.expires_in);

        interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [step, initResponse?.expires_in]);

    // Format time for display (mm:ss)
    const formatTime = useCallback((seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    useEffect(() => {
      if (initPayoutMutation.isSuccess && initPayoutMutation.data) {
        setInitResponse(initPayoutMutation.data.data);
        setStep("verifyOTP");
        initPayoutMutation.reset();
      }
    }, [initPayoutMutation.isSuccess, initPayoutMutation.data]);

    useEffect(() => {
      if (confirmPayoutMutation.isSuccess) {
        setShowSuccessDialog(true);
        refetchBalance();
        confirmPayoutMutation.reset();
      }
    }, [confirmPayoutMutation.isSuccess, refetchBalance]);

    const handleAutoWithdrawChange = useCallback((checked: boolean) => {
      setAutoWithdraw(checked);
    }, []);

    const handleAmountChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
          setAmount(value);
        }
      },
      [],
    );

    const validateAmount = useCallback(() => {
      const numAmount = parseFloat(amount);
      if (!amount || numAmount <= 0) {
        toast.error("กรุณาระบุจำนวนเงินที่ต้องการถอน");
        return false;
      }
      if (numAmount < 30) {
        toast.error("จำนวนเงินขั้นต่ำในการถอนคือ 30 บาท");
        return false;
      }
      if (numAmount > maxWithdrawAmount) {
        toast.error(
          `จำนวนเงินที่ถอนได้สูงสุด ${maxWithdrawAmount.toLocaleString()} บาท`,
        );
        return false;
      }
      return true;
    }, [amount, maxWithdrawAmount]);

    const handleNextToOTP = useCallback(() => {
      if (!validateAmount()) return;

      if (!hasPhone && !hasEmail) {
        toast.error("กรุณาเพิ่มเบอร์โทรศัพท์หรืออีเมลในโปรไฟล์ก่อนถอนเงิน");
        return;
      }

      setStep("selectOTP");
    }, [validateAmount, hasPhone, hasEmail]);

    const handleSelectOTPMethod = useCallback(() => {
      if (!validateAmount()) return;

      initPayoutMutation.mutate({
        team_group_id: parseInt(teamId, 10),
        amount: parseFloat(amount),
        otp_type: otpMethod,
      });
    }, [validateAmount, amount, otpMethod, initPayoutMutation, teamId]);

    const handleOtpChange = useCallback(
      (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
          const nextInput = document.querySelector(
            `input[name="otp-${index + 1}"]`,
          ) as HTMLInputElement;
          nextInput?.focus();
        }
      },
      [otp],
    );

    const handleSubmitOTP = useCallback(async () => {
      const otpString = otp.join("");
      if (otpString.length !== 6) {
        toast.error("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
        return;
      }

      if (timeLeft <= 0) {
        toast.error("รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่");
        return;
      }

      if (!initResponse?.payout_transaction_id) {
        toast.error("ไม่พบรหัสธุรกรรม กรุณาเริ่มต้นใหม่");
        return;
      }

      confirmPayoutMutation.mutate({
        payout_transaction_id: initResponse.payout_transaction_id,
        otp_ref: initResponse.otp_ref,
        otp_code: otpString,
      });
    }, [otp, initResponse, confirmPayoutMutation, timeLeft]);

    const handleCancel = useCallback(() => {
      handleClose();
    }, [handleClose]);

    const handleBack = useCallback(() => {
      if (step === "verifyOTP") {
        setStep("selectOTP");
      } else if (step === "selectOTP") {
        setStep("withdraw");
      }
    }, [step]);

    const renderStep = () => {
      switch (step) {
        case "withdraw":
          return (
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  คุณต้องการถอนเงินใช่หรือไม่
                </h2>
              </div>

              {/* Content */}
              <div className="space-y-6 p-6">
                {/* Balance Card */}
                <div
                  className="relative overflow-hidden rounded-xl p-6 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Background circles - same as revenue tab */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-60px",
                      left: "-80px",
                      width: "260px",
                      height: "260px",
                      background:
                        "radial-gradient(circle at 50% 50%, #98AEFF 70%, transparent 100%)",
                      borderRadius: "50%",
                      zIndex: 1,
                      opacity: 0.7,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "-45px",
                      left: "-65px",
                      width: "220px",
                      height: "220px",
                      background:
                        "radial-gradient(circle at 50% 50%, #A9BCFF 70%, transparent 100%)",
                      borderRadius: "50%",
                      zIndex: 2,
                      opacity: 0.7,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "-30px",
                      left: "-50px",
                      width: "180px",
                      height: "180px",
                      background:
                        "radial-gradient(circle at 50% 50%, #6484F5 70%, transparent 100%)",
                      borderRadius: "50%",
                      zIndex: 3,
                      opacity: 0.5,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "-15px",
                      left: "-35px",
                      width: "140px",
                      height: "140px",
                      background:
                        "radial-gradient(circle at 50% 50%, #355FF5 70%, transparent 100%)",
                      borderRadius: "50%",
                      zIndex: 4,
                      opacity: 0.4,
                    }}
                  />
                  <div className="relative z-10 text-left">
                    <div className="mb-2 flex items-center justify-start space-x-2">
                      <CardIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">ยอดที่ถอนได้</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {isBalanceLoading ? (
                        <div className="mx-auto h-8 w-32 animate-pulse rounded bg-white/20"></div>
                      ) : (
                        `${currentBalance.toLocaleString()} ฿`
                      )}
                    </div>
                  </div>
                </div>

                {/* Auto Withdraw Toggle */}
                {/* <div className="flex items-center space-x-3">
                  <Switch
                    checked={autoWithdraw}
                    onCheckedChange={handleAutoWithdrawChange}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    ถอนแบบประจำเงินเทียม
                  </span>
                </div> */}

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    ระบุตัวเลข
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Amount"
                      value={amount}
                      onChange={handleAmountChange}
                      className="pr-8"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400">
                      ฿
                    </div>
                  </div>
                </div>

                {/* Warning Alert */}
                <div className="rounded-lg border border-[#F67416]/20 bg-[#FFE8D7] p-4">
                  <div className="flex items-start space-x-3">
                    <WarningIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F67416]" />
                    <div className="text-sm text-[#F67416]">
                      <span className="font-semibold">
                        คุณสามารถถอนเงินได้ฟรี 1 ครั้งต่อเดือน
                      </span>{" "}
                      ขยับแพ็คเก็จของคุณเพื่อประโยชน์เพิ่มขึ้น
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex space-x-3 border-t border-gray-200 p-6">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNextToOTP}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={!amount}
                >
                  Next
                </Button>
              </div>
            </div>
          );

        case "selectOTP":
          return (
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
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
                <h2 className="text-lg font-semibold text-gray-900">
                  ยืนยันการถอนเงิน
                </h2>
                <div className="w-6" />
              </div>

              {/* Content */}
              <div className="space-y-6 p-6">
                <div className="text-center">
                  <p className="mb-6 text-gray-600">
                    เลือกช่องทางที่ต้องการรับรหัส OTP
                  </p>
                </div>

                {!hasPhone && !hasEmail ? (
                  <div className="rounded-lg bg-red-50 p-4 text-center">
                    <p className="text-red-600">
                      กรุณาเพิ่มเบอร์โทรศัพท์หรืออีเมลในโปรไฟล์ก่อนถอนเงิน
                    </p>
                  </div>
                ) : (
                  <Tabs
                    value={otpMethod}
                    onValueChange={(value: string) =>
                      setOtpMethod(value as OTPMethod)
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent">
                      {hasPhone && (
                        <TabsTrigger
                          value="phone"
                          className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
                        >
                          SMS
                        </TabsTrigger>
                      )}
                      {hasEmail && (
                        <TabsTrigger
                          value="email"
                          className="rounded-xl bg-muted py-2.5 data-[state=active]:bg-[#DCE4FF] data-[state=inactive]:bg-muted data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground"
                        >
                          Email
                        </TabsTrigger>
                      )}
                    </TabsList>

                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                      {hasPhone && (
                        <TabsContent value="phone" className="mt-0">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <svg
                                className="h-5 w-5 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                เบอร์โทรศัพท์
                              </p>
                              <p className="text-sm text-gray-500">
                                {maskedPhone}
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                      )}
                      {hasEmail && (
                        <TabsContent value="email" className="mt-0">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                              <svg
                                className="h-5 w-5 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">อีเมล</p>
                              <p className="text-sm text-gray-500">
                                {maskedEmail}
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                      )}
                    </div>
                  </Tabs>
                )}
              </div>

              {/* Footer */}
              <div className="flex space-x-3 border-t border-gray-200 p-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={initPayoutMutation.isPending}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSelectOTPMethod}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={
                    (!hasPhone && !hasEmail) || initPayoutMutation.isPending
                  }
                >
                  {initPayoutMutation.isPending
                    ? "กำลังส่ง OTP..."
                    : "Send OTP"}
                </Button>
              </div>
            </div>
          );

        case "verifyOTP":
          return (
            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
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
                <h2 className="text-lg font-semibold text-gray-900">
                  ยืนยันการถอนเงิน
                </h2>
                <div className="w-6" />
              </div>

              {/* Content */}
              <div className="space-y-6 p-6">
                <div className="text-center">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    Verify OTP
                  </h3>
                  <p className="font-medium text-blue-600">
                    {otpMethod === "phone" ? maskedPhone : maskedEmail}
                  </p>
                  <p className="mt-2 text-gray-600">
                    Please enter the code received from{" "}
                    {otpMethod === "phone" ? "phone SMS Number" : "email"}
                  </p>
                </div>

                {/* OTP Input */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      name={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="h-14 w-14 text-center text-xl font-semibold"
                      required
                    />
                  ))}
                </div>

                {/* Resend info */}
                <div className="text-center text-sm text-gray-600">
                  <p>
                    Code Sent.{" "}
                    {timeLeft > 0
                      ? `Resend Code in ${formatTime(timeLeft)}`
                      : "Code expired"}
                  </p>
                  {initResponse?.otp_ref && (
                    <p>Ref : #{initResponse.otp_ref}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex space-x-3 border-t border-gray-200 p-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={confirmPayoutMutation.isPending}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitOTP}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={
                    otp.join("").length !== 6 ||
                    confirmPayoutMutation.isPending ||
                    timeLeft <= 0
                  }
                >
                  {confirmPayoutMutation.isPending
                    ? "กำลังยืนยัน..."
                    : timeLeft <= 0
                      ? "Code Expired"
                      : "Submit"}
                </Button>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <>
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-md p-0">
            <DialogTitle className="sr-only">ถอนเงิน</DialogTitle>
            {renderStep()}
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <SuccessDialog
          open={showSuccessDialog}
          onOpenChange={handleSuccessDialogClose}
          title="ถอนเงินสำเร็จ"
          message={`จำนวนเงิน ${parseFloat(amount || "0").toLocaleString()} บาท`}
          buttonText="เสร็จสิ้น"
          onButtonClick={handleSuccessDialogClose}
        />
      </>
    );
  },
);

WithdrawDialog.displayName = "WithdrawDialog";
