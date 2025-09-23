'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
  checkConnection,
  getChargerBrands,
  getChargerTypes,
  getTeamChargingStations,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/charger'
import {
  ChargerFormSchema,
  type ChargerBrand,
  type ChargerFormData,
  type ChargerType,
  type ChargingStation,
  type CreateChargerRequest,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'
import { TeamHostData } from '@/app/[locale]/(back-office)/team/_schemas/team.schema'
import { getTeamHostList } from '@/lib/api/team-group/team'

import { useCreateCharger, useUpdateSerialNumber } from './use-chargers'

type StepDescriptor = {
  id: number
  title: string
}

type StepStatus = 'current' | 'upcoming'

export interface UseAddChargerDialogControllerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  teamGroupId?: string
}

type BasicInfoState = {
  chargerBrands: ChargerBrand[]
  chargerTypes: ChargerType[]
  chargingStations: ChargingStation[]
  teamOptions: TeamHostData[]
  selectedBrand: string
  selectedModel: string
  modelOptions: ChargerBrand['models']
  powerLevelOptions: string[]
  onChargerNameChange: (value: string) => void
  onChargerAccessChange: (value: string) => void
  onBrandChange: (value: string) => void
  onModelChange: (value: string) => void
  onTypeConnectorChange: (value: string) => void
  onChargingStationChange: (value: string) => void
}

type OcppIntegrationState = {
  chargerName: string
  serialNumber: string
  onSerialNumberChange: (value: string) => void
}

type StepState = {
  steps: StepDescriptor[]
  currentStep: number
  totalSteps: number
  setCurrentStep: (step: number) => void
  getStatus: (stepId: number) => StepStatus
  goToPrevious: () => void
  goToNext: () => Promise<void>
  isSubmitting: boolean
}

type DialogState = {
  open: boolean
  isControlled: boolean
  handleOpenChange: (open: boolean) => void
}

type ConfirmDialogState = {
  open: boolean
  setOpen: (open: boolean) => void
  handleConfirm: () => void
}

type OcppDialogState = {
  open: boolean
  setOpen: (open: boolean) => void
  ocppUrl: string
  setOcppUrl: (value: string) => void
  ocppUrlInputRef: React.RefObject<HTMLInputElement>
  serialNumberForDialog: string
}

type StatusState = {
  isActive: boolean
  onActiveChange: (value: boolean) => void
}

type UseAddChargerDialogControllerResult = {
  form: UseFormReturn<ChargerFormData>
  dialog: DialogState
  status: StatusState
  stepper: StepState
  basicInfo: BasicInfoState
  ocppIntegration: OcppIntegrationState
  confirmDialog: ConfirmDialogState
  ocppDialog: OcppDialogState
}

const DEFAULT_OCPP_URL = process.env.NEXT_PUBLIC_OCPP_BASE_URL || 'ws://ocpp.onecharge.co.th'

export function useAddChargerDialogController({
  open,
  onOpenChange,
  teamGroupId,
}: UseAddChargerDialogControllerProps): UseAddChargerDialogControllerResult {
  const isControlled = open !== undefined && onOpenChange !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const dialogOpen = isControlled ? Boolean(open) : internalOpen

  const setDialogOpen = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen)
      } else {
        setInternalOpen(nextOpen)
      }
    },
    [isControlled, onOpenChange],
  )

  const form = useForm<ChargerFormData>({
    resolver: zodResolver(ChargerFormSchema),
    defaultValues: {
      chargerName: '',
      chargerAccess: '',
      selectedBrand: '',
      selectedModel: '',
      typeConnector: '',
      selectedPowerLevel: '',
      selectedChargingStation: '',
      serialNumber: '',
      selectedTeam: '',
    },
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [showOcppDialog, setShowOcppDialog] = useState(false)

  const [chargerName, setChargerName] = useState('')
  const [chargerAccess, setChargerAccess] = useState('')
  const [typeConnector, setTypeConnector] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [completedSerialNumber, setCompletedSerialNumber] = useState('')

  const [chargerBrands, setChargerBrands] = useState<ChargerBrand[]>([])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')

  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([])
  const [selectedChargingStation, setSelectedChargingStation] = useState('')

  const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([])
  const [teamOptions, setTeamOptions] = useState<TeamHostData[]>([])
  const [ocppUrl, setOcppUrl] = useState(DEFAULT_OCPP_URL)

  const ocppUrlInputRef = useRef<HTMLInputElement>(null)
  const createdChargerIdRef = useRef<number | null>(null)

  const createChargerMutation = useCreateCharger(teamGroupId)
  const updateSerialNumberMutation = useUpdateSerialNumber()

  const resetFormState = useCallback(() => {
    setCurrentStep(1)
    setIsActive(false)
    setConfirmDialogOpen(false)
    setShowOcppDialog(false)
    setChargerName('')
    setChargerAccess('')
    setTypeConnector('')
    setSerialNumber('')
    setCompletedSerialNumber('')
    setSelectedBrand('')
    setSelectedModel('')
    setSelectedChargingStation('')
    createdChargerIdRef.current = null
    setOcppUrl(DEFAULT_OCPP_URL)
    form.reset({
      chargerName: '',
      chargerAccess: '',
      selectedBrand: '',
      selectedModel: '',
      typeConnector: '',
      selectedPowerLevel: '',
      selectedChargingStation: '',
      serialNumber: '',
      selectedTeam: '',
    })
  }, [form])

  const handleDialogOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetFormState()
      }
      setDialogOpen(nextOpen)
    },
    [resetFormState, setDialogOpen],
  )

  useEffect(() => {
    if (!dialogOpen) {
      return
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [brandsResponse, typesResponse, teamsResponse] = await Promise.all([
          getChargerBrands(),
          getChargerTypes(),
          getTeamHostList(),
        ])

        setChargerBrands(brandsResponse.data)
        setChargerTypes(typesResponse.data)
        setTeamOptions(teamsResponse.data.data)

        if (teamGroupId) {
          const stationsResponse = await getTeamChargingStations(teamGroupId)
          if (
            stationsResponse &&
            stationsResponse.data &&
            Array.isArray(stationsResponse.data.data)
          ) {
            setChargingStations(stationsResponse.data.data)
          } else {
            setChargingStations([])
          }
        } else {
          setChargingStations([])
        }
      } catch (error) {
        console.error('Failed to fetch charger metadata', error)
        toast.error('Could not fetch charger information. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dialogOpen, teamGroupId])

  const modelOptions = useMemo(() => {
    const brand = chargerBrands.find((b) => b.id.toString() === selectedBrand)
    return brand?.models ?? []
  }, [chargerBrands, selectedBrand])

  const powerLevelOptions = useMemo(() => {
    const model = chargerBrands
      .flatMap((brand) => brand.models)
      .find((item) => item.id.toString() === selectedModel)

    if (!model?.power_levels) {
      return []
    }

    return model.power_levels
      .split(',')
      .map((level) => level.trim())
      .filter((level) => level.length > 0)
  }, [chargerBrands, selectedModel])

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeamHostList()
        setTeamOptions(response.data.data)
      } catch (error) {
        console.error('Failed to fetch teams', error)
        setTeamOptions([])
      }
    }

    fetchTeams()
  }, [])

  const steps: StepDescriptor[] = useMemo(
    () => [
      { id: 1, title: 'Basic Info' },
      { id: 2, title: 'OCPP Integration' },
    ],
    [],
  )

  const mapChargerAccessToApi = useCallback((access: string) => {
    if (['1', '2', '3'].includes(access)) return access

    switch (access.trim().toLowerCase()) {
      case 'public':
        return '1'
      case 'private':
        return '2'
      case 'unavailable':
        return '3'
      default:
        return ''
    }
  }, [])

  const resolvePartnerId = useCallback(() => {
    const candidateKeys = ['user_data', 'userData', 'auth', 'customer_data', 'user'] as const

    for (const key of candidateKeys) {
      const stored = localStorage.getItem(key)
      if (!stored) continue

      try {
        const parsed = JSON.parse(stored)
        const partnerId = parsed?.user?.customer_id ?? parsed?.customer_id
        if (partnerId) {
          return partnerId
        }
      } catch (error) {
        console.error('Failed to parse localStorage value for key', key, error)
      }
    }

    return null
  }, [])

  const handleNext = useCallback(async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger([
        'chargerName',
        'chargerAccess',
        'selectedBrand',
        'selectedModel',
        'selectedChargingStation',
        'selectedTeam',
      ])

      if (!isValid) {
        toast.error('Please fill in all required fields.')
        return
      }

      if (!teamGroupId) {
        toast.error('Team group id is missing. Please try again.')
        return
      }

      const partnerId = resolvePartnerId()
      if (!partnerId) {
        toast.error('Partner ID not found. Please login again.')
        return
      }

      try {
        setIsLoading(true)

        const selectedPowerLevelValue = form.getValues('selectedPowerLevel')
        const maxKwh = selectedPowerLevelValue
          ? selectedPowerLevelValue.replace(/kW/gi, '').trim()
          : '0'

        const payload: CreateChargerRequest = {
          partner_id: partnerId,
          station_id: parseInt(selectedChargingStation, 10),
          team_group_id: parseInt(teamGroupId, 10),
          charger_name: chargerName,
          charger_access: mapChargerAccessToApi(chargerAccess),
          max_kwh: maxKwh,
          charger_type_id: (() => {
            const found = chargerTypes.find((type) => type.name === typeConnector)
            return found ? found.id : 0
          })(),
          brand: parseInt(selectedBrand, 10),
          model: parseInt(selectedModel, 10),
        }

        const response = await createChargerMutation.mutateAsync(payload)
        const newId = response?.data?.data?.id

        if (!newId) {
          toast.error('Failed to create charger. Please try again.')
          return
        }

        createdChargerIdRef.current = newId
        setConfirmDialogOpen(true)
      } catch (error) {
        console.error('Failed to create charger', error)
        toast.error('Failed to create charger. Please try again.')
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (currentStep === 2) {
      if (!serialNumber.trim()) {
        toast.error('Please enter a serial number.')
        return
      }

      if (!createdChargerIdRef.current) {
        toast.error('Charger ID is missing. Please create the charger again.')
        return
      }

      try {
        setIsLoading(true)
        const payload = {
          charger_code: serialNumber.trim(),
          charger_id: Number(createdChargerIdRef.current),
        }

        const response = await updateSerialNumberMutation.mutateAsync(payload)
        if (response.statusCode !== 200 && response.statusCode !== 201) {
          toast.error('Failed to register charger code.')
          return
        }

        await new Promise((resolve) => setTimeout(resolve, 2000))
        await checkConnection(serialNumber.trim())

        setCompletedSerialNumber(serialNumber.trim())
        setShowOcppDialog(true)
        handleDialogOpenChange(false)
      } catch (error) {
        console.error('Failed to register serial number', error)
        toast.error('Failed to complete charger setup.')
      } finally {
        setIsLoading(false)
      }
    }
  }, [
    chargerAccess,
    chargerName,
    chargerTypes,
    createChargerMutation,
    currentStep,
    form,
    handleDialogOpenChange,
    mapChargerAccessToApi,
    resolvePartnerId,
    selectedBrand,
    selectedChargingStation,
    selectedModel,
    serialNumber,
    teamGroupId,
    typeConnector,
    updateSerialNumberMutation,
  ])

  const handleConfirmNext = useCallback(() => {
    setConfirmDialogOpen(false)
    setCurrentStep(2)
  }, [])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((step) => Math.max(1, step - 1))
    }
  }, [currentStep])

  const getStatus = useCallback(
    (stepId: number): StepStatus => {
      if (stepId === currentStep) {
        return 'current'
      }
      return 'upcoming'
    },
    [currentStep],
  )

  const basicInfoState: BasicInfoState = {
    chargerBrands,
    chargerTypes,
    chargingStations,
    teamOptions,
    selectedBrand,
    selectedModel,
    modelOptions,
    powerLevelOptions,
    onChargerNameChange: setChargerName,
    onChargerAccessChange: setChargerAccess,
    onBrandChange: (value: string) => {
      setSelectedBrand(value)
      setSelectedModel('')
      form.setValue('selectedPowerLevel', '')
    },
    onModelChange: (value: string) => {
      setSelectedModel(value)
      form.setValue('selectedPowerLevel', '')
    },
    onTypeConnectorChange: setTypeConnector,
    onChargingStationChange: setSelectedChargingStation,
  }

  const ocppIntegrationState: OcppIntegrationState = {
    chargerName,
    serialNumber,
    onSerialNumberChange: setSerialNumber,
  }

  const dialogState: DialogState = {
    open: dialogOpen,
    isControlled,
    handleOpenChange: handleDialogOpenChange,
  }

  const statusState: StatusState = {
    isActive,
    onActiveChange: setIsActive,
  }

  const stepState: StepState = {
    steps,
    currentStep,
    totalSteps: steps.length,
    setCurrentStep,
    getStatus,
    goToPrevious: handleBack,
    goToNext: handleNext,
    isSubmitting: isLoading,
  }

  const confirmDialogState: ConfirmDialogState = {
    open: confirmDialogOpen,
    setOpen: setConfirmDialogOpen,
    handleConfirm: handleConfirmNext,
  }

  const ocppDialogState: OcppDialogState = {
    open: showOcppDialog,
    setOpen: setShowOcppDialog,
    ocppUrl,
    setOcppUrl,
    ocppUrlInputRef,
    serialNumberForDialog: completedSerialNumber || serialNumber,
  }

  return {
    form,
    dialog: dialogState,
    status: statusState,
    stepper: stepState,
    basicInfo: basicInfoState,
    ocppIntegration: ocppIntegrationState,
    confirmDialog: confirmDialogState,
    ocppDialog: ocppDialogState,
  }
}
