"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { Loader2 } from "lucide-react";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const { ready, isAuthenticated } = useAuthGuard();

  if (!ready || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="w-6 h-6 text-blue-2 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
