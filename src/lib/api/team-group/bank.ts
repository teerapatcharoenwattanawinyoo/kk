import { API_ENDPOINTS } from "../../constants";
import type {
  BankAccountDetailResponse,
  BankAccountListResponse,
  BankAccountMutationResponse,
  BankListResponse,
  IBankAccount,
  IBankAccountUpdate,
} from "../../schemas/bank";
import { api } from "../config/axios";
import { IResponse } from "../config/model";

// GET /partner/bank-account - Get all bank accounts
export const getBankAccounts = async (): Promise<
  IResponse<BankAccountListResponse>
> => {
  return api.get(API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.LIST);
};

// GET /partner/bank-account/{id} - Get bank account by ID
export const getBankAccountById = async (
  id: number,
): Promise<IResponse<BankAccountDetailResponse>> => {
  const url = API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.GET_BY_ID.replace(
    "{id}",
    id.toString(),
  );
  return api.get(url);
};

// GET /partner/bank-account/bank-lists - Get available banks
export const getBankLists = async (): Promise<IResponse<BankListResponse>> => {
  return api.get(API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.BANK_LISTS);
};

// POST /partner/bank-account - Create new bank account
export const createBankAccount = async (
  data: IBankAccount,
): Promise<IResponse<BankAccountMutationResponse>> => {
  const formData = new FormData();

  formData.append("bank_id", data.bank_id.toString());
  formData.append("account_name", data.account_name);
  formData.append("account_number", data.account_number);
  formData.append("is_primary", data.is_primary.toString());

  if (data.file) {
    formData.append("file", data.file);
  }

  console.log(data);

  return api.post(API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.CREATE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// PATCH /partner/bank-account/{id} - Update bank account
export const updateBankAccount = async (
  id: number,
  data: IBankAccountUpdate,
): Promise<IResponse<BankAccountMutationResponse>> => {
  const url = API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.UPDATE.replace(
    "{id}",
    id.toString(),
  );
  if (data.file) {
    const formData = new FormData();
    if (data.account_name) formData.append("account_name", data.account_name);
    if (data.account_number)
      formData.append("account_number", data.account_number);
    if (data.is_primary !== undefined)
      formData.append("is_primary", data.is_primary.toString());
    if (data.bank_id) formData.append("bank_id", data.bank_id.toString());
    formData.append("file", data.file);

    return api.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    return api.patch(url, data);
  }
};

// DELETE /partner/bank-account/{id} - Delete bank account
export const deleteBankAccount = async (
  id: number,
): Promise<IResponse<BankAccountMutationResponse>> => {
  const url = API_ENDPOINTS.TEAM_GROUPS.REVENUE.BANK.DELETE.replace(
    "{id}",
    id.toString(),
  );
  return api.delete(url);
};

// Re-export types for convenience
export type {
  BankAccountDetailResponse,
  BankAccountListResponse,
  BankAccountMutationResponse,
  BankListResponse,
  IBankAccount,
  IBankAccountUpdate,
};
