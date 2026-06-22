"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, INACTIVITY_LIMIT_MS } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"] as const;

export function useAuthGuard() {
  const router = useRouter();
  const { user, token, hasHydrated, touchActivity, logout } = useAuthStore();

  // zustand's `persist` middleware rehydrates from localStorage
  // asynchronously on the client; `hasHydrated` (set via
  // `onRehydrateStorage` in the store) tells us when that's done so we
  // don't redirect to /login before the saved session has loaded.
  useEffect(() => {
    if (!hasHydrated) return;
    if (!user || !token) {
      router.replace("/login");
    }
  }, [hasHydrated, user, token, router]);

  // Inactivity auto-logout
  useEffect(() => {
    if (!user) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    function resetTimer() {
      touchActivity();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        toast.info("Session expired", "You were signed out after 15 minutes of inactivity.");
        router.replace("/login");
      }, INACTIVITY_LIMIT_MS);
    }

    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [user, touchActivity, logout, router]);

  return { ready: hasHydrated, isAuthenticated: !!user };
}
