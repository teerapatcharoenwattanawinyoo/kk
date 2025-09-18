import { z } from "zod";

// Tax Type Schema (จาก API response)
export const taxTypeSchema = z.object({
  id: z.number(),
  individual_type_id: z.number(),
  language_id: z.number(),
  name: z.string(),
});

// Tax Information Response Schema (จาก API GET)
export const taxInformationResponseSchema = z.object({
  id: z.string(),
  individual_type_id: z.number(),
  name: z.string(),
  last_name: z.string(),
  company_name: z.string().nullable(),
  branch: z.string().nullable(),
  tax_id: z.string(),
  country: z.string(),
  address: z.string(),
  province: z.string(),
  district: z.string(),
  sub_district: z.string(),
  post_code: z.string(),
  status: z.enum(["Wait_Approve", "Approved", "Rejected"]),
  tax_files: z.array(z.any()).default([]), // อาจจะเป็น file objects
});

// File validation schema
const fileSchema = z
  .instanceof(File, { message: "กรุณาเลือกไฟล์" })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "ขนาดไฟล์ต้องไม่เกิน 5MB",
  })
  .refine(
    (file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      return allowedTypes.includes(file.type);
    },
    {
      message: "รองรับเฉพาะไฟล์ JPG, PNG, PDF เท่านั้น",
    },
  );

// Optional file schema (for optional files)
const optionalFileSchema = z.union([fileSchema, z.null()]).optional();

// Tax Information Form Schema
export const taxInformationSchema = z.object({
  selectType: z.string().min(1, "กรุณาเลือกประเภท"),
  name: z.string().min(1, "กรุณากรอกชื่อ"),
  lastname: z.string().min(1, "กรุณากรอกนามสกุล"),
  companyName: z.string().optional(),
  branch: z.string().optional(),
  taxId: z
    .string()
    .min(1, "กรุณากรอกเลขประจำตัวผู้เสียภาษี")
    .regex(/^\d{13}$/, "เลขประจำตัวผู้เสียภาษีต้องเป็นตัวเลข 13 หลัก"),
  country: z.string().min(1, "กรุณาเลือกประเทศ"),
  taxInvoiceAddress: z.string().min(1, "กรุณากรอกที่อยู่ใบกำกับภาษี"),
  province: z.string().min(1, "กรุณากรอกจังหวัด"),
  district: z.string().min(1, "กรุณากรอกอำเภอ/เขต"),
  subDistrict: z.string().min(1, "กรุณากรอกตำบล/แขวง"),
  postcode: z
    .string()
    .min(1, "กรุณากรอกรหัสไปรษณีย์")
    .regex(/^\d{5}$/, "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก"),
  files: z
    .object({
      file1: optionalFileSchema,
      file2: optionalFileSchema,
      file3: optionalFileSchema,
    })
    .optional(),
});

// Type inference from schema
export type TaxInformationFormData = z.infer<typeof taxInformationSchema>;
export type TaxTypeData = z.infer<typeof taxTypeSchema>;
export type ITaxType = z.infer<typeof taxTypeSchema>; // เพิ่มสำหรับ backward compatibility
export type TaxInformationResponse = z.infer<
  typeof taxInformationResponseSchema
>;

// API request schema for creating tax information
export const createTaxInformationApiSchema = z.object({
  name: z.string(),
  last_name: z.string(),
  company_name: z.string().optional(),
  branch: z.string().optional(),
  tax_id: z.string(),
  country: z.string(),
  address: z.string(),
  province: z.string(),
  district: z.string(),
  sub_district: z.string(),
  post_code: z.string(),
  individual_type_id: z.number(),
  team_group_id: z.number(),
  file_twenty: z.instanceof(File).optional(),
  file_certificate: z.instanceof(File).optional(),
  file_id_card: z.instanceof(File).optional(),
});

export type CreateTaxInformationApiData = z.infer<
  typeof createTaxInformationApiSchema
>;

// TaxInvoiceReceipt Schemas (รวมทั้งหมดตาม API response)
export const taxInvoiceReceiptFullDataSchema = z.object({
  id: z.string().optional(),
  customer_id: z.string().nullable().optional(),

  // ส่วนของ invoice-number-prefix-tab
  format_document: z.number(),
  header_document: z.string(),
  center_document: z.string().optional().default(""),
  end_document: z.string(),
  status_document: z.union([z.string(), z.number()]),
  team_group_id: z.string(),

  // ส่วนของ receipt-tax-invoice-tab
  tax_title: z.string().optional().default("ใบเสร็จรับเงิน"),
  tax_code: z.string().nullable().optional(),
  tax_fullname: z.string().nullable().optional(),
  tax_branch: z.string().nullable().optional(),
  tax_payee_name: z.string().nullable().optional(),
  tax_position: z.string().nullable().optional(),
  tax_country: z.string().nullable().optional(),
  tax_address: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  sub_district: z.string().nullable().optional(),
  post_code: z.string().nullable().optional(),
  tax_note: z.string().nullable().optional(),
  tax_logo: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
  tax_signature: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
});

export const taxInvoiceReceiptResponseSchema = z.object({
  id: z.string(),
  customer_id: z.string().nullable(),

  // ส่วนของ invoice-number-prefix-tab
  format_document: z.number(),
  header_document: z.string(),
  center_document: z.string(),
  end_document: z.string(),
  status_document: z.union([z.string(), z.number()]),
  team_group_id: z.string().optional(),

  // ส่วนของ receipt-tax-invoice-tab
  tax_title: z.string(),
  tax_code: z.string().nullable(),
  tax_fullname: z.string().nullable(),
  tax_branch: z.string().nullable(),
  tax_payee_name: z.string().nullable(),
  tax_position: z.string().nullable(),
  tax_country: z.string().nullable(),
  tax_address: z.string().nullable(),
  province: z.string().nullable(),
  district: z.string().nullable(),
  sub_district: z.string().nullable(),
  post_code: z.string().nullable(),
  tax_note: z.string().nullable(),
  tax_logo: z.string().nullable(),
  tax_signature: z.string().nullable(),
});

// Schema สำหรับส่วน invoice-number-prefix เท่านั้น
export const taxInvoiceReceiptDataSchema = z.object({
  id: z.string().optional(),
  format_document: z.number(),
  header_document: z.string(),
  center_document: z.string().optional().default(""),
  end_document: z.string(),
  status_document: z.union([z.string(), z.number()]),
  team_group_id: z.string(),
});

// Schema สำหรับส่วน receipt-tax-invoice เท่านั้น
export const receiptTaxInvoiceDataSchema = z.object({
  tax_title: z.string().optional().default("ใบเสร็จรับเงิน"),
  tax_code: z.string().nullable().optional(),
  tax_fullname: z.string().nullable().optional(),
  tax_branch: z.string().nullable().optional(),
  tax_payee_name: z.string().nullable().optional(),
  tax_position: z.string().nullable().optional(),
  tax_country: z.string().nullable().optional(),
  tax_address: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  sub_district: z.string().nullable().optional(),
  post_code: z.string().nullable().optional(),
  tax_note: z.string().nullable().optional(),
  tax_logo: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
  tax_signature: z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .optional(),
});

// Type inference for TaxInvoiceReceipt schemas
export type TaxInvoiceReceiptFullData = z.infer<
  typeof taxInvoiceReceiptFullDataSchema
>;
export type TaxInvoiceReceiptData = z.infer<typeof taxInvoiceReceiptDataSchema>;
export type ReceiptTaxInvoiceData = z.infer<typeof receiptTaxInvoiceDataSchema>;
export type TaxInvoiceReceiptResponse = z.infer<
  typeof taxInvoiceReceiptResponseSchema
>;

// Validation helpers
export const validateTaxForm = (data: unknown) => {
  return taxInformationSchema.safeParse(data);
};

export const validateTaxFormField = (
  field: keyof TaxInformationFormData,
  value: unknown,
) => {
  const fieldSchema = taxInformationSchema.shape[field];
  return fieldSchema.safeParse(value);
};
