"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    router.replace(user && token ? "/dashboard" : "/login");
  }, [user, token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Loader2 className="w-6 h-6 text-blue-2 animate-spin" />
    </div>
  );
}
