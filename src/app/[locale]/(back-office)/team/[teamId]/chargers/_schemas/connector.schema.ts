import { z } from 'zod'

const stringFromAny = z.preprocess((value) => {
  if (value === null || value === undefined) return ''
  return String(value)
}, z.string())

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

const nullableStringFromAny = z.preprocess((value) => {
  if (value === null || value === undefined) return null
  return String(value)
}, z.string().nullable())

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

const createPaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.union([legacyStringPagination(itemSchema), legacyCurrentPagination(itemSchema)])

const connectorTypeSchema = z.object({
  id: z.number(),
  name: stringFromAny,
  image: nullableStringFromAny,
  sort_order: optionalNumberFromAny,
  status: optionalNumberFromAny,
  deleted_at: nullableStringFromAny,
  created_at: optionalStringFromAny,
  created_by: optionalNumberFromAny,
  updated_at: optionalStringFromAny,
  updated_by: optionalNumberFromAny.nullable(),
})

export const ConnectorTypeListResponseSchema = z.object({
  statusCode: z.number(),
  data: z.array(connectorTypeSchema),
  message: z.string(),
})

export const ConnectorListItemSchema = z.object({
  id: z.number(),
  name: nullableStringFromAny,
  serial_number: nullableStringFromAny,
  charger_id: z.number().optional(),
  type: stringFromAny,
  station_name: stringFromAny,
  qr: nullableStringFromAny,
  pricing: stringFromAny,
  status: stringFromAny,
  date: stringFromAny,
  time: stringFromAny,
})

export const ConnectorListDataSchema = createPaginatedSchema(ConnectorListItemSchema)

export const ConnectorListResponseSchema = z.object({
  statusCode: z.number(),
  data: ConnectorListDataSchema,
  message: z.string(),
})

export const ConnectorChargerSchema = z.object({
  id: z.number(),
  name: stringFromAny,
  serial_number: nullableStringFromAny,
  image: nullableStringFromAny,
  station_name: stringFromAny,
  team: stringFromAny,
  aceesibility: stringFromAny,
  status: stringFromAny,
  connection: stringFromAny,
  date: stringFromAny,
  time: stringFromAny,
})

export const ConnectorChargerListResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    data: z.array(ConnectorChargerSchema),
  }),
  message: z.string(),
})

export const ConnectorSelectItemSchema = ConnectorChargerSchema

const connectorDataSchema = z.object({
  cost_rate: stringFromAny,
  id: z.number(),
  charger_id: optionalNumberFromAny,
  charger_type_id: optionalNumberFromAny,
  connector_name: stringFromAny,
  connection_id: optionalNumberFromAny,
  power: stringFromAny,
  created_at: optionalStringFromAny,
  created_by: optionalNumberFromAny,
  type: stringFromAny,
  updated_at: optionalStringFromAny,
  type_description: nullableStringFromAny,
  sort_order: optionalNumberFromAny.nullable(),
  status: optionalStringFromAny.nullable(),
  deleted_at: nullableStringFromAny,
  updated_by: optionalNumberFromAny.nullable(),
  serial_number: nullableStringFromAny,
  qrcode: nullableStringFromAny,
  connector_status: stringFromAny,
  print_qrcode: nullableStringFromAny,
  ocpp_id_tag: nullableStringFromAny,
})

const connectorPayloadSchema = z.object({
  charger_id: z.number(),
  charger_type_id: z.number(),
  connector_name: stringFromAny,
  connection_id: z.number(),
  connector_type: stringFromAny,
  power: stringFromAny,
})

export const CreateConnectorRequestSchema = connectorPayloadSchema

export const CreateConnectorResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    message: z.string(),
    data: connectorDataSchema,
  }),
  message: z.string(),
})

export const UpdateConnectorRequestSchema = connectorPayloadSchema

export const UpdateConnectorResponseSchema = CreateConnectorResponseSchema

export const ConnectorDetailResponseSchema = z.object({
  statusCode: z.number(),
  data: connectorDataSchema,
  message: z.string(),
})

export const DeleteConnectorResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
})

export type ConnectorTypeListResponse = z.infer<typeof ConnectorTypeListResponseSchema>
export type ConnectorType = z.infer<typeof connectorTypeSchema>

export type ConnectorListItem = z.infer<typeof ConnectorListItemSchema>
export type ConnectorListData = z.infer<typeof ConnectorListDataSchema>
export type ConnectorListResponse = z.infer<typeof ConnectorListResponseSchema>

export type ConnectorCharger = z.infer<typeof ConnectorChargerSchema>
export type ConnectorChargerListResponse = z.infer<typeof ConnectorChargerListResponseSchema>
export type ConnectorSelectItem = z.infer<typeof ConnectorSelectItemSchema>

export type CreateConnectorRequest = z.infer<typeof CreateConnectorRequestSchema>
export type CreateConnectorResponse = z.infer<typeof CreateConnectorResponseSchema>

export type UpdateConnectorRequest = z.infer<typeof UpdateConnectorRequestSchema>
export type UpdateConnectorResponse = z.infer<typeof UpdateConnectorResponseSchema>

export type ConnectorDetailResponse = z.infer<typeof ConnectorDetailResponseSchema>
export type ConnectorData = z.infer<typeof connectorDataSchema>
export type DeleteConnectorResponse = z.infer<typeof DeleteConnectorResponseSchema>
