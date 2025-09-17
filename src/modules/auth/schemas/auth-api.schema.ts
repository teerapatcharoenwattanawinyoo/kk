import { z } from "zod";

const optionalEmailSchema = z
  .string({ required_error: "Email is required" })
  .email("Invalid email address");

const optionalPhoneSchema = z
  .string({ required_error: "Phone number is required" })
  .min(1, "Phone number is required");

export const loginRequestSchema = z
  .object({
    phone: optionalPhoneSchema.optional(),
    email: optionalEmailSchema.optional(),
    password: z.string({ required_error: "Password is required" }).min(1),
  })
  .superRefine((value, ctx) => {
    if (!value.phone && !value.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either phone or email must be provided",
        path: ["phone"],
      });
    }

    if (value.phone && value.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Provide only a phone number or an email address",
        path: ["phone"],
      });
    }
  });

const stringOrNumberToStringSchema = z
  .union([z.string(), z.number()])
  .transform((value) => value.toString());

const nullableStringOrNumberToStringSchema = z
  .union([z.string(), z.number(), z.null()])
  .transform((value) => {
    if (value === null) {
      return null;
    }

    return value.toString();
  });

const nullableStringToStringSchema = z
  .union([z.string(), z.null()])
  .transform((value) => value ?? "");

export const userSchema = z.object({
  customer_id: stringOrNumberToStringSchema,
  email: z
    .union([z.string().email(), z.null()])
    .transform((value) => value ?? ""),
  phone: nullableStringToStringSchema,
  profilename: z.string(),
  avatar: z.string().nullable(),
  platform_type: z.string(),
  company_id: nullableStringOrNumberToStringSchema,
  team_id: nullableStringOrNumberToStringSchema,
  device: nullableStringToStringSchema,
  team_host_id: nullableStringToStringSchema,
});

export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: userSchema,
});

const apiResponseBaseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
});

export const createApiResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  apiResponseBaseSchema.extend({
    data: dataSchema,
  });

export const loginApiResponseSchema =
  createApiResponseSchema(loginResponseSchema);

export const registerByEmailRequestSchema = z.object({
  email: optionalEmailSchema,
  country_code: z.string({ required_error: "Country code is required" }).min(1),
});

export const registerByEmailDataSchema = z.object({
  message: z.string(),
  userId: stringOrNumberToStringSchema,
  token: z.string(),
});

export const registerByEmailResponseSchema = createApiResponseSchema(
  registerByEmailDataSchema
);

export const verifyEmailRequestSchema = z.object({
  email: optionalEmailSchema,
  otp: z.string({ required_error: "OTP is required" }).min(1),
  token: z.string({ required_error: "Token is required" }),
});

export const verifyEmailResponseSchema = apiResponseBaseSchema;

export const registerByPhoneRequestSchema = z.object({
  phone: optionalPhoneSchema,
  country_code: z.string({ required_error: "Country code is required" }).min(1),
});

export const registerByPhoneDataSchema = z.object({
  message: z.string(),
  userId: stringOrNumberToStringSchema,
  token: z.string(),
});

export const registerByPhoneResponseSchema = createApiResponseSchema(
  registerByPhoneDataSchema
);

export const verifyPhoneOtpRequestSchema = z.object({
  phone: optionalPhoneSchema,
  otp: z.string({ required_error: "OTP is required" }).min(1),
  token: z.string({ required_error: "Token is required" }),
});

export const forgotPasswordEmailRequestSchema = z.object({
  email: optionalEmailSchema,
});

export const forgotPasswordPhoneRequestSchema = z.object({
  phone: optionalPhoneSchema,
});

export const forgotPasswordResponseSchema = z.object({
  token: z.string(),
  message: z.string(),
});

export const verifyOtpResponseSchema = z.object({
  token: z.string(),
  message: z.string(),
});

export const resetPasswordRequestSchema = z.object({
  token: z.string({ required_error: "Token is required" }),
  newPassword: z
    .string({ required_error: "New password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

export const resetPasswordResponseSchema = z.object({
  message: z.string(),
});

export const createProfileRequestSchema = z.object({
  email: optionalEmailSchema.or(z.literal("")).optional(),
  country_code: z
    .string({ required_error: "Country code is required" })
    .min(1, "Country code is required"),
  profilename: z
    .string({ required_error: "Profile name is required" })
    .min(1, "Profile name is required"),
  phone: optionalPhoneSchema.or(z.literal("")).optional(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
  token: z.string({ required_error: "Token is required" }),
});

export const createProfileResponseSchema = apiResponseBaseSchema;

export const policyDescriptionSchema = z.object({
  id: stringOrNumberToStringSchema,
  languageId: stringOrNumberToStringSchema,
  policyId: stringOrNumberToStringSchema,
  name: z.string(),
  detail: z.string(),
  createdAt: z.string(),
  createdBy: stringOrNumberToStringSchema,
  updatedAt: z.string().nullable(),
  updatedBy: nullableStringOrNumberToStringSchema,
  policy_id: stringOrNumberToStringSchema,
});

export const policySchema = z.object({
  id: stringOrNumberToStringSchema,
  name: z.string(),
  version: z.string(),
  slug: z.string(),
  status: stringOrNumberToStringSchema,
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  createdBy: stringOrNumberToStringSchema,
  updatedAt: z.string().nullable(),
  updatedBy: nullableStringOrNumberToStringSchema,
  descriptions: z.array(policyDescriptionSchema),
});

export const getPolicyResponseSchema = createApiResponseSchema(
  z.array(policySchema)
);

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginApiResponse = z.infer<typeof loginApiResponseSchema>;
export type RegisterByEmailRequest = z.infer<
  typeof registerByEmailRequestSchema
>;
export type RegisterByEmailData = z.infer<typeof registerByEmailDataSchema>;
export type RegisterByEmailResponse = z.infer<
  typeof registerByEmailResponseSchema
>;
export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;
export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;
export type RegisterByPhoneRequest = z.infer<
  typeof registerByPhoneRequestSchema
>;
export type RegisterByPhoneData = z.infer<typeof registerByPhoneDataSchema>;
export type RegisterByPhoneResponse = z.infer<
  typeof registerByPhoneResponseSchema
>;
export type VerifyPhoneOtpRequest = z.infer<typeof verifyPhoneOtpRequestSchema>;
export type CreateProfileRequest = z.infer<typeof createProfileRequestSchema>;
export type CreateProfileResponse = z.infer<typeof createProfileResponseSchema>;
export type Policy = z.infer<typeof policySchema>;
export type GetPolicyResponse = z.infer<typeof getPolicyResponseSchema>;
export type ForgotPasswordEmailRequest = z.infer<
  typeof forgotPasswordEmailRequestSchema
>;
export type ForgotPasswordPhoneRequest = z.infer<
  typeof forgotPasswordPhoneRequestSchema
>;
export type ForgotPasswordResponse = z.infer<
  typeof forgotPasswordResponseSchema
>;
export type VerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;
