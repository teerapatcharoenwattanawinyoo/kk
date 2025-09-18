"use client";

import Image from "next/image";

interface ReceiptNoVatProps {
  receiptData: {
    companyInfo: {
      name: string;
      address: string;
      taxId: string;
      logo?: string;
    };
    receiptInfo: {
      receiptId: string;
      date: string;
      transactionId: string;
    };
    customer: {
      name: string;
      taxId?: string;
      address?: string;
      branch?: string;
    };
    station: {
      name: string;
    };
    payment: {
      method: string;
      date: string;
    };
    items: Array<{
      description: string;
      quantity: string;
      unit: string;
      unitPrice: number;
      total: number;
      details?: {
        startTime: string;
        endTime: string;
        duration: string;
      };
    }>;
    summary: {
      total: number;
      totalText: string;
    };
    notes?: string;
    signature?: {
      image?: string;
      name: string;
      position: string;
    };
  };
}

export const ReceiptNoVat = ({ receiptData }: ReceiptNoVatProps) => {
  return (
    <div className="mx-auto flex h-[297mm] w-[210mm] flex-col justify-between bg-white p-6 font-kanit shadow-lg">
      {/* Main Content */}
      <div className="space-y-4">
        {/* Header Card */}
        <div className="rounded-[20px] border-0 bg-white p-4">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center">
              {receiptData.companyInfo.logo ? (
                <Image
                  src={receiptData.companyInfo.logo}
                  alt="Company Logo"
                  width={100}
                  height={40}
                  className="h-10"
                />
              ) : (
                <div className="flex h-10 w-24 items-center justify-center rounded bg-blue-600 text-sm font-semibold text-white">
                  OneCharge
                </div>
              )}
            </div>
            <button className="rounded-lg border-0 bg-gray-100 px-4 py-2 text-sm font-semibold text-blue-600">
              ใบกำกับภาษี / ใบเสร็จรับเงิน
            </button>
          </div>

          {/* Company Info */}
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <p className="mb-1 text-xs font-light">
                {receiptData.companyInfo.name}
              </p>
              <p className="mb-1 text-xs font-light">
                {receiptData.companyInfo.address}
              </p>
              <p className="mb-3 text-xs font-light">
                เลขประจำตัวผู้เสียภาษี : {receiptData.companyInfo.taxId}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-light">เลขที่</span>
                <span className="text-right font-light">
                  {receiptData.receiptInfo.receiptId}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-light">วันที่</span>
                <span className="text-right font-light">
                  {receiptData.receiptInfo.date}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-light">Transaction Id</span>
                <span className="text-right font-light">
                  {receiptData.receiptInfo.transactionId}
                </span>
              </div>
            </div>
          </div>

          {/* Dotted Line */}
          <div className="my-4 border-t border-dashed border-gray-300"></div>

          {/* User & Station Info */}
          <div className="relative mb-3 grid grid-cols-3 gap-4">
            <div className="relative">
              <p className="mb-2 text-xs text-blue-600">ผู้ใช้งาน</p>
              <p className="mb-2 text-sm font-semibold text-blue-600">
                {receiptData.customer.name}
              </p>
              <p className="mb-0 text-xs">
                เลขประจำตัวผู้เสียภาษี : {receiptData.customer.taxId}
              </p>
              <p className="mb-0 text-xs">{receiptData.customer.address}</p>
              <p className="mb-1 text-xs">
                สำนักงาน/สาขา : {receiptData.customer.branch}
              </p>
              <div className="absolute right-0 top-0 h-[124px] border-r border-gray-300"></div>
            </div>

            <div className="relative">
              <p className="mb-2 text-xs">จุดบริการ</p>
              <p className="mb-1 text-sm font-semibold">
                {receiptData.station.name}
              </p>
              <div className="absolute right-0 top-0 h-[124px] border-r border-gray-300"></div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold text-blue-600">
                การชำระเงิน
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>ช่องทาง</span>
                  <span className="font-semibold">
                    {receiptData.payment.method}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>วัน/เวลาที่ชำระ</span>
                  <span className="font-semibold">
                    {receiptData.payment.date}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-4">
            <table className="w-full">
              <thead>
                <tr className="text-center">
                  <th className="w-[5%] rounded-l-lg bg-blue-600 px-3 py-2 text-xs font-normal text-white">
                    #
                  </th>
                  <th className="w-[40%] bg-blue-600 px-3 py-2 text-left text-xs font-normal text-white">
                    รายละเอียด
                  </th>
                  <th className="w-[15%] bg-blue-600 px-3 py-2 text-xs font-normal text-white">
                    จำนวน
                  </th>
                  <th className="w-[15%] bg-blue-600 px-3 py-2 text-xs font-normal text-white">
                    ราคาต่อหน่วย
                  </th>
                  <th className="w-[15%] rounded-r-lg bg-blue-600 px-3 py-2 text-xs font-normal text-white">
                    ยอดรวม
                  </th>
                </tr>
              </thead>
              <tbody>
                {receiptData.items.map((item, index) => (
                  <>
                    <tr key={index}>
                      <td className="px-4 py-3 text-center text-xs text-gray-600">
                        {index + 1}.
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-black">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-600">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-600">
                        {item.unitPrice}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-gray-600">
                        {item.total}
                      </td>
                    </tr>
                    {item.details && (
                      <tr>
                        <td></td>
                        <td className="px-4 py-0">
                          <div className="mb-1 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="w-1/3 text-gray-500">
                                เวลาเริ่มต้น:
                              </span>
                              <span className="flex-1 text-right font-semibold text-gray-600">
                                {item.details.startTime}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="w-1/3 text-gray-500">
                                เวลาสิ้นสุด:
                              </span>
                              <span className="flex-1 text-right font-semibold text-gray-600">
                                {item.details.endTime}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="w-1/3 text-gray-500">
                                ระยะเวลาชาร์จ:
                              </span>
                              <span className="flex-1 text-right font-semibold text-gray-600">
                                {item.details.duration}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td
                          colSpan={3}
                          className="border-l border-gray-300"
                        ></td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mb-4 grid grid-cols-3 gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold text-black">หมายเหตุ:</p>
              <p className="mb-1 text-xs">
                {receiptData.notes || "เจ้าของสถานีเป็นผู้ออกใบเสร็จให้กับคุณ"}
              </p>
            </div>
            <div className="col-span-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-black">รวมเป็นเงิน</span>
                <span className="font-semibold text-black">
                  {receiptData.summary.total} บาท
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span></span>
                <span className="text-gray-500">
                  ({receiptData.summary.totalText})
                </span>
              </div>
            </div>
          </div>

          {/* Solid Line */}
          <div className="my-4 border-t border-gray-300"></div>

          {/* Signature */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"></div>
            <div className="text-center">
              {receiptData.signature?.image && (
                <Image
                  src={receiptData.signature.image}
                  alt="signature"
                  width={90}
                  height={40}
                  className="mx-auto mb-4 mt-4"
                />
              )}
              <p className="mb-1 text-xs font-semibold">
                {receiptData.signature?.name}
              </p>
              <p className="mb-0 text-xs">{receiptData.signature?.position}</p>
              <div className="my-4 border-t border-gray-300"></div>
              <p className="mb-4 text-xs">ผู้รับเงิน</p>
            </div>
          </div>
        </div>

        {/* Note Card */}
        <div className="mt-5 rounded-[20px] border-0 bg-white p-4">
          <p className="text-[10px] font-light text-black">
            * เป็นการยกเลิกใบกำกับภาษี / ใบเสร็จรับเงินอย่างย่อเลขที่ [{" "}
            {receiptData.receiptInfo.receiptId} ] และ ออกใบกำกับภาษี /
            ใบเสร็จรับเงินแบบเต็มแทน
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto w-full bg-blue-600 p-5 text-center text-white">
        <div className="flex justify-between">
          <span className="text-sm">Powered by OneCharge</span>
          <span className="text-sm">onecharge.co.th</span>
        </div>
      </div>
    </div>
  );
};
