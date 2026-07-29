import { create } from "zustand";
import { getStoredToken, setStoredToken, clearStoredToken } from "@/lib/storage";

export interface User {
  id: string;
  email: string;
  name: string;
  initials: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  token: string | null;
  setUser: (id: string, email: string, name: string, roles: string[]) => void;
  setToken: (token: string) => void;
  setVerifying: (v: boolean) => void;
  logout: () => void;
  updateUser: (updates: Partial<Pick<User, "name" | "email">>) => void;
}

function getInitials(email: string, name?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isVerifying: true,
  token: getStoredToken(),

  setUser: (id, email, name, roles) => {
    set({
      user: { id, email, name, initials: getInitials(email, name), roles },
      isAuthenticated: true,
      isVerifying: false,
    });
  },

  setToken: (token) => {
    setStoredToken(token);
    set({ token });
  },

  setVerifying: (v) => set({ isVerifying: v }),

  logout: () => {
    clearStoredToken();
    set({ user: null, isAuthenticated: false, isVerifying: false, token: null });
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...updates };
      updated.initials = getInitials(updated.email, updated.name);
      return { user: updated };
    });
  },
}));
