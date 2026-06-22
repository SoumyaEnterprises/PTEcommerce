"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/types";

// Demo-only credential check. In a live build this would call
// supabase.auth.signInWithPassword() and store the real session/JWT
// instead of this mock token.
const DEMO_EMAIL = "admin@pthitech.co.id";
const DEMO_PASSWORD = "HiTech2026!";

const DEMO_USER: AdminUser = {
  id: "admin-1",
  name: "Budi Wirawan",
  email: DEMO_EMAIL,
  role: "superadmin",
  avatarInitials: "BW",
};

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  lastActiveAt: number;
  hasHydrated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  touchActivity: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      lastActiveAt: Date.now(),
      hasHydrated: false,

      login: async (email, password, _remember) => {
        // simulate network latency for realism
        await new Promise((r) => setTimeout(r, 600));
        if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
          return { ok: false, error: "Invalid email or password." };
        }
        set({
          user: DEMO_USER,
          token: `demo.${btoa(email)}.${Date.now()}`,
          lastActiveAt: Date.now(),
        });
        return { ok: true };
      },

      logout: () => set({ user: null, token: null }),

      touchActivity: () => set({ lastActiveAt: Date.now() }),

      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "hitech_admin_auth",
      partialize: (state) => ({ user: state.user, token: state.token, lastActiveAt: state.lastActiveAt }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };

export const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes
