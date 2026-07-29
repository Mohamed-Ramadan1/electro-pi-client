import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ApiError } from "@/lib/api/api-error";
import { getStoredToken } from "@/lib/storage";

const SKIP_401_REDIRECT = [
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/users/members/me",
];

const apiClient = axios.create({
  baseURL: "/api/v1",
  timeout: 30000,
  withCredentials: true,
});

/* ── Attach Bearer token + log outgoing requests ── */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  console.log("[Axios] 📤", config.method?.toUpperCase(), config.url, {
    withCredentials: config.withCredentials,
    documentCookies: typeof document !== "undefined" ? document.cookie : "SSR",
  });
  return config;
});

/* ── Log incoming responses + Set-Cookie headers ── */
apiClient.interceptors.response.use(
  (response) => {
    console.log("[Axios] 📥", response.config.method?.toUpperCase(), response.config.url, {
      status: response.status,
      "set-cookie": response.headers["set-cookie"],
      data: response.data,
    });
    return response;
  },
  (error: AxiosError<{
    message?: string | string[];
    error?: string;
    statusCode?: number;
    code?: string;
    details?: Record<string, unknown>;
  }>) => {
    if (error.response) {
      const skipLog = SKIP_401_REDIRECT.some((ep) =>
        error.config?.url?.includes(ep),
      );

      if (!skipLog) {
        console.error("[Axios] ❌", error.config?.method?.toUpperCase(), error.config?.url, {
          status: error.response.status,
          "set-cookie": error.response.headers["set-cookie"],
          data: error.response.data,
        });
      }

      const apiError = ApiError.fromResponse(
        error.response.status,
        error.response.data,
      );

      const skipRedirect = SKIP_401_REDIRECT.some((ep) =>
        error.config?.url?.includes(ep),
      );

      if (
        apiError.isUnauthorized &&
        !skipRedirect &&
        typeof window !== "undefined"
      ) {
        window.location.href = "/auth";
      }

      return Promise.reject(apiError);
    }

    if (error.request) {
      console.error("[Axios] 🔌 Network error — no response received for", error.config?.url);
      return Promise.reject(
        new ApiError("Network error — please check your connection", 0, "NETWORK_ERROR"),
      );
    }

    console.error("[Axios] ❓ Unknown error:", error.message);
    return Promise.reject(
      new ApiError(error.message ?? "An unexpected error occurred", 0, "UNKNOWN_ERROR"),
    );
  },
);

export { apiClient };
