// UI & Utility Hooks
export { useLocalStorage } from "@/lib/helpers/storage";
export { useLocale } from "./use-locale";
export { useIsMobile } from "./use-mobile";
export { useSafeSearchParams } from "./use-safe-search-params";
export { useToast } from "./use-toast";

// API & Data Hooks - Auth
export { useLogin, useLogout, useUser } from "./use-auth";
export {
  useForgotPassword,
  useResetPassword,
  useVerifyEmailOTP,
  useVerifyPhoneOTP,
} from "./use-forgot-password";

// API & Data Hooks - Cache
export { useHasCachedData, useTeamFromCache } from "./use-cache";

// API & Data Hooks - Chargers
export { useChargersList, useUpdateCharger } from "./use-chargers";

// API & Data Hooks - Connectors
export {
  useChargerTypes,
  useConnectorsList,
  useCreateConnector,
  useDeleteConnector,
} from "./use-connectors";

// API & Data Hooks - Price Set
export {
  useCreatePriceSet,
  useCreatePriceSetByParent,
  usePriceSet,
  useUpdatePriceSet,
} from "./use-price-group";

// API & Data Hooks - Station
export {
  useChargingStations,
  useCreateChargingStation,
  useDeleteChargingStation,
  useStationCategories,
  useUpdateChargingStation,
} from "./use-charging-stations";

// API & Data Hooks - Team
export {
  useCreateTeam,
  useDeleteTeam,
  useTeam,
  useTeamHostById,
  useTeamHostId,
  useTeamHostList,
  useTeamList,
  useUpdateTeam,
  useUserData,
} from "./use-teams";

// API & Data Hooks - Teams (Multiple)
export { useTeams } from "./use-teams";

// API & Data Hooks - Tax
export {
  useCreateTaxInformation,
  useCreateTaxInvoiceReceipt,
  useDeleteTaxInvoiceReceipt,
  useFileUpload,
  useTaxInvoiceReceipt,
  useTaxTypes,
  useUpdateInvoiceNumberPrefix,
  useUpdateReceiptTaxInvoice,
  useUpdateTaxInvoiceReceipt,
} from "./use-tax";

// API & Data Hooks - Transaction
export {
  useTransactionList,
  type TransactionItem,
  type TransactionListParams,
  type TransactionListResponse,
} from "./use-transaction";

// API & Data Hooks - Bank
export {
  BANK_QUERY_KEYS,
  useBankAccountById,
  useBankAccounts,
  useBankLists,
  useCreateBankAccount,
  useDeleteBankAccount,
  useUpdateBankAccount,
  type IBankAccount,
  type IBankAccountUpdate,
} from "./use-bank";

// API & Data Hooks - Revenue
export { useRevenueBalance } from "./use-revenue";

// API & Data Hooks - Payout
export {
  useConfirmPayout,
  useInitPayout,
  type PayoutConfirmRequest,
  type PayoutInitRequest,
} from "./use-payout";
