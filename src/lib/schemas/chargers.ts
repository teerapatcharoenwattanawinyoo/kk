import * as z from "zod";

// Add Charger Form Schema
export const ChargerFormSchema = z.object({
  chargerName: z.string().min(1, "Charger name is required"),
  chargerAccess: z.string().min(1, "Charger access is required"),
  selectedBrand: z.string().min(1, "Brand is required"),
  selectedModel: z.string().min(1, "Model is required"),
  typeConnector: z.string().optional(),
  selectedPowerLevel: z.string().optional(),
  selectedChargingStation: z.string().min(1, "Charging station is required"),
  serialNumber: z.string().optional(),
  selectedTeam: z.string().min(1, "Team is required"),
});

// Type inference from schema
export type ChargerFormData = z.infer<typeof ChargerFormSchema>;
