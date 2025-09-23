import { z } from 'zod'

const legacyStringPagination = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    page: z.union([z.string(), z.number()]),
    page_total: z.number(),
    page_size: z.union([z.string(), z.number()]),
    item_total: z.number(),
    data: z.array(itemSchema),
  })

const legacyCurrentPagination = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    page_current: z.union([z.string(), z.number()]),
    page_total: z.number(),
    page_size: z.union([z.string(), z.number()]),
    item_total: z.number(),
    data: z.array(itemSchema),
  })

export const createPaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.union([legacyStringPagination(itemSchema), legacyCurrentPagination(itemSchema)])

const stringFromAny = z.preprocess((value) => {
  if (value === null || value === undefined) return ''
  return String(value)
}, z.string())

const nullableNumberFromAny = z.preprocess((value) => {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  if (typeof value === 'number') return value
  return null
}, z.number().nullable())

const optionalStringFromAny = z.preprocess((value) => {
  if (value === undefined || value === null) return undefined
  return String(value)
}, z.string().optional())

const optionalNumberFromAny = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  if (typeof value === 'number') return value
  return undefined
}, z.number().optional())

export const ChargerFormSchema = z.object({
  chargerName: z.string().min(1, 'Charger name is required'),
  chargerAccess: z.string().min(1, 'Charger access is required'),
  selectedBrand: z.string().min(1, 'Brand is required'),
  selectedModel: z.string().min(1, 'Model is required'),
  typeConnector: z.string().optional(),
  selectedPowerLevel: z.string().optional(),
  selectedChargingStation: z.string().min(1, 'Charging station is required'),
  serialNumber: z.string().optional(),
  selectedTeam: z.string().min(1, 'Team is required'),
})

export type ChargerFormData = z.infer<typeof ChargerFormSchema>

export const EditChargerInitialValuesSchema = z.object({
  id: z.string().optional(),
  chargerName: z.string().optional(),
  chargerAccess: z.string().optional(),
  selectedBrand: z.string().optional(),
  selectedModel: z.string().optional(),
  typeConnector: z.string().optional(),
  selectedPowerLevel: z.string().optional(),
  selectedChargingStation: z.string().optional(),
  serialNumber: z.string().optional(),
  selectedTeam: z.string().optional(),
})

export type EditChargerInitialValues = z.infer<typeof EditChargerInitialValuesSchema>

export const ChargerModelSchema = z.object({
  id: z.number(),
  brand_id: z.number(),
  model_name: z.string(),
  power_levels: z.string(),
})

export type ChargerModel = z.infer<typeof ChargerModelSchema>

export const ChargerBrandSchema = z.object({
  id: z.number(),
  brand_name: z.string(),
  models: z.array(ChargerModelSchema),
})

export type ChargerBrand = z.infer<typeof ChargerBrandSchema>

export const ChargerBrandsResponseSchema = z.object({
  statusCode: z.number(),
  data: z.array(ChargerBrandSchema),
  message: z.string(),
})

export type ChargerBrandsResponse = z.infer<typeof ChargerBrandsResponseSchema>

export const ChargingStationSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  station_name: optionalStringFromAny,
  station_detail: optionalStringFromAny,
  address: optionalStringFromAny,
  status: optionalNumberFromAny,
  created_at: optionalStringFromAny,
  team_group_id: optionalNumberFromAny,
  chargers: optionalNumberFromAny,
  team: optionalStringFromAny,
  aceesibility: optionalStringFromAny,
  gallery: optionalStringFromAny,
  date: optionalStringFromAny,
  time: optionalStringFromAny,
  station_type: optionalStringFromAny,
})

export type ChargingStation = z.infer<typeof ChargingStationSchema>

export const ChargingStationsDataSchema = createPaginatedSchema(ChargingStationSchema)

export type ChargingStationsData = z.infer<typeof ChargingStationsDataSchema>

export const ChargingStationsResponseSchema = z.object({
  statusCode: z.number(),
  data: ChargingStationsDataSchema,
  message: z.string(),
})

export type ChargingStationsResponse = z.infer<typeof ChargingStationsResponseSchema>

export const CreateChargerRequestSchema = z.object({
  partner_id: z.string(),
  station_id: z.number(),
  team_group_id: z.number(),
  charger_name: z.string(),
  charger_access: z.string(),
  max_kwh: z.string(),
  charger_type_id: z.number(),
  brand: z.number(),
  model: z.number(),
})

export type CreateChargerRequest = z.infer<typeof CreateChargerRequestSchema>

export const CreateChargerResponseSchema = z.object({
  statusCode: z.number(),
  data: z
    .object({
      data: z
        .object({
          id: z.number(),
        })
        .catchall(z.unknown()),
      message: z.string().optional(),
    })
    .catchall(z.unknown()),
  message: z.string(),
})

export type CreateChargerResponse = z.infer<typeof CreateChargerResponseSchema>

export const ChargerDetailSchema = z.object({
  id: z.number(),
  name: stringFromAny,
  serial_number: optionalStringFromAny.nullable(),
  image: optionalStringFromAny.nullable(),
  station_id: stringFromAny,
  station_name: stringFromAny,
  team_group_id: nullableNumberFromAny,
  team: optionalStringFromAny,
  charger_type_id: nullableNumberFromAny,
  charger_type: optionalStringFromAny,
  brand_id: nullableNumberFromAny,
  brand: optionalStringFromAny,
  model_id: nullableNumberFromAny,
  model: optionalStringFromAny,
  max_power: optionalStringFromAny.nullable(),
  aceesibility: optionalStringFromAny,
  status: optionalStringFromAny.nullable(),
  connection: optionalStringFromAny,
  date: optionalStringFromAny.nullable(),
  time: optionalStringFromAny.nullable(),
})

export type ChargerDetail = z.infer<typeof ChargerDetailSchema>

export const ChargerDetailResponseSchema = z.object({
  statusCode: z.number(),
  data: ChargerDetailSchema,
  message: z.string(),
})

export type ChargerDetailResponse = z.infer<typeof ChargerDetailResponseSchema>

export const UpdateSerialNumberRequestSchema = z.object({
  charger_code: z.string(),
  charger_id: z.number(),
})

export type UpdateSerialNumberRequest = z.infer<typeof UpdateSerialNumberRequestSchema>

export const UpdateSerialNumberResponseSchema = z.object({
  statusCode: z.number(),
  data: z.string(),
  message: z.string(),
})

export type UpdateSerialNumberResponse = z.infer<typeof UpdateSerialNumberResponseSchema>

export const CheckConnectionResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    status: z.string(),
    connected: z.boolean(),
  }),
  message: z.string(),
})

export type CheckConnectionResponse = z.infer<typeof CheckConnectionResponseSchema>

export const ChargerListItemSchema = z.object({
  id: z.number(),
  name: stringFromAny,
  serial_number: z.string().nullable(),
  image: z.string().nullable(),
  station_id: nullableNumberFromAny,
  station_name: stringFromAny,
  team: stringFromAny,
  charger_access: stringFromAny,
  model_id: nullableNumberFromAny,
  model_name: stringFromAny,
  brand_name: stringFromAny,
  brand_id: nullableNumberFromAny,
  power_levels: stringFromAny,
  max_kwh: stringFromAny,
  type_connector: stringFromAny,
  charger_code: stringFromAny,
  power_level: stringFromAny,
  accessibility: stringFromAny,
  status: stringFromAny,
  connection: stringFromAny,
  date: stringFromAny,
  time: stringFromAny,
})

export type ChargerListItem = z.infer<typeof ChargerListItemSchema>

export const ChargerListDataSchema = createPaginatedSchema(ChargerListItemSchema)

export type ChargerListData = z.infer<typeof ChargerListDataSchema>

export const ChargerListResponseSchema = z.object({
  statusCode: z.number(),
  data: ChargerListDataSchema,
  message: z.string(),
})

export type ChargerListResponse = z.infer<typeof ChargerListResponseSchema>

export const ChargerTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  plug_type: z.string(),
  icon_plug_type: z.string(),
  max_output: z.string(),
  slug: z.string(),
  sort_order: z.number(),
})

export type ChargerType = z.infer<typeof ChargerTypeSchema>

export const ChargerTypeResponseSchema = z.object({
  statusCode: z.number(),
  data: z.array(ChargerTypeSchema),
  message: z.string(),
})

export type ChargerTypeResponse = z.infer<typeof ChargerTypeResponseSchema>

export const DeleteChargerResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
})

export type DeleteChargerResponse = z.infer<typeof DeleteChargerResponseSchema>
