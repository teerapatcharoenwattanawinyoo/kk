import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ChargerBrand,
  ChargerType,
  ChargingStation,
} from "@/lib/api/team-group/charger";
import { TeamHostData } from "@/modules/teams/schemas/team.schema";
import { UseFormReturn } from "react-hook-form";

interface BasicInfoFormProps {
  form: UseFormReturn<any>;
  chargerBrands: ChargerBrand[];
  chargerTypes: ChargerType[];
  chargingStations: ChargingStation[];
  teamOptions: TeamHostData[];
  selectedBrand: string;
  selectedModel: string;
  mode?: "add" | "edit";
  onChargerNameChange: (value: string) => void;
  onChargerAccessChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onTypeConnectorChange: (value: string) => void;
  onChargingStationChange: (value: string) => void;
  getModelsForBrand: (brandId: string) => any[];
  getPowerLevelsForModel: (modelId: string) => string[];
}

export function BasicInfoForm({
  form,
  chargerBrands,
  chargerTypes,
  chargingStations,
  teamOptions,
  selectedBrand,
  selectedModel,
  mode = "add",
  onChargerNameChange,
  onChargerAccessChange,
  onBrandChange,
  onModelChange,
  onTypeConnectorChange,
  onChargingStationChange,
  getModelsForBrand,
  getPowerLevelsForModel,
}: BasicInfoFormProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="chargerName"
        render={({ field }) => (
          <FormItem className="mb-6 sm:mb-8">
            <FormLabel className="mb-2 block">
              Charger Name <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Specify"
                className="h-12! py-3! sm:h-[52px]! border-none bg-[#f2f2f2] text-sm placeholder:text-[#CACACA]"
                onChange={(e) => {
                  field.onChange(e);
                  onChargerNameChange(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chargerAccess"
        render={({ field }) => (
          <FormItem className="mb-6 sm:mb-8">
            <FormLabel className="mb-2 block">
              Charger Access <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onChargerAccessChange(value);
                }}
                value={field.value}
              >
                <SelectTrigger
                  className={`h-12! min-h-12! py-3! sm:h-[52px]! w-full border-none bg-[#f2f2f2] text-sm ${
                    field.value ? "text-zinc-900" : "text-[#CACACA]"
                  }`}
                >
                  <SelectValue placeholder="Please select accessibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Public</SelectItem>
                  <SelectItem value="2">Private</SelectItem>
                  <SelectItem value="3">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-y-6 *:min-w-0 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
        <FormField
          control={form.control}
          name="selectedBrand"
          render={({ field }) => (
            <FormItem className="mb-6 sm:mb-8">
              <FormLabel className="mb-2 block">brand_name</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onBrandChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger
                    className={`h-12! min-h-12! py-3! sm:h-[52px]! w-full border-none bg-[#f2f2f2] text-sm ${
                      field.value ? "text-zinc-900" : "text-[#CACACA]"
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {chargerBrands
                      .filter(
                        (brand) => brand.id && brand.id.toString().trim() !== ""
                      )
                      .map((brand) => (
                        <SelectItem
                          key={brand.id}
                          value={brand.id.toString().trim()}
                        >
                          {brand.brand_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selectedModel"
          render={({ field }) => (
            <FormItem className="mb-6 sm:mb-8">
              <FormLabel className="mb-2 block">model_name</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onModelChange(value);
                  }}
                  value={field.value}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger
                    className={`h-12! min-h-12! py-3! sm:h-[52px]! w-full border-none bg-[#f2f2f2] text-sm ${
                      field.value ? "text-zinc-900" : "text-[#CACACA]"
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {getModelsForBrand(selectedBrand)
                      .filter(
                        (model) => model.id && model.id.toString().trim() !== ""
                      )
                      .map((model) => (
                        <SelectItem
                          key={model.id}
                          value={model.id.toString().trim()}
                        >
                          {model.model_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-y-6 *:min-w-0 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
        <FormField
          control={form.control}
          name="typeConnector"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="mb-2 block">Type of Connector</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onTypeConnectorChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger
                    className={`h-12! min-h-12! py-3! sm:h-[52px]! w-full border-none bg-[#f2f2f2] text-sm ${
                      field.value ? "text-zinc-900" : "text-[#CACACA]"
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {chargerTypes.length > 0 ? (
                      chargerTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="DC">DC</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selectedPowerLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-2 block">Max kW</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                  disabled={!selectedModel}
                >
                  <SelectTrigger
                    className={`h-12! min-h-12! py-3! sm:h-[52px]! w-full border-none bg-[#f2f2f2] text-sm ${
                      field.value ? "text-zinc-900" : "text-[#CACACA]"
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {getPowerLevelsForModel(selectedModel)
                      .filter((level) => level && level.trim() !== "")
                      .map((level) => (
                        <SelectItem key={level} value={level.trim()}>
                          {level}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-y-6 *:min-w-0 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
        <FormField
          control={form.control}
          name="selectedTeam"
          render={({ field }) => (
            <FormItem className="mb-6 sm:mb-8">
              <FormLabel className="mb-2 block">
                Select team <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`h-12! min-h-12! py-3! sm:h-[52px]! w-full border-none bg-[#f2f2f2] text-sm ${
                      field.value ? "text-zinc-900" : "text-[#CACACA]"
                    }`}
                  >
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamOptions.map((team) => (
                      <SelectItem
                        key={team.team_group_id}
                        value={team.team_group_id.toString()}
                      >
                        {team.team_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selectedChargingStation"
          render={({ field }) => (
            <FormItem className="mb-6 sm:mb-8">
              <FormLabel className="mb-2 block">
                Charging Station <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onChargingStationChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger
                    className={`h-12! min-h-12! py-3! sm:h-[52px]! w-full border-none bg-[#f2f2f2] text-sm ${
                      field.value ? "text-zinc-900" : "text-[#CACACA]"
                    }`}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {chargingStations && chargingStations.length > 0 ? (
                      chargingStations
                        .filter(
                          (station) =>
                            station.id && station.id.toString().trim() !== ""
                        )
                        .map((station) => (
                          <SelectItem
                            key={station.id}
                            value={station.id.toString().trim()}
                          >
                            {station.station_name}
                          </SelectItem>
                        ))
                    ) : (
                      <p className="p-4 text-sm text-muted-foreground">
                        No stations available.
                      </p>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
