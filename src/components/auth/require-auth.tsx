"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isVerifying = useAuthStore((s) => s.isVerifying);
  const router = useRouter();

  console.log("[RequireAuth] State:", { isAuthenticated, isVerifying });

  useEffect(() => {
    if (!isVerifying && !isAuthenticated) {
      console.log("[RequireAuth] 🚫 Not authenticated & not verifying → redirecting to /auth");
      router.replace("/auth");
    }
  }, [isVerifying, isAuthenticated, router]);

  if (isVerifying) {
    console.log("[RequireAuth] ⏳ Still verifying — showing nothing");
    return null;
  }

  if (!isAuthenticated) {
    console.log("[RequireAuth] ❌ Not authenticated — showing nothing (waiting for redirect)");
    return null;
  }

  console.log("[RequireAuth] ✅ Authenticated — rendering children");
  return <>{children}</>;
}
