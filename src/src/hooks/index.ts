// UI & Utility Hooks
export { useLocalStorage } from '@/lib/helpers/storage'
export { useLocale } from './use-locale'
export { useIsMobile } from './use-mobile'
export { useSafeSearchParams } from './use-safe-search-params'
export { useToast } from './use-toast'

// API & Data Hooks - Auth
export { useLogin, useLogout, useUser } from '../modules/auth/hooks/use-auth'
export {
  useForgotPassword,
  useResetPassword,
  useVerifyEmailOTP,
  useVerifyPhoneOTP,
} from '../modules/auth/hooks/use-forgot-password'

// API & Data Hooks - Cache
export { useHasCachedData, useTeamFromCache } from './use-cache'

// API & Data Hooks - Chargers
export { useChargersList, useUpdateCharger } from './use-chargers'

// API & Data Hooks - Connectors
export {
  useChargerTypes,
  useConnectorsList,
  useCreateConnector,
  useDeleteConnector,
} from './use-connectors'

// API & Data Hooks - Price Set
export {
  useCreatePriceSet,
  useCreatePriceSetByParent,
  usePriceSet,
  useUpdatePriceSet,
} from '../app/[locale]/(back-office)/team/[teamId]/price-groups/_hooks/use-price-group'

// API & Data Hooks - Station
export {
  useChargingStations,
  useCreateChargingStation,
  useDeleteChargingStation,
  useStationCategories,
  useUpdateChargingStation,
} from '../app/[locale]/(back-office)/team/[teamId]/charging-stations'
