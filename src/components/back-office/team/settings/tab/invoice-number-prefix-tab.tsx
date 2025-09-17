"use client";

import {
  useTaxInvoiceReceipt,
  useUpdateInvoiceNumberPrefix,
} from "@/hooks/use-tax";
import { colors } from "@/lib/utils/colors";
import { Button, Input } from "@/ui";
import { useCallback, useEffect, useState } from "react";

interface InvoiceNumberPrefixTabProps {
  teamId: string;
}

export const InvoiceNumberPrefixTab = ({
  teamId,
}: InvoiceNumberPrefixTabProps) => {
  const [headerDocument, setHeaderDocument] = useState("INV");
  const [endDocument, setEndDocument] = useState("000001");
  const [selectedDocumentType, setSelectedDocumentType] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<{
    header_document: string;
    end_document: string;
    format_document: number;
    [key: string]: unknown;
  } | null>(null);

  // API hooks
  const {
    data: taxInvoiceReceiptData,
    isLoading,
    error,
  } = useTaxInvoiceReceipt(teamId);
  const updateMutation = useUpdateInvoiceNumberPrefix(teamId);

  // Check if data exists (not 204)
  const hasExistingData = taxInvoiceReceiptData?.data && !error;

  // Load existing data into form
  useEffect(() => {
    if (hasExistingData && taxInvoiceReceiptData?.data) {
      const data = taxInvoiceReceiptData.data;
      setHeaderDocument(data.header_document);
      setEndDocument(data.end_document);
      setSelectedDocumentType(data.format_document);
      setOriginalData(data);
      setHasChanges(false);
    }
  }, [hasExistingData, taxInvoiceReceiptData]);

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const currentData = {
        header_document: headerDocument,
        end_document: endDocument,
        format_document: selectedDocumentType,
      };

      const dataChanged =
        currentData.header_document !== originalData.header_document ||
        currentData.end_document !== originalData.end_document ||
        currentData.format_document !== originalData.format_document;

      setHasChanges(dataChanged);
    }
  }, [headerDocument, endDocument, selectedDocumentType, originalData]);

  const handleDocumentTypeChange = useCallback((type: number) => {
    setSelectedDocumentType(type);
  }, []);

  const handleResetStartingNumber = useCallback(() => {
    setEndDocument("000001");
  }, []);

  const handleSave = async () => {
    const data = {
      format_document: selectedDocumentType,
      header_document: headerDocument,
      center_document: "",
      end_document: endDocument,
      status_document: "1",
      team_group_id: teamId,
    };

    try {
      // ใช้ updateMutation ทั้งในกรณี create และ update
      await updateMutation.mutateAsync(data);
      if (hasExistingData) {
        alert("อัปเดตข้อมูลเรียบร้อย");
      } else {
        alert("สร้างข้อมูลเรียบร้อย");
      }
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Warning Message */}
      {hasChanges && hasExistingData && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-yellow-800">
              มีการเปลี่ยนแปลงข้อมูล กรุณากดปุ่ม Update
              เพื่อบันทึกการเปลี่ยนแปลง
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-title mb-4 text-lg font-semibold">
          Header : Receipt
        </h3>

        {/* Receipt/Tax Invoice Input */}
        <div className="mb-8">
          <Input
            value={headerDocument}
            onChange={(e) => setHeaderDocument(e.target.value)}
            placeholder="Receipt/Tax Invoice"
            className="w-full bg-input"
          />
        </div>
      </div>

      {/* Select Type Document */}
      <div className="mb-8">
        <h4 className="text-title mb-4 text-base font-semibold">
          Select Type Document
        </h4>
        <div className="flex flex-wrap gap-4">
          {[
            { value: "1", label: "Starter INV" },
            { value: "2", label: "YY/MM/DD" },
            { value: "3", label: "YY/MM" },
            { value: "4", label: "Year" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center"
            >
              <input
                type="radio"
                name="documentType"
                value={option.value}
                checked={String(selectedDocumentType) === option.value}
                onChange={(e) =>
                  handleDocumentTypeChange(Number(e.target.value))
                }
                className="sr-only"
              />
              <div
                className={`flex items-center space-x-2 rounded-lg border-2 px-4 py-2 transition-colors ${
                  String(selectedDocumentType) === option.value
                    ? "border bg-primary text-primary-foreground"
                    : "border bg-input text-muted-foreground"
                }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    String(selectedDocumentType) === option.value
                      ? "bg-white"
                      : "border-2 border-gray-300"
                  }`}
                >
                  {String(selectedDocumentType) === option.value && (
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  )}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Starting Number */}
      <div className="mb-8">
        <h4 className="text-title mb-4 text-base font-semibold">
          Starting Number
        </h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              value={headerDocument}
              onChange={(e) => setHeaderDocument(e.target.value)}
              className="text-title w-full bg-input"
            />
          </div>
          <div className="flex-1">
            <Input
              value={endDocument}
              onChange={(e) => setEndDocument(e.target.value)}
              className="w-full bg-input text-right"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetStartingNumber}
            className="flex items-center border text-muted-foreground"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 border-t pt-6">
        {hasExistingData ? (
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
            className="px-6 py-2 text-white"
            style={{
              backgroundColor: hasChanges
                ? colors.primary[500]
                : colors.neutral[400],
            }}
          >
            {updateMutation.isPending ? "กำลังอัปเดต..." : "UPDATE"}
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-6 py-2 text-white"
            variant={"default"}
          >
            {updateMutation.isPending ? "กำลังสร้าง..." : "CREATE"}
          </Button>
        )}
      </div>
    </div>
  );
};
