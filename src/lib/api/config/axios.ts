import {
  getAuthTokens,
  removeAuthTokens,
  setAuthTokens,
} from "@/lib/auth/tokens";
import { API_BASE_URL } from "@/lib/constants";
import { getCurrentLanguage, getLanguageId } from "@/lib/utils/language";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { refreshAccessToken } from "../refresh";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = getAuthTokens();
    const currentLang = getCurrentLanguage();
    const langId = getLanguageId(currentLang);

    // if (config.headers) {
    //   config.headers["lang-id"] = langId;
    // }

    if (config.headers) {
      config.headers["lang-id"] = "2";
    }
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // ลบ Content-Type header สำหรับ FormData เพื่อให้ browser จัดการเอง
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // ตรวจสอบว่าเป็น 401/403 และยังไม่เคย retry และไม่ใช่ refresh token endpoint
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url?.endsWith("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      const { refreshToken } = getAuthTokens();

      if (!refreshToken) {
        removeAuthTokens();
        if (typeof window !== "undefined") window.location.href = "/sign-in";
        return Promise.reject(new Error("No refresh token available"));
      }

      try {
        const { access_token, refresh_token } =
          await refreshAccessToken(refreshToken);

        setAuthTokens(access_token, refresh_token || refreshToken || "");

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        removeAuthTokens();
        if (typeof window !== "undefined") window.location.href = "/sign-in";
        return Promise.reject(
          new Error("Session expired - please login again"),
        );
      }
    }

    let errorMessage = "An error occurred";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorMessage = data?.message || "Bad request";
          break;
        case 401:
          errorMessage = "Unauthorized - please login";
          break;
        case 403:
          errorMessage = "Access denied";
          break;
        case 404:
          errorMessage = "Resource not found";
          break;
        case 422:
          errorMessage = data?.message || "Validation error";
          break;
        case 500:
          errorMessage = "Internal server error";
          break;
        default:
          errorMessage = data?.message || `HTTP error ${status}`;
      }
    } else if (error.request) {
      errorMessage = "Network error - please check your internet connection";
    } else {
      errorMessage = error.message || "Unknown error";
    }

    return Promise.reject(new Error(errorMessage));
  },
);

export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(url, config).then((response) => response.data),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    apiClient.post<T>(url, data, config).then((response) => response.data),

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    apiClient.put<T>(url, data, config).then((response) => response.data),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    apiClient.patch<T>(url, data, config).then((response) => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(url, config).then((response) => response.data),
};

export default apiClient;

export type { AxiosRequestConfig, AxiosResponse } from "axios";
