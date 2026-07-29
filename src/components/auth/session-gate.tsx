"use client";

import { useEffect } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function SessionGate({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const setVerifying = useAuthStore((s) => s.setVerifying);

  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setVerifying(false);
      return;
    }

    console.log("[SessionGate] 🔍 Calling GET /users/members/me ...");

    authService
      .me()
      .then((user) => {
        if (cancelled) return;
        console.log("[SessionGate] ✅ /me succeeded:", {
          email: user.email,
          name: user.name,
          roles: user.roles,
        });
        setUser(user.id, user.email, user.name, user.roles);
      })
      .catch((error) => {
        if (cancelled) return;
        if (error?.status === 401) {
          console.log("[SessionGate] No valid session found, logging out.");
        } else {
          console.error("[SessionGate] ❌ /me failed:", {
            message: error?.message,
            status: error?.status,
            code: error?.code,
            name: error?.name,
            stack: error?.stack,
            fullError: error,
          });
        }
        logout();
      });

    return () => {
      cancelled = true;
    };
  }, [token, setUser, logout, setVerifying]);

  return <>{children}</>;
}
