'use client'
import {
  ChargerAddedDialog,
  OcppUrlDialog,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers'
import { BasicInfoForm } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers/basic-info-form'
import { OcppIntegrationForm } from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_components/chargers/ocpp-integration-form'
import type {
  ChargerBrand,
  ChargerType,
  ChargingStation,
  CreateChargerRequest,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_schemas/chargers.schema'
import {
  checkConnection,
  getChargerBrands,
  getChargerTypes,
  getTeamChargingStations,
} from '@/app/[locale]/(back-office)/team/[teamId]/chargers/_servers/charger'
import { TeamHostData } from '@/app/[locale]/(back-office)/team/_schemas/team.schema'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getTeamHostList } from '@/lib/api/team-group/team'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useCreateCharger, useUpdateSerialNumber } from '../../_hooks/use-chargers'
import { ChargerFormData, ChargerFormSchema } from '../../_schemas/chargers.schema'

interface AddChargerDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  teamGroupId?: string
}

export function AddChargerDialog({ open, onOpenChange, teamGroupId }: AddChargerDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isActive, setIsActive] = useState(false)
  const [isControlled] = useState(open !== undefined && onOpenChange !== undefined)
  const [internalOpen, setInternalOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [showOcppDialog, setShowOcppDialog] = useState(false)
  const [teamOptions, setTeamOptions] = useState<TeamHostData[]>([])

  const [ocppUrl, setOcppUrl] = useState('ws://ocpp.onecharge.co.th')
  const ocppUrlInputRef = useRef<HTMLInputElement>(null)
  const closeReasonRef = useRef<'success' | null>(null)
  const preserveStateForStepTwoRef = useRef(false)
  const resumeStepRef = useRef<number | null>(null)

  // Initialize form
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

  // Form states (keep for compatibility with existing logic)
  const [chargerName, setChargerName] = useState<string>('')
  const [chargerAccess, setChargerAccess] = useState<string>('')
  const [typeConnector, setTypeConnector] = useState<string>('')
  const [serialNumber, setSerialNumber] = useState<string>('')
  const [createdChargerId, setCreatedChargerId] = useState<number | null>(null)

  // Charger brands state
  const [chargerBrands, setChargerBrands] = useState<ChargerBrand[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // Charging stations state
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([])
  const [selectedChargingStation, setSelectedChargingStation] = useState<string>('')

  // Charger types state
  const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([])

  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen
  const setDialogOpenRef = useRef<typeof setDialogOpen>(setDialogOpen)

  useEffect(() => {
    setDialogOpenRef.current = setDialogOpen
  }, [setDialogOpen])

  const createChargerMutation = useCreateCharger(teamGroupId)
  const updateSerialNumberMutation = useUpdateSerialNumber()

  // Reset form when dialog closes
  const resetForm = () => {
    setCurrentStep(1)
    // Reset form with default values
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

    // Reset all state variables
    setChargerName('')
    setChargerAccess('')
    setTypeConnector('')
    setSerialNumber('')
    setSelectedBrand('')
    setSelectedModel('')
    setSelectedChargingStation('')
    setCreatedChargerId(null)
    setConfirmDialogOpen(false)
    setIsLoading(false)
    setIsActive(false)
  }

  // Handle dialog open/close
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      if (closeReasonRef.current !== 'success') {
        resetForm()
      }
    } else {
      closeReasonRef.current = null
    }
    setDialogOpen?.(open)
  }

  useEffect(() => {
    if (!confirmDialogOpen) {
      if (resumeStepRef.current !== null) {
        const nextStep = resumeStepRef.current
        resumeStepRef.current = null
        setCurrentStep(nextStep)
        preserveStateForStepTwoRef.current = false
        closeReasonRef.current = null
        setDialogOpenRef.current?.(true)
        return
      }

      if (closeReasonRef.current === 'success' && !preserveStateForStepTwoRef.current) {
        resetForm()
        closeReasonRef.current = null
      }
    }
  }, [confirmDialogOpen])

  useEffect(() => {
    if (dialogOpen) {
      preserveStateForStepTwoRef.current = false
    }
  }, [dialogOpen])

  // Fetch charger brands and charging stations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch charger brands
        const brandsResponse = await getChargerBrands()
        setChargerBrands(brandsResponse.data)

        // Fetch charging stations if teamGroupId is provided
        if (teamGroupId) {
          const stationsResponse = await getTeamChargingStations(teamGroupId)

          // Check if response has nested data structure
          if (
            stationsResponse &&
            stationsResponse.data &&
            Array.isArray(stationsResponse.data.data)
          ) {
            setChargingStations(stationsResponse.data.data)
          } else {
            toast.error('Could not load charging stations.')
            setChargingStations([])
          }
        }
      } catch {
        toast.error('Could not fetch charger brands and charging stations.')
      } finally {
        setIsLoading(false)
      }
    }

    if (dialogOpen) {
      fetchData()
    }
  }, [teamGroupId, dialogOpen, toast])

  // Fetch charger types when dialog opens
  useEffect(() => {
    async function fetchChargerTypes() {
      try {
        const res = await getChargerTypes()
        setChargerTypes(res.data)
      } catch (error) {
        console.error('Error fetching charger types:', error)
        setChargerTypes([])
      }
    }
    if (dialogOpen) {
      fetchChargerTypes()
    }
  }, [dialogOpen])

  // Get models for selected brand
  const getModelsForBrand = (brandId: string) => {
    const brand = chargerBrands.find((b) => b.id.toString() === brandId)
    return brand?.models || []
  }

  // Get power levels for selected model
  const getPowerLevelsForModel = (modelId: string) => {
    const model = chargerBrands
      .flatMap((brand) => brand.models)
      .find((m) => m.id.toString() === modelId)

    if (!model?.power_levels) return []

    // Parse power_levels string (e.g., "7.4kW, 11kW, 22kW") into array
    return model.power_levels
      .split(',')
      .map((level) => level.trim())
      .filter((level) => level)
  }

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId)
    setSelectedModel('') // Reset model when brand changes
    // Reset power level in form
    form.setValue('selectedPowerLevel', '')
  }

  // Handle model change - reset power level when model changes
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    // Reset power level in form
    form.setValue('selectedPowerLevel', '')
  }

  const totalSteps = 2

  const steps = [
    { title: 'Basic Info', id: 1 },
    { title: 'OCPP Integration', id: 2 },
  ]

  const getStepStatus = (stepId: number) => {
    if (stepId === currentStep) return 'current'
    return 'upcoming'
  }

  const getCircleBgClass = (status: string) => {
    if (status === 'current') return 'bg-[#25c870] text-white'
    return 'bg-[#f2f2f2] text-muted-foreground'
  }

  const getTextClass = (status: string) => {
    if (status === 'current') return 'text-[#25c870] font-medium'
    return 'text-muted-foreground'
  }
  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate required fields

      if (
        !chargerName ||
        !chargerAccess ||
        !selectedChargingStation ||
        !selectedBrand ||
        !selectedModel
      ) {
        toast.error('Please fill in all required fields.')
        return
      }

      try {
        setIsLoading(true)

        const userDataString = localStorage.getItem('user_data')
        let partnerId = null

        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString)
            // customer_id is nested inside user object
            partnerId = userData?.user?.customer_id
          } catch (error) {
            console.error('Error parsing user_data from localStorage:', error)
          }
        } else {
          const alternatives = ['userData', 'auth', 'customer_data', 'user']
          for (const key of alternatives) {
            const altData = localStorage.getItem(key)
            if (altData) {
              try {
                const parsed = JSON.parse(altData)
                if (parsed?.customer_id) {
                  partnerId = parsed.customer_id
                  break
                }
              } catch {}
            }
          }
        }

        if (!partnerId) {
          toast.error('Partner ID not found. Please login again.')
          return
        }

        // Prepare the charger data
        const selectedPowerLevelValue = form.getValues('selectedPowerLevel')
        // Remove "kW" unit from power level (e.g., "7.4kW" -> "7.4")
        const maxKwh = selectedPowerLevelValue
          ? selectedPowerLevelValue.replace(/kW/gi, '').trim()
          : '0'

        const chargerData: CreateChargerRequest = {
          partner_id: partnerId,
          station_id: parseInt(selectedChargingStation),
          team_group_id: parseInt(teamGroupId!),
          charger_name: chargerName,
          charger_access: mapChargerAccessToApi(chargerAccess),
          max_kwh: maxKwh,
          charger_type_id: (() => {
            const found = chargerTypes.find((type) => type.name === typeConnector)
            return found ? found.id : 0
          })(),
          brand: parseInt(selectedBrand),
          model: parseInt(selectedModel),
        }

        // Create the charger
        if (!teamGroupId) {
          toast.error('Team group id is missing. Please try again.')
          return
        }

        const response = await createChargerMutation.mutateAsync(chargerData)

        const parseNumericStatus = (value: unknown) => {
          if (typeof value === 'number') {
            return Number.isNaN(value) ? undefined : value
          }

          if (typeof value === 'string') {
            const parsed = Number(value)
            return Number.isNaN(parsed) ? undefined : parsed
          }

          return undefined
        }

        const findValidId = (value: unknown) => {
          if (typeof value === 'number') {
            return Number.isFinite(value) && value > 0 ? value : null
          }

          if (typeof value === 'string') {
            const parsed = Number(value)
            return Number.isFinite(parsed) && parsed > 0 ? parsed : null
          }

          return null
        }

        const extractChargerIdFromResponse = (rawResponse: unknown): number | null => {
          const responseLike = rawResponse as {
            data?: {
              data?: { charger_id?: unknown; id?: unknown }
              charger_id?: unknown
              id?: unknown
            }
            charger_id?: unknown
            id?: unknown
          }

          const possibleIds: unknown[] = [
            responseLike.data?.data?.charger_id,
            responseLike.data?.data?.id,
            responseLike.data?.charger_id,
            responseLike.data?.id,
            responseLike.charger_id,
            responseLike.id,
          ]

          for (const candidate of possibleIds) {
            const valid = findValidId(candidate)
            if (valid) {
              return valid
            }
          }

          return null
        }

        const normalizedStatus =
          parseNumericStatus((response as { statusCode?: unknown }).statusCode) ??
          parseNumericStatus((response as { status?: unknown }).status)

        const responseMessage =
          typeof (response as { message?: unknown }).message === 'string'
            ? ((response as { message?: string }).message || '').toLowerCase()
            : undefined

        const nestedMessage =
          typeof (response as { data?: { message?: unknown } }).data?.message === 'string'
            ? ((response as { data?: { message?: string } }).data?.message || '').toLowerCase()
            : undefined

        const chargerId = extractChargerIdFromResponse(response)

        const isSuccessfulResponse =
          (typeof normalizedStatus === 'number' &&
            !Number.isNaN(normalizedStatus) &&
            normalizedStatus >= 200 &&
            normalizedStatus < 300) ||
          responseMessage === 'success' ||
          nestedMessage === 'success' ||
          chargerId !== null

        if (!isSuccessfulResponse) {
          toast.error('Failed to create charger. Please try again.')
          return
        }

        if (chargerId === null) {
          toast.error('Failed to determine charger ID. Please try again.')
          return
        }

        setCreatedChargerId(chargerId)

        // Move to confirmation dialog
        closeReasonRef.current = 'success'
        setConfirmDialogOpen(true)
        setDialogOpen?.(false)
      } catch {
        toast.error('Failed to create charger. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else if (currentStep === totalSteps) {
      // Final step - update serial number and check connection
      if (!serialNumber || serialNumber.trim() === '') {
        toast.error('Please enter a serial number.')
        return
      }

      if (!createdChargerId || createdChargerId === undefined || createdChargerId === null) {
        toast.error('Charger ID is missing. Please create the charger again.')
        return
      }

      try {
        setIsLoading(true)

        // Update serial number
        const updatePayload = {
          charger_code: serialNumber.trim(),
          charger_id: Number(createdChargerId),
        }

        const updateResponse = await updateSerialNumberMutation.mutateAsync(updatePayload)

        if (updateResponse.statusCode === 200 || updateResponse.statusCode === 201) {
          // Wait a moment for database to update
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Check connection
          await checkConnection(serialNumber)

          // setup completed

          // Close dialog and show OCPP info
          setDialogOpen?.(false)
          setShowOcppDialog(true)
        } else {
          toast.error('Failed to register charger code.')
        }
      } catch (error) {
        toast.error('Failed to complete charger setup.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleConfirmNext = () => {
    preserveStateForStepTwoRef.current = true
    resumeStepRef.current = 2
    setConfirmDialogOpen(false)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const mapChargerAccessToApi = (access: string) => {
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
  }

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await getTeamHostList()
        setTeamOptions(res.data.data) // array ของทีม
      } catch (error) {
        // handle error
        console.error('Error fetching team host list:', error)
        setTeamOptions([])
      }
    }
    fetchTeams()
  }, [])
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        {!isControlled && (
          <DialogTrigger asChild>
            <Button>Add Charger</Button>
          </DialogTrigger>
        )}
        <DialogContent className="flex w-full max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg bg-card p-0 sm:max-w-[763px]">
          <DialogTitle className="sr-only">Add Charger</DialogTitle>
          <DialogDescription className="sr-only">
            Configure and add a new charger to your charging station network
          </DialogDescription>
          {/* Header */}
          <div className="relative flex h-[70px] shrink-0 items-center border-b px-4 sm:px-6 md:px-10 lg:px-[51px]">
            <h2 className="text-lg font-semibold text-primary md:text-xl">Add Charger</h2>
          </div>

          {/* Mobile Step Navigation */}
          <div className="block w-full border-b md:hidden">
            <div className="flex justify-center gap-2 py-2 sm:gap-4 sm:py-3">
              {steps.map((step) => {
                const status = getStepStatus(step.id)
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${getCircleBgClass(
                        status,
                      )}`}
                    >
                      <span className="text-xs">{step.id}</span>
                    </div>
                    <span className={`mt-1 text-[11px] ${getTextClass(status)}`}>{step.title}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Main Content Container */}
          <div className="-my-4 flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Left Column (Desktop step navigation) */}
            <div className="hidden md:ml-16 md:flex md:w-[140px] md:shrink-0 md:flex-col md:border-l md:border-r lg:w-[140px]">
              <div className="-mx-4 grow items-start py-2 lg:py-6">
                {steps.map((step, index) => {
                  const status = getStepStatus(step.id)
                  return (
                    <div key={step.id}>
                      <div
                        className={`ml-6 flex cursor-pointer items-center ${status === 'current' ? '' : ''}`}
                        onClick={() => setCurrentStep(step.id)}
                        tabIndex={0}
                        role="button"
                        aria-current={status === 'current'}
                        style={{ outline: 'none' }}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${getCircleBgClass(
                            status,
                          )}`}
                        >
                          <span className="text-xs">{step.id}</span>
                        </div>
                        <span className={`ml-2 text-xs ${getTextClass(status)}`}>{step.title}</span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="my-1 ml-[calc(43px+(--spacing(2))-1px)] h-6 w-px bg-none" />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Status Switch */}
              <div className="mt-auto border-t px-6 py-4">
                <div className="flex flex-col items-start justify-between">
                  <Label className="mb-4 text-sm font-normal tracking-[0.15px] text-black">
                    Status <span className="ml-1 text-[15px] font-normal text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      className="data-[state=checked]:bg-[#00DD9C]"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column (Form container) */}
            <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto py-4 sm:px-6 sm:py-6">
              <div className="w-full max-w-[640px] space-y-4 sm:space-y-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(() => {})}>
                    {currentStep === 1 && (
                      <BasicInfoForm
                        form={form}
                        mode="add"
                        chargerBrands={chargerBrands}
                        chargerTypes={chargerTypes}
                        chargingStations={chargingStations}
                        teamOptions={teamOptions}
                        selectedBrand={selectedBrand}
                        selectedModel={selectedModel}
                        onChargerNameChange={setChargerName}
                        onChargerAccessChange={setChargerAccess}
                        onBrandChange={handleBrandChange}
                        onModelChange={handleModelChange}
                        onTypeConnectorChange={setTypeConnector}
                        onChargingStationChange={setSelectedChargingStation}
                        getModelsForBrand={getModelsForBrand}
                        getPowerLevelsForModel={getPowerLevelsForModel}
                      />
                    )}

                    {currentStep === 2 && (
                      <OcppIntegrationForm
                        form={form}
                        mode="add"
                        chargerName={chargerName}
                        onSerialNumberChange={setSerialNumber}
                      />
                    )}
                  </form>
                </Form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-2 border-t bg-card p-4 sm:gap-3 sm:p-4 md:p-6">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="h-10 w-full font-normal text-destructive hover:bg-destructive hover:text-white sm:h-11 sm:w-[175px]"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={(e) => {
                e.preventDefault()
                handleNext()
              }}
              disabled={isLoading}
              className={`h-10 w-full font-normal sm:h-11 sm:w-[175px] ${
                !isLoading
                  ? 'bg-[#355ff5] hover:bg-[#2a4dd4]'
                  : 'cursor-not-allowed bg-muted-foreground'
              }`}
            >
              {isLoading ? 'Loading...' : currentStep === totalSteps ? 'Confirm' : 'Next'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ChargerAddedDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Charger Added"
        description="‘Connecting’ pairs your charger hardware with out software. This is a critical step before you can start charging. If your charge point is installed, connect it now or do this later whenever your charger is installed"
        onConfirm={handleConfirmNext}
      />

      {/* OCPP Url Configuration Dialog */}
      <OcppUrlDialog
        open={showOcppDialog}
        onOpenChange={setShowOcppDialog}
        ocppUrl={ocppUrl}
        setOcppUrl={setOcppUrl}
        ocppUrlInputRef={ocppUrlInputRef as React.RefObject<HTMLInputElement>}
        additionalInput={serialNumber}
      />
    </>
  )
}

export default AddChargerDialog
