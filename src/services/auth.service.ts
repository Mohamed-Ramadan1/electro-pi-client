import { apiClient } from "@/lib/api/client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/api";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log("[AuthService] 🔐 POST /auth/login — email:", data.email);
    const res = await apiClient.post<AuthResponse>("/auth/login", data);
    console.log("[AuthService] 🔐 /auth/login FULL response:", {
      status: res.status,
      dataKeys: Object.keys(res.data),
      hasAccessToken: "accessToken" in res.data,
      hasToken: "token" in res.data,
      accessToken: res.data.accessToken,
      token: res.data.token,
      user: res.data.user,
      fullData: res.data,
    });
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    console.log("[AuthService] 📝 POST /auth/register — email:", data.email);
    const res = await apiClient.post<AuthResponse>("/auth/register", data);
    console.log("[AuthService] 📝 /auth/register response — status:", res.status, "data keys:", Object.keys(res.data));
    return res.data;
  },

  me: async (): Promise<{ email: string; name: string; roles: string[] }> => {
    console.log("[AuthService] 👤 GET /users/members/me — sending request...");
    const res = await apiClient.get("/users/members/me");
    console.log("[AuthService] 👤 /me RAW response:", {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(
        Object.entries(res.headers).filter(([k]) =>
          ["content-type", "set-cookie", "authorization"].some((h) =>
            k.toLowerCase().includes(h),
          ),
        ),
      ),
      data: res.data,
      dataKeys: Object.keys(res.data),
    });
    console.log("[AuthService] 👤 /me res.data.user:", res.data.user);
    return res.data.user;
  },

  logout: async (): Promise<void> => {
    console.log("[AuthService] 🚪 POST /auth/logout");
    await apiClient.post("/auth/logout");
  },
};
