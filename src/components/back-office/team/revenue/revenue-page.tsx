"use client";

import { TeamHeader } from "@/components/back-office/team/team-header";
import { TeamTabs } from "@/components/back-office/team/team-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateTimePicker } from "../../../datetime-picker";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EditIcon,
  ExportIcon,
  RevenueCardIcon,
  WarningIcon,
} from "../../../icons";
import { Separator } from "../../../ui/separator";

interface RevenuePageProps {
  teamId: string;
}

export function RevenuePage({ teamId }: RevenuePageProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("bank");
  const [resultsPerPage, setResultsPerPage] = useState("10");
  const [isAutoWithdrawalEnabled, setIsAutoWithdrawalEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [isDateTimeOpen, setIsDateTimeOpen] = useState(false);

  // Mock data for the team based on teamId
  const teamData = {
    id: teamId,
    name:
      teamId === "onecharge-gang"
        ? "OneCharge Gang"
        : teamId === "one-co-ltd"
          ? "One Co.ltd"
          : teamId === "sitt-group"
            ? "SITT Group"
            : "Delept Tech",
    teamId: "ID Team : ONE678-18907",
    totalRevenue: 17240689.0,
    availableForWithdrawal: 7340000.0,
    lastWithdrawal: "30 กันยายน 2567 13:00 น.",
  };

  // Mock data for transactions
  const transactions = [
    {
      id: 2,
      source: "ค่าบริการชาร์จแพลตฟอร์ม (OneCharge)",
      amount: 3790000.06,
      recipient: "ไทยพาณิชย์ 339****192**1",
      date: "13/01/2024\n13 : 00 : 00",
      status: "สำเร็จ",
    },
    {
      id: 1,
      source: "ค่าบริการชาร์จแพลตฟอร์ม (OneCharge)",
      amount: 90000.06,
      recipient: "ไทยพาณิชย์ 339****192**1",
      date: "13/01/2024\n13 : 00 : 00",
      status: "ยกเลิก",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "สำเร็จ":
        return (
          <Badge className="rounded-md bg-[#DFF8F3] px-4 py-1 font-normal text-[#0D8A72] hover:bg-[#DFF8F3] hover:text-[#0D8A72]">
            {status}
          </Badge>
        );
      case "ยกเลิก":
        return (
          <Badge className="rounded-md bg-[#FFE8D7] px-4 py-1 font-normal text-[#F67416] hover:bg-[#FFE8D7] hover:text-[#F67416]">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleManageBankAccount = () => {
    router.push(`/team/${teamId}/manage-bank-account`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Header Section */}
      <TeamHeader teamId={teamId} pageTitle="Revenue" />

      {/* Navigation Tabs Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <TeamTabs teamId={teamId} activeTab="revenue" />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Revenue Cards Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-8">
            {/* Revenue Wallet Card */}
            <Card className="border-none shadow-md transition-shadow hover:shadow-lg lg:col-span-1">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="text-base font-medium text-[#364A63] sm:text-lg">
                  กระเป๋ารายรับ
                </div>
              </CardHeader>
              <CardContent className="gap-6 pb-4 sm:gap-8 sm:pb-6">
                <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-[#98AEFF] sm:h-36 lg:h-32">
                  <Image
                    src="/assets/images/card/Group5800.svg"
                    alt="Revenue Card Background"
                    fill
                    className="object-cover"
                  />
                  <div className="relative z-10 h-full p-4 text-white sm:p-6">
                    <div className="flex h-full items-center p-2 sm:p-4">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 sm:mr-4 sm:h-12 sm:w-12">
                        <RevenueCardIcon />
                      </div>
                      <div className="flex flex-col">
                        <span className="mb-2 text-sm font-medium sm:text-base">
                          ยอดเตรียมรับโอน
                        </span>
                        <div className="text-xl font-bold sm:text-3xl lg:text-2xl">
                          ฿{" "}
                          {teamData.totalRevenue.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Card className="shadow-xs relative z-10 -mt-4 rounded-2xl border-none bg-card sm:-mt-6">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="mx-4 my-4 mr-2 flex items-center gap-2 text-xs text-primary sm:mx-8 sm:my-6 sm:gap-3">
                        <div className="flex items-start gap-2 text-xs sm:gap-3">
                          <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#EFF3FF] text-primary sm:h-6 sm:w-6">
                            <ClockIcon />
                          </div>
                          <div className="mt-1 flex flex-col">
                            <span className="text-sm text-primary sm:text-base">
                              ถอนครั้งล่าสุด
                            </span>
                            <span className="text-xs text-muted-foreground sm:text-sm">
                              {teamData.lastWithdrawal}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Separator
                        orientation="vertical"
                        className="h-[60px] sm:h-[72px]"
                      />
                      <div className="mr-3 text-right sm:mr-6">
                        <div className="text-xs text-muted-foreground sm:text-sm">
                          ยอดที่ได้รับแล้ว
                        </div>
                        <div className="text-lg font-semibold sm:text-xl">
                          ฿
                          {teamData.availableForWithdrawal.toLocaleString(
                            "th-TH",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Withdrawal Settings Card */}
            <Card className="border-none shadow-md transition-shadow hover:shadow-lg lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="text-base font-medium text-[#364A63] sm:text-lg">
                  การถอนเงิน
                </div>
                <Separator className="my-4 sm:my-6" />
              </CardHeader>
              <CardContent>
                <div className="mb-4 mt-3 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={isAutoWithdrawalEnabled}
                      onCheckedChange={setIsAutoWithdrawalEnabled}
                      className="data-[state=checked]:bg-[#00DD9C]"
                    />
                    <span className="px-1 text-sm font-medium">
                      ถอนอัตโนมัติ
                    </span>
                  </div>
                  <div className="lg:hidden">
                    <Separator className="my-4" />
                  </div>
                  <div className="hidden lg:block">
                    <Separator orientation="vertical" className="h-[72px]" />
                  </div>
                  <RadioGroup
                    defaultValue={withdrawalMethod}
                    onValueChange={setWithdrawalMethod}
                    className="flex flex-col gap-4 sm:mx-auto sm:flex-row sm:items-center sm:gap-6 sm:p-4 lg:mx-0 lg:p-0"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="monthly"
                        className={
                          withdrawalMethod === "monthly"
                            ? "border-primary"
                            : "border-[#C0C0C0]"
                        }
                        id="monthly"
                      />
                      <div className="flex flex-col">
                        <Label
                          htmlFor="monthly"
                          className={`cursor-pointer text-sm ${
                            withdrawalMethod === "monthly"
                              ? "text-primary"
                              : "text-[#949494]"
                          }`}
                        >
                          ทุกสิ้นเดือน
                        </Label>
                        <p
                          className={`text-xs ${
                            withdrawalMethod === "monthly"
                              ? "text-primary"
                              : "text-[#949494]"
                          }`}
                        >
                          (ทุกวันที่ 29 ของเดือน)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="schedule"
                        className={
                          withdrawalMethod === "schedule"
                            ? "border-primary"
                            : "border-[#C0C0C0]"
                        }
                        id="schedule"
                      />
                      <div className="flex flex-col">
                        <Label
                          htmlFor="schedule"
                          className={`cursor-pointer text-sm ${
                            withdrawalMethod === "schedule"
                              ? "text-primary"
                              : "text-[#949494]"
                          }`}
                        >
                          ทุกวันที่ :{" "}
                          {selectedDate && selectedTime
                            ? `${format(selectedDate, "dd")} เวลา ${selectedTime} น.`
                            : "ระบุวันที่"}
                        </Label>
                        <DateTimePicker
                          selectedDate={selectedDate}
                          selectedTime={selectedTime}
                          onDateChange={setSelectedDate}
                          onTimeChange={setSelectedTime}
                          isOpen={isDateTimeOpen}
                          onOpenChange={setIsDateTimeOpen}
                          isEnabled={withdrawalMethod === "schedule"}
                        />
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Separator className="my-4 sm:my-6" />
                <div className="mt-4 rounded-lg bg-[#FFE8D7] p-3 sm:mt-6 sm:p-4">
                  <div className="flex items-start gap-3">
                    <WarningIcon />
                    <div className="text-sm font-medium text-[#F67416]">
                      คุณสามารถถอนเงินได้ฟรี 1 ครั้งต่อเดือน {""}
                      <span className="font-light">
                        ขยับแพ็คเก็จของคุณเพื่อประโยชน์เพิ่มขึ้น
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant={"default"}
                    className="mt-4 w-full px-6 transition-colors hover:bg-primary/90 sm:mt-6 sm:w-auto sm:px-20"
                  >
                    ถอนเงิน
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bank Account Card */}
            <Card className="border-none shadow-md transition-shadow hover:shadow-lg lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-base font-medium text-[#364A63] sm:text-lg">
                    บัญชีธนาคาร
                  </div>
                  <Button
                    variant={"default"}
                    size="sm"
                    className="w-18 sm:w-22 h-7 rounded-xl text-sm transition-colors hover:bg-primary/90 sm:h-8"
                    onClick={handleManageBankAccount}
                  >
                    <p className="text-sm">ตั้งค่า</p>
                  </Button>
                </div>
                <Separator className="my-4 sm:my-6" />
              </CardHeader>
              <CardContent className="mt-3">
                <div className="space-y-4">
                  <div className="rounded-lg bg-[#D0DAFF] p-4 sm:p-6">
                    <div className="mb-3 text-base text-primary sm:text-lg">
                      บัญชีรับเงินหลัก
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
                        <Image
                          src="/assets/images/icons/bank/scb-bank.png"
                          alt="SCB Bank"
                          width={40}
                          height={40}
                          className="rounded-full object-contain sm:h-[45px] sm:w-[45px]"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-primary sm:text-base">
                          ไทยพาณิชย์ 339****192**1
                        </div>
                        <div className="text-sm text-primary sm:text-base">
                          345*****9801
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 transition-colors hover:bg-white/20 sm:h-10 sm:w-10"
                      >
                        <EditIcon />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal History Section */}
          <Card className="border shadow-md transition-shadow hover:shadow-lg">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="text-lg font-semibold text-[#364A63] sm:text-xl">
                รายการของฉัน
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:gap-6">
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                  <Button
                    onClick={() => setActiveTab("pending")}
                    variant={"ghost"}
                    className={`pb-2 text-sm font-medium transition-all duration-200 hover:text-blue-700 sm:text-base ${
                      activeTab === "pending"
                        ? "bg-zinc-950 text-white hover:bg-zinc-800 hover:text-neutral-50"
                        : "bg-[#EEF1FF] text-primary hover:bg-blue-50"
                    }`}
                  >
                    รายการเตรียมโอน
                  </Button>
                  <Button
                    variant={"ghost"}
                    onClick={() => setActiveTab("received")}
                    className={`pb-2 text-sm font-medium transition-all duration-200 hover:text-blue-700 sm:text-base ${
                      activeTab === "received"
                        ? "bg-zinc-950 text-white hover:bg-zinc-800 hover:text-neutral-50"
                        : "bg-[#EEF1FF] text-primary hover:bg-blue-50"
                    }`}
                  >
                    ยอดได้รับแล้ว
                  </Button>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative w-full max-w-md">
                    <Input
                      placeholder="ค้นหา"
                      className="h-10 border-slate-200 bg-[#ECF2F8] pl-4 pr-10 placeholder:font-medium placeholder:text-[#A1B1D1]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <Search className="h-4 w-4 text-[#A1B1D1]" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 gap-1 whitespace-nowrap bg-[#ECF2F8]"
                  >
                    <span className="hidden text-[#A1B1D1] sm:inline">
                      ดูทั้งหมด / ช่วงเวลา
                    </span>
                    <span className="text-[#A1B1D1] sm:hidden">ตัวกรอง</span>
                    <ChevronDownIcon />
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <div className="block sm:hidden">
                  {/* Mobile Card View */}
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="shadow-xs rounded-lg border bg-white p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            NO. {transaction.id}
                          </div>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">ยอดที่ได้รับ:</span>
                            <div className="break-words text-blue-600">
                              {transaction.source}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">จำนวนเงิน:</span>
                            <div className="font-medium text-gray-900">
                              {transaction.amount.toLocaleString("th-TH", {
                                minimumFractionDigits: 2,
                              })}{" "}
                              ฿
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">บัญชีปลายทาง:</span>
                            <div className="text-[#6E82A5]">
                              {transaction.recipient}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              รอบโอนจ่ายวันที่:
                            </span>
                            <div className="whitespace-pre-line text-[#6E82A5]">
                              {transaction.date}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-[#818894] hover:text-[#818894]"
                          >
                            <ExportIcon />
                            <span>Export</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:block">
                  {/* Desktop Table View */}
                  <table className="min-w-full border-separate border-spacing-y-2">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="rounded-l-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          NO.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          ยอดที่ได้รับ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          จำนวนเงิน
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          บัญชีปลายทาง
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          รอบโอนจ่ายวันที่
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          สถานะ
                        </th>
                        <th className="rounded-r-lg px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="shadow-xs rounded-lg bg-white hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap rounded-l-lg px-4 py-3 text-sm text-gray-900">
                            {transaction.id}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-blue-600">
                            {transaction.source}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                            {transaction.amount.toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                            })}{" "}
                            ฿
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-[#6E82A5]">
                            {transaction.recipient}
                          </td>
                          <td className="whitespace-pre-line px-4 py-3 text-sm text-[#6E82A5]">
                            {transaction.date}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            {getStatusBadge(transaction.status)}
                          </td>
                          <td className="whitespace-nowrap rounded-r-lg px-4 py-3 text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-[#818894] hover:text-[#818894]"
                            >
                              <ExportIcon />
                              <span>Export</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-sm text-gray-700">
                  Showing 1 to 10 of 130 Results
                </div>
                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <select
                    className="h-8 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                    value={resultsPerPage}
                    onChange={(e) => setResultsPerPage(e.target.value)}
                  >
                    <option value="10">10 List</option>
                    <option value="20">20 List</option>
                    <option value="50">50 List</option>
                  </select>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 font-medium text-primary">
                      1
                    </div>
                    <div className="hidden items-center space-x-1 sm:flex">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        2
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        3
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        4
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        5
                      </Button>
                      <span className="px-2">...</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        10
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRightIcon />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
