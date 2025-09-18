import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "./config/axios";
import { IResponse } from "./config/model";

export interface ForgotPasswordEmailRequest {
  email: string;
}

export interface ForgotPasswordPhoneRequest {
  phone: string;
}

export interface VerifyEmailOTPRequest {
  email: string;
  otp: string;
  token: string;
}

export interface VerifyPhoneOTPRequest {
  phone: string;
  otp: string;
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordResponse {
  token: string;
  message: string;
}

export interface VerifyOTPResponse {
  token: string;
  message: string;
}

// API Functions
export const forgotPasswordApi = async (
  data: ForgotPasswordEmailRequest | ForgotPasswordPhoneRequest,
): Promise<IResponse<ForgotPasswordResponse>> => {
  return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
};

export const verifyEmailOTPApi = async (
  data: VerifyEmailOTPRequest,
): Promise<IResponse<VerifyOTPResponse>> => {
  return api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
};

export const verifyPhoneOTPApi = async (
  data: VerifyPhoneOTPRequest,
): Promise<IResponse<VerifyOTPResponse>> => {
  return api.post(API_ENDPOINTS.AUTH.VERIFY_PHONE, data);
};

export const resetPasswordApi = async (
  data: ResetPasswordRequest,
): Promise<IResponse<{ message: string }>> => {
  return api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
};
