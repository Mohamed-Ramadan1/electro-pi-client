"use client";

import { useAuthStore } from "@/stores/auth-store";

export function useIsAdmin(): boolean {
  return useAuthStore((s) => !!s.user?.roles?.includes("admin"));
}

export function useHasRole(role: string): boolean {
  return useAuthStore((s) => !!s.user?.roles?.includes(role));
}
