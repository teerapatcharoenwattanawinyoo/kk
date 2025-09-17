"use client";

import { ChargerAddedDialog } from "@/components/back-office/team/chargers";

import { OcppUrlDialog } from "@/components/back-office/team/chargers";

import {
  BasicInfoForm,
  OcppIntegrationForm,
} from "@/components/back-office/team/form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateCharger, useUpdateSerialNumber } from "@/hooks/use-chargers";
import {
  ChargerBrand,
  ChargerType,
  ChargingStation,
  checkConnection,
  getChargerBrands,
  getChargerTypes,
  getTeamChargingStations,
} from "@/lib/api/team-group/charger";
import { getTeamHostList } from "@/lib/api/team-group/team";
import {
  ChargerFormData,
  ChargerFormSchema,
  TeamHostData,
} from "@/lib/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface EditChargerDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  teamGroupId?: string;
  initialValues?: Partial<z.infer<typeof ChargerFormSchema>> & {
    id?: string | number;
  };
  initialStep?: number;
}

export function EditChargerDialog({
  open,
  onOpenChange,
  teamGroupId,
  initialValues,
  initialStep = 1,
}: EditChargerDialogProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isActive, setIsActive] = useState(false);
  const [isControlled] = useState(
    open !== undefined && onOpenChange !== undefined,
  );
  const [internalOpen, setInternalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [showOcppDialog, setShowOcppDialog] = useState(false);
  const [teamOptions, setTeamOptions] = useState<TeamHostData[]>([]);

  const [ocppUrl, setOcppUrl] = useState("ws://ocpp.onecharge.co.th");
  const ocppUrlInputRef = useRef<HTMLInputElement>(null);

  // เพิ่ม state สำหรับ pending
  const [pending, setPending] = useState(false);

  // เก็บ charger ID ไว้ให้แน่ใจว่าไม่หาย
  const [chargerId, setChargerId] = useState<string | number | null>(null);

  // Initialize form with initialValues
  const form = useForm<ChargerFormData>({
    resolver: zodResolver(ChargerFormSchema),
    defaultValues: {
      chargerName: initialValues?.chargerName || "",
      chargerAccess: initialValues?.chargerAccess || "",
      selectedBrand: initialValues?.selectedBrand || "",
      selectedModel: initialValues?.selectedModel || "",
      typeConnector: initialValues?.typeConnector || "",
      selectedPowerLevel: initialValues?.selectedPowerLevel || "",
      selectedChargingStation: initialValues?.selectedChargingStation || "",
      serialNumber: initialValues?.serialNumber || "",
      selectedTeam: initialValues?.selectedTeam || "",
    },
  });

  // Form states (keep for compatibility with existing logic)
  const [chargerName, setChargerName] = useState<string>(
    initialValues?.chargerName || "",
  );
  const [chargerAccess, setChargerAccess] = useState<string>(
    initialValues?.chargerAccess || "",
  );
  const [typeConnector, setTypeConnector] = useState<string>(
    initialValues?.typeConnector || "",
  );
  const [serialNumber, setSerialNumber] = useState<string>(
    initialValues?.serialNumber || "",
  );

  // Charger brands state
  const [chargerBrands, setChargerBrands] = useState<ChargerBrand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>(
    initialValues?.selectedBrand || "",
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    initialValues?.selectedModel || "",
  );
  const [isLoading, setIsLoading] = useState(false);

  // Charging stations state
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>(
    [],
  );
  const [selectedChargingStation, setSelectedChargingStation] =
    useState<string>(initialValues?.selectedChargingStation || "");

  // Charger types state
  const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);

  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const resetForm = () => {
    // Reset to initialStep instead of hardcoded 1
    setCurrentStep(initialStep);

    // Create default values object once
    const defaultValues = {
      chargerName: initialValues?.chargerName || "",
      chargerAccess: initialValues?.chargerAccess || "",
      selectedBrand: initialValues?.selectedBrand || "",
      selectedModel: initialValues?.selectedModel || "",
      typeConnector: initialValues?.typeConnector || "",
      selectedPowerLevel: initialValues?.selectedPowerLevel || "",
      selectedChargingStation: initialValues?.selectedChargingStation || "",
      serialNumber: initialValues?.serialNumber || "",
      selectedTeam: initialValues?.selectedTeam || "",
    };

    // Reset form with default values
    form.reset(defaultValues);

    // Reset all state variables in one batch
    setChargerName(defaultValues.chargerName);
    setChargerAccess(defaultValues.chargerAccess);
    setTypeConnector(defaultValues.typeConnector);
    setSerialNumber(defaultValues.serialNumber);
    setSelectedBrand(defaultValues.selectedBrand);
    setSelectedModel(defaultValues.selectedModel);
    setSelectedChargingStation(defaultValues.selectedChargingStation);
    setConfirmDialogOpen(false);
    setIsLoading(false);
    setIsActive(false);
    setPending(false);
    setChargerId(null); // reset charger ID
  };

  // Handle dialog open/close
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setDialogOpen?.(open);
  };

  // Effect to update form when initialValues change
  useEffect(() => {
    if (initialValues && dialogOpen) {
      // เก็บ charger ID ไว้ในตัวแปรแยก
      if (initialValues.id) {
        setChargerId(initialValues.id);
      }

      // Update form values
      form.reset({
        chargerName: initialValues?.chargerName || "",
        chargerAccess: initialValues?.chargerAccess || "",
        selectedBrand: initialValues?.selectedBrand || "",
        selectedModel: initialValues?.selectedModel || "",
        typeConnector: initialValues?.typeConnector || "",
        selectedPowerLevel: initialValues?.selectedPowerLevel || "",
        selectedChargingStation: initialValues?.selectedChargingStation || "",
        serialNumber: initialValues?.serialNumber || "",
        selectedTeam: initialValues?.selectedTeam || "",
      });

      // Update state variables in batch
      const batch = () => {
        setChargerName(initialValues?.chargerName || "");
        setChargerAccess(initialValues?.chargerAccess || "");
        setTypeConnector(initialValues?.typeConnector || "");
        setSerialNumber(initialValues?.serialNumber || "");
        setSelectedBrand(initialValues?.selectedBrand || "");
        setSelectedModel(initialValues?.selectedModel || "");
        setSelectedChargingStation(
          initialValues?.selectedChargingStation || "",
        );
      };
      batch();
    }
  }, [initialValues, dialogOpen, form]);

  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel for better performance
        const [brandsResponse, typesResponse, teamsResponse, stationsResponse] =
          await Promise.all([
            getChargerBrands(),
            getChargerTypes(),
            getTeamHostList(),
            ...(teamGroupId ? [getTeamChargingStations(teamGroupId)] : []),
          ]);

        // Update states with proper typing
        setChargerBrands(brandsResponse.data);
        setChargerTypes(typesResponse.data);
        setTeamOptions(teamsResponse.data.data);

        if (teamGroupId && stationsResponse) {
          if (
            stationsResponse &&
            stationsResponse.data &&
            Array.isArray(stationsResponse.data.data)
          ) {
            setChargingStations(stationsResponse.data.data);
          } else {
            setChargingStations([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (dialogOpen) {
      fetchData();
    }
  }, [teamGroupId, dialogOpen]);

  const mapChargerAccessToApi = (access: string) => {
    if (["1", "2", "3"].includes(access)) return access;
    switch (access.trim().toLowerCase()) {
      case "public":
        return "1";
      case "private":
        return "2";
      case "unavailable":
        return "3";
      default:
        return "";
    }
  };

  // Get models for selected brand - memoized
  const getModelsForBrand = useCallback(
    (brandId: string) => {
      const brand = chargerBrands.find((b) => b.id.toString() === brandId);
      return brand?.models || [];
    },
    [chargerBrands],
  );

  // Get power levels for selected model - memoized
  const getPowerLevelsForModel = useCallback(
    (modelId: string) => {
      const model = chargerBrands
        .flatMap((brand) => brand.models)
        .find((m) => m.id.toString() === modelId);

      if (!model?.power_levels) return [];

      // Parse power_levels string (e.g., "7.4kW, 11kW, 22kW") into array
      return model.power_levels
        .split(",")
        .map((level) => level.trim())
        .filter((level) => level);
    },
    [chargerBrands],
  );

  const handleBrandChange = useCallback(
    (brandId: string) => {
      setSelectedBrand(brandId);
      setSelectedModel("");
      form.setValue("selectedPowerLevel", "");
    },
    [form],
  );

  // Handle model change - reset power level when model changes
  const handleModelChange = useCallback(
    (modelId: string) => {
      setSelectedModel(modelId);
      // Reset power level in form
      form.setValue("selectedPowerLevel", "");
    },
    [form],
  );

  const totalSteps = 2;

  const steps = useMemo(
    () => [
      { title: "Basic Info", id: 1 },
      { title: "OCPP Integration", id: 2 },
    ],
    [],
  );

  const getStepStatus = useCallback(
    (stepId: number) => {
      if (stepId === currentStep) return "current";
      return "upcoming";
    },
    [currentStep],
  );

  const getCircleBgClass = useCallback((status: string) => {
    if (status === "current") return "bg-[#25c870] text-white";
    return "bg-[#f2f2f2] text-muted-foreground";
  }, []);

  const getTextClass = useCallback((status: string) => {
    if (status === "current") return "text-[#25c870] font-medium";
    return "text-muted-foreground";
  }, []);

  const handleConfirmNext = () => {
    setConfirmDialogOpen(false);

    // เปิด EditChargerDialog อีกครั้งและไปยัง step 2
    setTimeout(() => {
      setCurrentStep(2);
      setDialogOpen?.(true);
    }, 100);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // เรียกใช้ useUpdateCharger
  // Mutation hooks
  const updateChargerMutation = useUpdateCharger(teamGroupId || "");
  const updateSerialNumberMutation = useUpdateSerialNumber();

  // ฟังก์ชันสำหรับ submit
  const handleNext = async () => {
    if (currentStep === 1) {
      // Trigger form validation first
      const isValid = await form.trigger([
        "chargerName",
        "chargerAccess",
        "selectedBrand",
        "selectedModel",
        "selectedTeam",
        "selectedChargingStation",
      ]);

      if (!isValid) {
        return;
      }

      // Additional validation using state variables (for compatibility)
      if (
        !chargerName ||
        !chargerAccess ||
        !selectedChargingStation ||
        !selectedBrand ||
        !selectedModel
      ) {
        return;
      }

      try {
        setIsLoading(true);

        // Get partner_id from localStorage user_data
        const userDataString = localStorage.getItem("user_data");
        let partnerId = null;

        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            partnerId = userData?.user?.customer_id;
          } catch (error) {
            console.error("Error parsing user_data from localStorage:", error);
          }
        } else {
          const alternatives = ["userData", "auth", "customer_data", "user"];
          for (const key of alternatives) {
            const altData = localStorage.getItem(key);
            if (altData) {
              try {
                const parsed = JSON.parse(altData);
                if (parsed?.customer_id) {
                  partnerId = parsed.customer_id;
                  break;
                }
              } catch {}
            }
          }
        }

        if (!partnerId) {
          return;
        }

        // Prepare the charger data
        const selectedPowerLevelValue = form.getValues("selectedPowerLevel");
        // Remove "kW" unit from power level (e.g., "7.4kW" -> "7.4")
        const maxKwh = selectedPowerLevelValue
          ? selectedPowerLevelValue.replace(/kW/gi, "").trim()
          : "0";

        const chargerData = {
          partner_id: partnerId,
          station_id: parseInt(selectedChargingStation),
          team_group_id: parseInt(teamGroupId!),
          charger_name: chargerName,
          charger_access: mapChargerAccessToApi(chargerAccess),
          max_kwh: maxKwh,
          charger_type_id: (() => {
            const found = chargerTypes.find(
              (type) => type.name === typeConnector,
            );
            return found ? found.id : 0;
          })(),
          brand: parseInt(selectedBrand),
          model: parseInt(selectedModel),
        };

        // Update the charger
        if (!initialValues?.id) {
          return;
        }

        await updateChargerMutation.mutateAsync({
          chargerId: Number(initialValues.id),
          data: chargerData,
        });

        // ปิด EditChargerDialog ก่อนแสดง ConfirmationDialog
        setDialogOpen?.(false);

        // แสดง ConfirmationDialog หลังจากปิด dialog แล้ว
        setTimeout(() => {
          setConfirmDialogOpen(true);
        }, 100);

        // ไม่ต้อง setCurrentStep(currentStep + 1) ตรงนี้
      } catch {
        console.error("Failed to update charger");
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === totalSteps) {
      setPending(true);

      // ใช้ state serialNumber ที่ sync ไว้
      const serialNumberValue = serialNumber || form.getValues("serialNumber");

      if (!serialNumberValue || serialNumberValue.trim() === "") {
        setPending(false);
        return;
      }

      if (!chargerId || chargerId === undefined || chargerId === null) {
        setPending(false);
        return;
      }

      try {
        const updatePayload = {
          charger_code: serialNumberValue.trim(),
          charger_id: Number(chargerId), // เปลี่ยนกลับจาก id เป็น charger_id
        };

        const updateResponse =
          await updateSerialNumberMutation.mutateAsync(updatePayload);

        if (updateResponse.statusCode === 200) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await checkConnection(serialNumberValue);

          setDialogOpen?.(false);
          setShowOcppDialog(true);
        } else {
          console.error("Serial number registration failed");
        }
      } catch (error) {
        console.error("❌ Error in updateSerialNumberMutation:", error);
      } finally {
        setPending(false);
      }
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        {!isControlled && (
          <DialogTrigger asChild>
            <Button>Edit Charger</Button>
          </DialogTrigger>
        )}
        <DialogContent className="flex w-full max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg bg-card p-0 sm:max-w-[763px]">
          <DialogTitle className="sr-only">Edit Charger</DialogTitle>
          <DialogDescription className="sr-only">
            Edit charger information
          </DialogDescription>
          {/* Header */}
          <div className="relative flex h-[70px] shrink-0 items-center border-b px-4 sm:px-6 md:px-10 lg:px-[51px]">
            <h2 className="text-lg font-semibold text-primary md:text-xl">
              Edit Charger
            </h2>
          </div>

          {/* Mobile Step Navigation */}
          <div className="block w-full border-b md:hidden">
            <div className="flex justify-center gap-2 py-2 sm:gap-4 sm:py-3">
              {steps.map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${getCircleBgClass(
                        status,
                      )}`}
                    >
                      <span className="text-xs">{step.id}</span>
                    </div>
                    <span
                      className={`mt-1 text-[11px] ${getTextClass(status)}`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content Container */}
          <div className="-my-4 flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Left Column (Desktop step navigation) */}
            <div className="hidden md:ml-16 md:flex md:w-[140px] md:shrink-0 md:flex-col md:border-l md:border-r lg:w-[140px]">
              <div className="-mx-4 grow items-start py-2 lg:py-6">
                {steps.map((step, index) => {
                  const status = getStepStatus(step.id);
                  return (
                    <div key={step.id}>
                      <div className="ml-6 flex items-center">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${getCircleBgClass(
                            status,
                          )}`}
                        >
                          <span className="text-xs">{step.id}</span>
                        </div>
                        <span
                          className={`ml-2 text-xs ${getTextClass(status)}`}
                        >
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="my-1 ml-[calc(43px+(--spacing(2))-1px)] h-6 w-px bg-none" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status Switch */}
              <div className="mt-auto border-t px-6 py-4">
                <div className="flex flex-col items-start justify-between">
                  <Label className="mb-4 text-sm font-normal tracking-[0.15px] text-black">
                    Status{" "}
                    <span className="ml-1 text-[15px] font-normal text-destructive">
                      *
                    </span>
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
            </div>{" "}
            {/* Right Column (Form container) */}
            <div className="flex flex-1 flex-col overflow-y-auto px-8 py-4 sm:px-12 sm:py-6">
              <div className="w-full space-y-4 sm:space-y-5">
                <Form {...form}>
                  {currentStep === 1 && (
                    <BasicInfoForm
                      form={form}
                      mode="edit"
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
                      mode="edit"
                      chargerName={chargerName}
                      onSerialNumberChange={setSerialNumber}
                    />
                  )}
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
                e.preventDefault();
                if (currentStep === 2) {
                  setPending(true);
                }
                handleNext();
              }}
              disabled={
                isLoading || pending || updateSerialNumberMutation.isPending
              }
              className={`h-10 w-full font-normal sm:h-11 sm:w-[175px] ${
                !isLoading && !pending && !updateSerialNumberMutation.isPending
                  ? "bg-primary"
                  : "cursor-not-allowed bg-muted-foreground"
              }`}
            >
              {isLoading || pending || updateSerialNumberMutation.isPending
                ? "Loading..."
                : currentStep === totalSteps
                  ? "Confirm"
                  : "Next"}
            </Button>
          </div>
        </DialogContent>
        {/* Charger Added Dialog */}
        <ChargerAddedDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          title="Charger Updated"
          description="Your charger information has been successfully updated. Would you like to continue to configure the OCPP integration?"
          onConfirm={handleConfirmNext}
        />
      </Dialog>
      {/* OCPP Url Configuration Dialog */}
      <OcppUrlDialog
        open={showOcppDialog}
        onOpenChange={setShowOcppDialog}
        ocppUrl={ocppUrl}
        setOcppUrl={setOcppUrl}
        ocppUrlInputRef={ocppUrlInputRef as React.RefObject<HTMLInputElement>}
        additionalInput={form.watch("serialNumber")}
      />
    </>
  );
}

export default EditChargerDialog;
