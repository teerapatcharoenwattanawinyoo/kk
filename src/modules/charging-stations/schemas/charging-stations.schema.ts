import { z } from 'zod'

// ============================
// Base Types
// ============================

export const DayOfWeekSchema = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

export const OpenCloseTimeSchema = z.object({
  enabled: z.boolean(),
  open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
})

export const OpenCloseFormStateSchema = z.object({
  open24hrs: z.boolean(),
  sameEveryday: z.boolean(),
  days: z.record(DayOfWeekSchema, OpenCloseTimeSchema),
})

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

// ============================
// Main Form Schema
// ============================

export const ChargingStationFormSchema = z.object({
  // Basic Information
  station_name: z.string().min(1, 'Station name is required'),
  station_name_th: z.string().optional(),
  station_name_lao: z.string().optional(),

  // Description
  station_detail: z.string().min(1, 'Station detail is required'),
  station_detail_th: z.string().optional(),
  station_detail_lao: z.string().optional(),

  // Location
  address: z.string().min(1, 'Address is required'),
  coordinates: CoordinatesSchema,

  // Category & Status
  station_type_id: z.number().min(1, 'Station category is required'),
  status: z.number().min(1).max(6),
  show_on_map: z.boolean(),

  // Optional Fields
  openClose: z.string().optional(),
  contact: z.string().optional(),

  // Images for upload
  image: z.array(z.instanceof(File)).optional(),
})

// ============================
// API Request Schemas
// ============================

export const WorkTimeSchema = z.object({
  work_day: z.string(),
  work_status: z.enum(['0', '1']),
  work_time_start: z.string(),
  work_time_end: z.string(),
})

export const CreateChargingStationRequestSchema = z.object({
  latitude: z.string(),
  longtitude: z.string(), // Note: API uses "longtitude" (typo in API)
  station_name: z.string().min(1),
  station_name_th: z.string().optional(),
  station_name_lao: z.string().optional(),
  station_detail: z.string().min(1),
  station_detail_th: z.string().optional(),
  station_detail_lao: z.string().optional(),
  station_type_id: z.number().min(1),
  address: z.string().min(1),
  status: z.number().min(1).max(6),
  show_on_map: z.boolean(),
  work: z.array(WorkTimeSchema),
  team_group_id: z.number().min(1),
  contact: z.string().optional(),
  image: z.array(z.instanceof(File)).optional(),
})

export const UpdateChargingStationRequestSchema = CreateChargingStationRequestSchema.extend({
  id: z.number().min(1),
}).omit({ team_group_id: true })

// Extended UpdateChargingStationRequest with deletedImageIds for UI
export const ExtendedUpdateChargingStationRequestSchema = UpdateChargingStationRequestSchema.extend(
  {
    deletedImageIds: z.array(z.number()).optional(),
  },
)

export const ChargingStationFormSubmissionSchema = ChargingStationFormSchema.extend({
  work: z.array(WorkTimeSchema).optional(),
  images: z.array(z.instanceof(File)).optional(),
  deletedImageIds: z.array(z.number()).optional(),
})

// ============================
// API Response Schemas (จำเป็นสำหรับ API)
// ============================

export const PartnerStationWorkSchema = z.object({
  id: z.number(),
  work_day: z.string(),
  work_time_start: z.string(),
  work_time_end: z.string(),
  work_status: z.string(),
})

export const PartnerStationDescriptionSchema = z.object({
  id: z.number(),
  language_id: z.number(),
  station_name: z.string(),
  station_detail: z.string(),
})

export const StationTypeDescriptionSchema = z.object({
  id: z.number(),
  language_id: z.number(),
  name: z.string(),
})

export const StationTypeSchema = z.object({
  id: z.number(),
  descriptions: z.array(StationTypeDescriptionSchema),
})

export const PartnerStationGalleryDetailSchema = z.object({
  id: z.number(),
  image: z.string(),
  sort_order: z.number().optional(),
})

export const ChargingStationFormWithGallerySchema = ChargingStationFormSchema.extend({
  existingGallery: z.array(PartnerStationGalleryDetailSchema).default([]),
})

export const ChargingStationSchema = z.object({
  id: z.string(),
  station_name: z.string(),
  station_detail: z.string(),
  address: z.string(),
  status: z.number(),
  created_at: z.string(),
  team_group_id: z.number(),
  chargers: z.number(),
  connectors: z.number(),
  team: z.string(),
  aceesibility: z.string(),
  station_type_id: z.string(),
  latitude: z.string(),
  longtitude: z.string(),
  partner_id: z.number(),
  gallery: z.string(),
  work: z.array(WorkTimeSchema),
  date: z.string(),
  time: z.string(),
})

export const ChargingStationsResponseSchema = z.object({
  statusCode: z.number(),
  data: z.object({
    page_current: z.string(),
    page_total: z.number(),
    page_size: z.string(),
    item_total: z.number(),
    data: z.array(ChargingStationSchema),
  }),
  message: z.string(),
})

export const ChargingStationsParamsSchema = z
  .object({
    page: z.number().optional(),
    pageSize: z.number().optional(),
    team_group_id: z.number(), // required เพราะต้องอยู่ใน URL path
    search: z.string().optional(),
    status: z.string().optional(),
  })
  .and(z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]).optional()))

export const StationCategorySchema = z.object({
  id: z.number(),
  languageId: z.number(),
  name: z.string(),
  station_type_id: z.string(),
})

export const StationCategoriesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(StationCategorySchema),
  message: z.string(),
})

export const CreateChargingStationResponseDataSchema = z.object({
  id: z.number(),
  station_name: z.string(),
  station_detail: z.string(),
  address: z.string(),
  status: z.number(),
  team_group_id: z.number(),
  longtitude: z.string(),
  latitude: z.string(),
  station_type_id: z.string(),
  contact: z.string().nullable(),
  partner_station_work: z.array(PartnerStationWorkSchema),
  partner_station_description: z.array(PartnerStationDescriptionSchema),
  station_type: StationTypeSchema,
  partner_station_gallery: z.array(PartnerStationGalleryDetailSchema),
})

export const CreateChargingStationResponseSchema = z.object({
  statusCode: z.number(),
  data: CreateChargingStationResponseDataSchema,
  message: z.string(),
})

export const UpdateChargingStationResponseSchema = z.object({
  statusCode: z.number(),
  data: CreateChargingStationResponseDataSchema,
  message: z.string(),
})

export const ChargingStationDetailSchema = z.object({
  id: z.union([z.string(), z.number()]),
  station_name: z.string(),
  station_detail: z.string(),
  address: z.string(),
  status: z.number(),
  team_group_id: z.number(),
  longtitude: z.string(),
  latitude: z.string(),
  station_type_id: z.union([z.string(), z.number()]),
  contact: z.string().optional(),
  partner_station_work: z.array(PartnerStationWorkSchema).optional(),
  partner_station_description: z.array(PartnerStationDescriptionSchema).optional(),
  station_type: StationTypeSchema.optional(),
  partner_station_gallery: z.array(PartnerStationGalleryDetailSchema).optional(),
})

export const GetChargingStationDetailResponseSchema = z.object({
  statusCode: z.number(),
  data: ChargingStationDetailSchema,
  message: z.string(),
})

// ============================
// Form Validation Schemas
// ============================

// Step 1 validation
export const Step1ValidationSchema = ChargingStationFormSchema.pick({
  station_name: true,
  station_name_th: true,
  station_name_lao: true,
  station_detail: true,
  station_detail_th: true,
  station_detail_lao: true,
  station_type_id: true,
})

// Step 2 validation
export const Step2ValidationSchema = ChargingStationFormSchema.pick({
  address: true,
  coordinates: true,
  status: true,
  show_on_map: true,
})

// Complete form validation
export const CompleteFormValidationSchema = ChargingStationFormSchema

// ============================
// Custom Validation Functions
// ============================

/**
 * Validates multi-language form based on selected language
 */
export const validateMultiLanguageForm = (
  data: z.infer<typeof ChargingStationFormSchema>,
  selectedLanguage: string,
) => {
  const errors: string[] = []

  // Always require English
  if (!data.station_name.trim()) {
    errors.push('English station name is required')
  }
  if (!data.station_detail.trim()) {
    errors.push('English station detail is required')
  }

  // Require selected language if not English
  if (selectedLanguage === 'th') {
    if (!data.station_name_th?.trim()) {
      errors.push('Thai station name is required')
    }
    if (!data.station_detail_th?.trim()) {
      errors.push('Thai station detail is required')
    }
  } else if (selectedLanguage === 'lo') {
    if (!data.station_name_lao?.trim()) {
      errors.push('Lao station name is required')
    }
    if (!data.station_detail_lao?.trim()) {
      errors.push('Lao station detail is required')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates open/close form state
 */
export const validateOpenCloseForm = (openCloseForm: z.infer<typeof OpenCloseFormStateSchema>) => {
  try {
    OpenCloseFormStateSchema.parse(openCloseForm)

    // Additional business logic validation
    if (!openCloseForm.open24hrs && !openCloseForm.sameEveryday) {
      const enabledDays = Object.values(openCloseForm.days).filter((day) => day.enabled)
      if (enabledDays.length === 0) {
        return {
          isValid: false,
          errors: ['At least one day must be enabled'],
        }
      }
    }

    return {
      isValid: true,
      errors: [],
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((err) => err.message),
      }
    }
    return {
      isValid: false,
      errors: ['Invalid open/close form data'],
    }
  }
}

// ============================
// Type Exports
// ============================

export type DayOfWeek = z.infer<typeof DayOfWeekSchema>
export type OpenCloseTime = z.infer<typeof OpenCloseTimeSchema>
export type OpenCloseFormState = z.infer<typeof OpenCloseFormStateSchema>
export type Coordinates = z.infer<typeof CoordinatesSchema>
export type ChargingStationFormData = z.infer<typeof ChargingStationFormSchema>
export type WorkTime = z.infer<typeof WorkTimeSchema>
export type CreateChargingStationRequest = z.infer<typeof CreateChargingStationRequestSchema>
export type UpdateChargingStationRequest = z.infer<typeof UpdateChargingStationRequestSchema>

// Response types (จำเป็นสำหรับ API)
export type PartnerStationWork = z.infer<typeof PartnerStationWorkSchema>
export type PartnerStationDescription = z.infer<typeof PartnerStationDescriptionSchema>
export type StationTypeDescription = z.infer<typeof StationTypeDescriptionSchema>
export type StationType = z.infer<typeof StationTypeSchema>
export type PartnerStationGalleryDetail = z.infer<typeof PartnerStationGalleryDetailSchema>
export type ChargingStation = z.infer<typeof ChargingStationSchema>
export type ChargingStationsResponse = z.infer<typeof ChargingStationsResponseSchema>
export type ChargingStationsParams = z.infer<typeof ChargingStationsParamsSchema>
export type StationCategory = z.infer<typeof StationCategorySchema>
export type StationCategoriesResponse = z.infer<typeof StationCategoriesResponseSchema>
export type CreateChargingStationResponseData = z.infer<
  typeof CreateChargingStationResponseDataSchema
>
export type CreateChargingStationResponse = z.infer<typeof CreateChargingStationResponseSchema>
export type UpdateChargingStationResponse = z.infer<typeof UpdateChargingStationResponseSchema>
export type ChargingStationDetail = z.infer<typeof ChargingStationDetailSchema>
export type GetChargingStationDetailResponse = z.infer<
  typeof GetChargingStationDetailResponseSchema
>
export type ExtendedUpdateChargingStationRequest = z.infer<
  typeof ExtendedUpdateChargingStationRequestSchema
>
export type ChargingStationFormWithGallery = z.infer<
  typeof ChargingStationFormWithGallerySchema
>
export type ChargingStationFormSubmission = z.infer<
  typeof ChargingStationFormSubmissionSchema
>
