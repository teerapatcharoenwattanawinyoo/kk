'use client'

import { useCallback, useMemo, useState } from 'react'

import type {
  ChargerListItem,
  EditChargerInitialValues,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'
import { getChargerDetail } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/charger'
import { useI18n } from '@/lib/i18n'

export type ConnectionDisplay =
  | { type: 'text'; value: string }
  | { type: 'action'; label: string; onClick: () => void }

export type StatusBadgeConfig = {
  badgeClass: string
  textClass: string
}

export interface UseChargersTableControllerProps {
  onEditCharger: (values: EditChargerInitialValues) => void
  onSetIntegration: (chargerId: number) => void
}

type UseChargersTableControllerResult = {
  i18n: { t: ReturnType<typeof useI18n>['t'] }
  loadingChargerId: string | null
  getStatusBadgeConfig: (status: string) => StatusBadgeConfig
  getConnectionDisplay: (charger: ChargerListItem) => ConnectionDisplay
  openEditDialog: (charger: ChargerListItem) => Promise<void>
}

const STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  Available: {
    badgeClass: 'bg-[#DFF8F3] hover:bg-[#DFF8F3]',
    textClass: 'text-[#0D8A72] hover:text-[#0D8A72]',
  },
  Integrate: {
    badgeClass: 'bg-[#FFE5D1] hover:bg-[#FFE5D1]',
    textClass: 'text-[#FF9640] hover:text-[#FF9640]',
  },
  Charging: {
    badgeClass: 'bg-[#FFE5D1] hover:bg-[#FFE5D1]',
    textClass: 'text-[#FF9640] hover:text-[#FF9640]',
  },
}

const DEFAULT_STATUS_CONFIG: StatusBadgeConfig = {
  badgeClass: 'bg-destructive/10 hover:bg-destructive/20',
  textClass: 'text-destructive hover:text-destructive',
}

const mapApiAccessToForm = (access: string | null | undefined): string => {
  if (!access) return ''
  const normalized = access.toString().trim().toLowerCase()

  switch (normalized) {
    case 'public':
    case '1':
      return '1'
    case 'private':
    case '2':
      return '2'
    case 'unavailable':
    case '3':
      return '3'
    default:
      return ''
  }
}

const mapPowerLevel = (maxPower?: string | null) => {
  if (!maxPower) return ''
  return `${maxPower}kW`
}

export function useChargersTableController({
  onEditCharger,
  onSetIntegration,
}: UseChargersTableControllerProps): UseChargersTableControllerResult {
  const { t } = useI18n()
  const [loadingChargerId, setLoadingChargerId] = useState<string | null>(null)

  const getStatusBadgeConfig = useCallback((status: string): StatusBadgeConfig => {
    return STATUS_CONFIG[status] ?? DEFAULT_STATUS_CONFIG
  }, [])

  const buildEditValues = useCallback(
    (detail: Awaited<ReturnType<typeof getChargerDetail>>['data']): EditChargerInitialValues => ({
      id: detail.id.toString(),
      chargerName: detail.name || '',
      chargerAccess: mapApiAccessToForm(detail.aceesibility ?? null),
      selectedBrand: detail.brand_id?.toString() || '',
      selectedModel: detail.model_id?.toString() || '',
      typeConnector: detail.charger_type || '',
      selectedPowerLevel: mapPowerLevel(detail.max_power),
      selectedChargingStation: detail.station_id?.toString() || '',
      serialNumber: detail.serial_number || '',
      selectedTeam: detail.team_group_id?.toString() || '',
    }),
    [],
  )

  const openEditDialog = useCallback(
    async (charger: ChargerListItem) => {
      if (!charger.id) return

      const chargerId = charger.id.toString()
      setLoadingChargerId(chargerId)

      try {
        const response = await getChargerDetail(charger.id)
        if (response.statusCode !== 200 || !response.data) {
          return
        }

        const mappedValues = buildEditValues(response.data)
        onEditCharger(mappedValues)
      } catch (error) {
        console.error('Error fetching charger detail:', error)
      } finally {
        setLoadingChargerId(null)
      }
    },
    [buildEditValues, onEditCharger],
  )

  const handleSetIntegration = useCallback(
    async (charger: ChargerListItem) => {
      if (!charger.id || typeof charger.id !== 'number') {
        return
      }

      onSetIntegration(charger.id)
      await openEditDialog(charger)
    },
    [onSetIntegration, openEditDialog],
  )

  const getConnectionDisplay = useCallback(
    (charger: ChargerListItem): ConnectionDisplay => {
      if (charger.connection === 'Set Integration') {
        return {
          type: 'action',
          label: 'Set Integration',
          onClick: () => {
            void handleSetIntegration(charger)
          },
        }
      }

      return { type: 'text', value: charger.connection }
    },
    [handleSetIntegration],
  )

  return useMemo(
    () => ({
      i18n: { t },
      loadingChargerId,
      getStatusBadgeConfig,
      getConnectionDisplay,
      openEditDialog,
    }),
    [
      t,
      loadingChargerId,
      getStatusBadgeConfig,
      getConnectionDisplay,
      openEditDialog,
    ],
  )
}
