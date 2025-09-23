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
  type EditChargerInitialValues,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'
import { TeamHostData } from '@/app/[locale]/(back-office)/team/_schemas/team.schema'
import { getTeamHostList } from '@/lib/api/team-group/team'

import { useUpdateCharger, useUpdateSerialNumber } from './use-chargers'

const DEFAULT_OCPP_URL = process.env.NEXT_PUBLIC_OCPP_BASE_URL || 'ws://ocpp.onecharge.co.th'

type StepStatus = 'current' | 'upcoming'

type StepDescriptor = {
  id: number
  title: string
}

export interface UseEditChargerDialogControllerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  teamGroupId?: string
  initialValues?: Partial<EditChargerInitialValues>
  initialStep?: number
}

type DialogState = {
  open: boolean
  isControlled: boolean
  handleOpenChange: (open: boolean) => void
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

type StatusState = {
  isActive: boolean
  onActiveChange: (value: boolean) => void
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

type UseEditChargerDialogControllerResult = {
  form: UseFormReturn<ChargerFormData>
  dialog: DialogState
  stepper: StepState
  status: StatusState
  basicInfo: BasicInfoState
  ocppIntegration: OcppIntegrationState
  confirmDialog: ConfirmDialogState
  ocppDialog: OcppDialogState
}

export function useEditChargerDialogController({
  open,
  onOpenChange,
  teamGroupId,
  initialValues,
  initialStep = 1,
}: UseEditChargerDialogControllerProps): UseEditChargerDialogControllerResult {
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
      chargerName: initialValues?.chargerName || '',
      chargerAccess: initialValues?.chargerAccess || '',
      selectedBrand: initialValues?.selectedBrand || '',
      selectedModel: initialValues?.selectedModel || '',
      typeConnector: initialValues?.typeConnector || '',
      selectedPowerLevel: initialValues?.selectedPowerLevel || '',
      selectedChargingStation: initialValues?.selectedChargingStation || '',
      serialNumber: initialValues?.serialNumber || '',
      selectedTeam: initialValues?.selectedTeam || '',
    },
  })

  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [showOcppDialog, setShowOcppDialog] = useState(false)
  const [pendingStepTwo, setPendingStepTwo] = useState(false)

  const [chargerName, setChargerName] = useState(initialValues?.chargerName || '')
  const [chargerAccess, setChargerAccess] = useState(initialValues?.chargerAccess || '')
  const [typeConnector, setTypeConnector] = useState(initialValues?.typeConnector || '')
  const [serialNumber, setSerialNumber] = useState(initialValues?.serialNumber || '')
  const [completedSerialNumber, setCompletedSerialNumber] = useState('')

  const [chargerBrands, setChargerBrands] = useState<ChargerBrand[]>([])
  const [selectedBrand, setSelectedBrand] = useState(initialValues?.selectedBrand || '')
  const [selectedModel, setSelectedModel] = useState(initialValues?.selectedModel || '')

  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([])
  const [selectedChargingStation, setSelectedChargingStation] = useState(
    initialValues?.selectedChargingStation || '',
  )

  const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([])
  const [teamOptions, setTeamOptions] = useState<TeamHostData[]>([])
  const [ocppUrl, setOcppUrl] = useState(DEFAULT_OCPP_URL)

  const ocppUrlInputRef = useRef<HTMLInputElement>(null)
  const chargerIdRef = useRef<string | number | null>(initialValues?.id ?? null)

  const updateChargerMutation = useUpdateCharger(teamGroupId || '')
  const updateSerialNumberMutation = useUpdateSerialNumber()

  useEffect(() => {
    setCurrentStep(initialStep)
  }, [initialStep])

  const resetFormState = useCallback(() => {
    setCurrentStep(initialStep)
    setIsActive(false)
    setConfirmDialogOpen(false)
    setShowOcppDialog(false)
    setPendingStepTwo(false)
    setChargerName(initialValues?.chargerName || '')
    setChargerAccess(initialValues?.chargerAccess || '')
    setTypeConnector(initialValues?.typeConnector || '')
    setSerialNumber(initialValues?.serialNumber || '')
    setCompletedSerialNumber('')
    setSelectedBrand(initialValues?.selectedBrand || '')
    setSelectedModel(initialValues?.selectedModel || '')
    setSelectedChargingStation(initialValues?.selectedChargingStation || '')
    setOcppUrl(DEFAULT_OCPP_URL)
    chargerIdRef.current = initialValues?.id ?? null
    form.reset({
      chargerName: initialValues?.chargerName || '',
      chargerAccess: initialValues?.chargerAccess || '',
      selectedBrand: initialValues?.selectedBrand || '',
      selectedModel: initialValues?.selectedModel || '',
      typeConnector: initialValues?.typeConnector || '',
      selectedPowerLevel: initialValues?.selectedPowerLevel || '',
      selectedChargingStation: initialValues?.selectedChargingStation || '',
      serialNumber: initialValues?.serialNumber || '',
      selectedTeam: initialValues?.selectedTeam || '',
    })
  }, [form, initialStep, initialValues])

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

  useEffect(() => {
    if (!dialogOpen || !initialValues) {
      return
    }

    chargerIdRef.current = initialValues.id ?? null
    form.reset({
      chargerName: initialValues?.chargerName || '',
      chargerAccess: initialValues?.chargerAccess || '',
      selectedBrand: initialValues?.selectedBrand || '',
      selectedModel: initialValues?.selectedModel || '',
      typeConnector: initialValues?.typeConnector || '',
      selectedPowerLevel: initialValues?.selectedPowerLevel || '',
      selectedChargingStation: initialValues?.selectedChargingStation || '',
      serialNumber: initialValues?.serialNumber || '',
      selectedTeam: initialValues?.selectedTeam || '',
    })

    setChargerName(initialValues?.chargerName || '')
    setChargerAccess(initialValues?.chargerAccess || '')
    setTypeConnector(initialValues?.typeConnector || '')
    setSerialNumber(initialValues?.serialNumber || '')
    setSelectedBrand(initialValues?.selectedBrand || '')
    setSelectedModel(initialValues?.selectedModel || '')
    setSelectedChargingStation(initialValues?.selectedChargingStation || '')
  }, [dialogOpen, form, initialValues])

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

  const steps: StepDescriptor[] = useMemo(
    () => [
      { id: 1, title: 'Basic Info' },
      { id: 2, title: 'OCPP Integration' },
    ],
    [],
  )

  const getStatus = useCallback(
    (stepId: number): StepStatus => {
      if (stepId === currentStep) {
        return 'current'
      }
      return 'upcoming'
    },
    [currentStep],
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

      if (!chargerIdRef.current) {
        toast.error('Charger ID is missing. Please reopen the dialog.')
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

        await updateChargerMutation.mutateAsync({
          chargerId: Number(chargerIdRef.current),
          data: payload,
        })

        setConfirmDialogOpen(true)
      } catch (error) {
        console.error('Failed to update charger', error)
        toast.error('Failed to update charger. Please try again.')
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

      if (!chargerIdRef.current) {
        toast.error('Charger ID is missing. Please reopen the dialog.')
        return
      }

      try {
        setPendingStepTwo(true)
        const payload = {
          charger_code: serialNumber.trim(),
          charger_id: Number(chargerIdRef.current),
        }

        const response = await updateSerialNumberMutation.mutateAsync(payload)
        if (response.statusCode !== 200 && response.statusCode !== 201) {
          toast.error('Serial number registration failed.')
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
        setPendingStepTwo(false)
      }
    }
  }, [
    chargerAccess,
    chargerName,
    chargerTypes,
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
    updateChargerMutation,
    updateSerialNumberMutation,
  ])

  const handleConfirmNext = useCallback(() => {
    setConfirmDialogOpen(false)
    setCurrentStep(2)
    setDialogOpen(true)
  }, [setDialogOpen])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((step) => Math.max(1, step - 1))
    }
  }, [currentStep])

  const dialogState: DialogState = {
    open: dialogOpen,
    isControlled,
    handleOpenChange: handleDialogOpenChange,
  }

  const stepState: StepState = {
    steps,
    currentStep,
    totalSteps: steps.length,
    setCurrentStep,
    getStatus,
    goToPrevious: handleBack,
    goToNext: handleNext,
    isSubmitting: isLoading || pendingStepTwo,
  }

  const statusState: StatusState = {
    isActive,
    onActiveChange: setIsActive,
  }

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
    stepper: stepState,
    status: statusState,
    basicInfo: basicInfoState,
    ocppIntegration: ocppIntegrationState,
    confirmDialog: confirmDialogState,
    ocppDialog: ocppDialogState,
  }
}
