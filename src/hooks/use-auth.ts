"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginRequest, RegisterRequest } from "@/types/api";

export function useLogin() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Persist the Bearer token so API calls survive page refresh
      const token = response.tokens?.accessToken ?? response.accessToken ?? response.token;
      if (token) {
        console.log("[useLogin] 🔑 Saving token from login response");
        setToken(token);
      } else {
        console.warn("[useLogin] ⚠️ No token in login response — relying on cookies only");
      }
      setUser(response.user.email, response.user.name, response.user.roles);
      toast.success(response.message || "Welcome back!");
      router.push("/home");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Invalid email or password");
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      const token = response.tokens?.accessToken ?? response.accessToken ?? response.token;
      if (token) {
        console.log("[useRegister] 🔑 Saving token from register response");
        setToken(token);
      } else {
        console.warn("[useRegister] ⚠️ No token in register response — relying on cookies only");
      }
      setUser(response.user.email, response.user.name, response.user.roles);
      toast.success(response.message || "Account created!");
      router.push("/home");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clear();
      router.push("/auth");
    },
  });
}
