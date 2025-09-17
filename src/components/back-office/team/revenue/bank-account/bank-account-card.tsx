"use client";

import DeleteConfirmDialog from "@/components/notifications/delete-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteBankAccount, useUpdateBankAccount } from "@/hooks/use-bank";
import { Button, Card, CardContent, Switch } from "@/ui";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useState } from "react";
import type { BankAccount } from "./bank-account-item";

interface BankAccountCardProps {
  account: BankAccount;
  isSelected: boolean;
  onToggle: (accountId: number, isEnabled: boolean) => void;
  onEdit: (accountId: number) => void;
  onDelete: (accountId: number) => void;
}

// Status badge component
const StatusBadge = memo(({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approve":
        return {
          text: "Approved",
          className: "bg-green-100 text-green-800",
        };
      case "waiting":
        return {
          text: "Waiting Approve",
          className: "bg-orange-100 text-orange-800",
        };
      case "unapprove":
        return {
          text: "Unapprove",
          className: "bg-gray-100 text-gray-800",
        };
      default:
        return {
          text: status,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const { text, className } = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`}
    >
      <div
        className={`mr-1 h-1.5 w-1.5 rounded-full ${status === "approve" ? "bg-green-500" : status === "waiting" ? "bg-orange-500" : "bg-gray-400"}`}
      />
      {text}
    </span>
  );
});
StatusBadge.displayName = "StatusBadge";

export const BankAccountCard = memo(
  ({ account, onToggle, onEdit, onDelete }: BankAccountCardProps) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const updateBankAccountMutation = useUpdateBankAccount();
    const deleteBankAccountMutation = useDeleteBankAccount();

    const handleToggle = useCallback(
      (checked: boolean) => {
        updateBankAccountMutation.mutate({
          id: account.id,
          data: {
            is_primary: checked,
          },
        });

        onToggle(account.id, checked);
      },
      [account.id, onToggle, updateBankAccountMutation],
    );

    const handleEdit = useCallback(() => {
      onEdit(account.id);
    }, [account.id, onEdit]);

    const handleDeleteClick = useCallback(() => {
      setShowDeleteDialog(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
      deleteBankAccountMutation.mutate(account.id, {
        onSuccess: () => {
          setShowDeleteDialog(false);
          onDelete(account.id);
        },
      });
    }, [account.id, deleteBankAccountMutation, onDelete]);

    return (
      <Card className="relative transition-all duration-200 hover:shadow-md">
        <CardContent className="p-6">
          {/* Header with bank info */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* Bank Logo */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                {account?.bank_logo && (
                  <Image
                    src={account.bank_logo}
                    alt={account.bank_name || "Bank logo"}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                )}
              </div>

              {/* Bank Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {account.bank_name || "Unknown Bank"}
                </h3>
                <p className="text-sm text-gray-600">
                  {account.account_number}
                </p>
              </div>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                {account.status !== "approve" && (
                  <DropdownMenuItem
                    onClick={handleDeleteClick}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Account Name */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">{account.account_name}</p>
          </div>

          {/* Status and Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              {/* Status Badge */}
              {account.status && <StatusBadge status={account.status} />}

              {/* Primary Badge */}
              {account.is_primary && (
                <span className="inline-flex w-fit items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  บัญชีหลัก
                </span>
              )}
            </div>

            {/* Toggle Switch */}
            {!account.is_primary && (
              <div className="flex items-center">
                <Switch
                  checked={account.is_primary}
                  onCheckedChange={handleToggle}
                  disabled={updateBankAccountMutation.isPending}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            )}
          </div>
        </CardContent>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="ลบบัญชีธนาคาร"
          description={`Are you sure you want to delete \n Your Bank Account ?`}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteBankAccountMutation.isPending}
        />
      </Card>
    );
  },
);

BankAccountCard.displayName = "BankAccountCard";
