"use client";

import FetchLoader from "@/components/FetchLoader";
import { ChargePointMap } from "@/components/maps/charge-point-map";
import {
  useDownloadTransaction,
  useTransactionDetail,
} from "@/hooks/use-transaction-detail";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui";
import { ChevronLeft, Download, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface TransactionDetailProps {
  transactionId: string;
  teamId: string;
  locale: string;
}

export const TransactionDetail = ({
  transactionId,
  teamId,
  locale,
}: TransactionDetailProps) => {
  const router = useRouter();
  const {
    data: transactionDetailResponse,
    isLoading,
    error,
  } = useTransactionDetail({
    transaction_id: transactionId,
  });

  const downloadTransactionMutation = useDownloadTransaction();

  const transactionDetail = transactionDetailResponse?.data;

  const handleBack = useCallback(() => {
    router.push(`/${locale}/team/${teamId}/overview`);
  }, [router, locale, teamId]);

  const handleDownloadReceipt = useCallback(() => {
    downloadTransactionMutation.mutate(transactionId);
  }, [downloadTransactionMutation, transactionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Detail</h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <FetchLoader />
        </div>
      </div>
    );
  }

  if (error || !transactionDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Detail</h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                เกิดข้อผิดพลาดในการโหลดข้อมูล
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { charge, payment } = transactionDetail;

  // Get status badge colors
  const getStatusBadge = (status: string) => {
    let bg = "#DFF8F3",
      color = "#0D8A72",
      text = status;
    if (status === "pending") {
      bg = "#FEF3C7";
      color = "#92400E";
      text = "Pending";
    } else if (status === "failed" || status === "cancelled") {
      bg = "#FEE2E2";
      color = "#DC2626";
      text = "Failed";
    } else if (status === "processing") {
      bg = "#DBEAFE";
      color = "#1D4ED8";
      text = "Processing";
    } else if (!status || status === "completed" || status === "Finishing") {
      bg = "#DFF8F3";
      color = "#0D8A72";
      text = "Completed";
    }
    return { bg, color, text };
  };

  const statusBadge = getStatusBadge(charge.status);

  // Format date and time
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const dateStr = date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dateStr, timeStr };
  };

  const startDateTime = formatDateTime(charge.charge_start_at);
  const endDateTime = formatDateTime(charge.charge_end_at);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Detail</h1>
          </div>
          <Button
            onClick={handleDownloadReceipt}
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={downloadTransactionMutation.isPending}
          >
            {downloadTransactionMutation.isPending ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Charge Info */}
            <div className="space-y-6 lg:col-span-2">
              {/* Charge Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Charge #{charge.order_number}
                    <span
                      className="ml-2 rounded px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.color,
                      }}
                    >
                      {statusBadge.text}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-6">
                    {/* Row 1 */}
                    <div>
                      <div className="mb-1 text-sm text-[#6B7280]">
                        Charge point
                      </div>
                      <div className="font-medium">
                        {charge.partner_station.charge_point}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-[#6B7280]">
                        Charge by
                      </div>
                      <div className="font-medium">
                        {charge.customer.charge_by}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-[#6B7280]">
                        Paying Team
                      </div>
                      <div className="font-medium">
                        {charge.paying_team ||
                          `Personal (#${charge.header_number})`}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-[#6B7280]">
                        Payment method
                      </div>
                      <div className="font-medium">{charge.payment_method}</div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-4 gap-6">
                    {/* Row 2 */}
                    <div>
                      <div className="mb-1 text-sm text-[#6B7280]">Vehicle</div>
                      <div className="font-medium">-</div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-[#6B7280]">
                        Start source
                      </div>
                      <div className="font-medium">{charge.charge_method}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-[#6B7280]">
                        kWh limit
                      </div>
                      <div className="font-medium">
                        {charge.kwh_limit || "-"}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-[#6B7280]">
                        Stopped reason
                      </div>
                      <div className="font-medium">{charge.stop_reason}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Charging Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ข้อมูลการชาร์จ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <div className="mb-1 text-sm text-[#6B7280]">
                          เวลาเริ่มต้นการชาร์จ
                        </div>
                        <div className="font-medium">
                          {startDateTime.dateStr}, {startDateTime.timeStr}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm text-[#6B7280]">
                          เวลาสิ้นสุดการชาร์จ
                        </div>
                        <div className="font-medium">
                          {endDateTime.dateStr}, {endDateTime.timeStr}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm text-[#6B7280]">
                          รวมระยะเวลาใช้งาน
                        </div>
                        <div className="font-medium">
                          {(() => {
                            const start = new Date(charge.charge_start_at);
                            const end = new Date(charge.charge_end_at);
                            const diffMs = end.getTime() - start.getTime();
                            const diffHours = Math.floor(
                              diffMs / (1000 * 60 * 60),
                            );
                            const diffMinutes = Math.floor(
                              (diffMs % (1000 * 60 * 60)) / (1000 * 60),
                            );
                            return `${diffHours} ชั่วโมง ${diffMinutes} นาที`;
                          })()}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm text-[#6B7280]">
                          รูปแบบการชาร์จ
                        </div>
                        <div className="font-medium">
                          {charge.charge_method}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="mb-1 text-sm text-[#6B7280]">
                          พลังงานรวม
                        </div>
                        <div className="font-medium">
                          {charge.total_kwh} kWh
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="mb-1 text-sm text-[#6B7280]">
                            เลขมิเตอร์เริ่มต้น
                          </div>
                          <div className="font-medium">
                            {parseFloat(charge.meter_start).toLocaleString()}{" "}
                            kWh
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 text-sm text-[#6B7280]">
                            SOC เริ่มต้น
                          </div>
                          <div className="font-medium">
                            {charge.soc_start_rate} %
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="mb-1 text-sm text-[#6B7280]">
                            เลขมิเตอร์สิ้นสุด
                          </div>
                          <div className="font-medium">
                            {parseFloat(charge.meter_stop).toLocaleString()} kWh
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 text-sm text-[#6B7280]">
                            SOC สิ้นสุด
                          </div>
                          <div className="font-medium">
                            {charge.soc_stop_rate} %
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm text-[#6B7280]">
                          รูปแบบราคา
                        </div>
                        <div className="font-medium">
                          {charge.price_type || "Member Price"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">การคำนวณราคา</CardTitle>
                  <p className="text-sm text-gray-500">Transaction</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6B7280]">Charge ID</span>
                      <span className="font-medium">{charge.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6B7280]">Amount</span>
                      <span className="font-medium">
                        ฿{parseFloat(charge.transaction_amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6B7280]">
                        Transaction amount
                      </span>
                      <span className="font-medium">
                        ฿{parseFloat(charge.transaction_amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6B7280]">
                        Transaction fee
                      </span>
                      <span className="font-medium text-gray-500">
                        (฿{parseFloat(charge.transaction_fee).toFixed(2)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6B7280]">Fee 2.9%</span>
                      <span className="font-medium text-gray-500">
                        {charge.fee
                          ? `(฿${parseFloat(charge.fee).toFixed(2)})`
                          : "(฿0.00)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#6B7280]">VAT 7%</span>
                      <span className="font-medium text-gray-500">
                        (฿{parseFloat(charge.vat_charge).toFixed(2)})
                      </span>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold text-black">
                            Net amount
                          </div>
                          <div className="text-sm text-gray-500">
                            ยอดชำระสุทธิ
                          </div>
                        </div>
                        <div className="text-xl font-bold text-black">
                          ฿{parseFloat(charge.net_amount).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Energy & Pricing Section */}
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h3 className="mb-4 text-lg font-semibold text-black">
                        Energy & Pricing
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-[#6B7280]">
                            kWh charged
                          </span>
                          <span className="font-medium">
                            {charge.total_kwh} kWh
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#6B7280]">
                            Average price per kWh
                          </span>
                          <span className="font-medium">-</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#6B7280]">
                            Price group
                          </span>
                          <span className="font-medium">Default</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-[#6B7280]">Rate</span>
                          <span className="font-medium">
                            ฿{charge.rate || "0.0000"}/kWh
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Charge Point */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="mr-2 h-5 w-5" />
                    Charge point
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="mb-1 text-sm font-light text-[#6B7280]">
                        ชื่อสถานี
                      </h5>
                      <p className="text-base font-medium text-black">
                        {charge.partner_station.charge_point}
                      </p>
                    </div>

                    <div>
                      <h5 className="mb-1 text-sm font-light text-[#6B7280]">
                        เครื่องชาร์จ
                      </h5>
                      <p className="text-base font-medium text-black">
                        OneCharge สาขา สมุทรปราการ
                      </p>
                    </div>

                    <div>
                      <h5 className="mb-1 text-sm font-light text-[#6B7280]">
                        หมายเลขหัวชาร์จ
                      </h5>
                      <p className="text-base font-medium text-black">
                        #{charge.charger_plug_power?.plug_id || "-"}
                      </p>
                    </div>

                    {/* Map */}
                    <div className="mt-6">
                      <ChargePointMap
                        latitude={charge.partner_station.latitude}
                        longitude={charge.partner_station.longtitude}
                        name={charge.partner_station.charge_point}
                        address={charge.partner_station.address}
                        className="h-48 w-full rounded-lg border border-gray-200"
                      />
                    </div>

                    {/* Google Maps Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const lat = charge.partner_station.latitude;
                          const lng = charge.partner_station.longtitude;
                          const url = `https://www.google.com/maps?q=${lat},${lng}`;
                          window.open(url, "_blank");
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polyline
                            points="15,3 21,3 21,9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="10"
                            y1="14"
                            x2="21"
                            y2="3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="font-medium text-black">
                          เปิด Google Maps
                        </span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
