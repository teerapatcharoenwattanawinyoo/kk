import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";
import axios from "axios";
import type { ApiResponse, LoginResponse } from "./auth";

// Use direct axios instance to avoid interceptor conflicts
export async function refreshAccessToken(
  refreshToken: string | undefined,
): Promise<LoginResponse> {
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.get<ApiResponse<LoginResponse>>(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
        "lang-id": "2",
      },
      timeout: 10000,
    },
  );

  return response.data.data;
}
