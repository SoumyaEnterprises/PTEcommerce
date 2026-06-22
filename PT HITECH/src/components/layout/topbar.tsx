"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";
import { LogOut, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products",
  categories: "Categories",
  brands: "Brands",
  inventory: "Inventory",
  new: "New",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: labelMap[seg] ?? (seg.length > 18 ? "Detail" : seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

export function Topbar() {
  const breadcrumbs = useBreadcrumbs();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    toast.info("Signed out", "You have been logged out of the admin portal.");
    router.push("/login");
  }

  return (
    <header className="h-[72px] flex-shrink-0 border-b border-border bg-bg/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-1.5 text-sm">
        <Link href="/dashboard" className="text-text-3 hover:text-text-2 transition-colors">
          Home
        </Link>
        {breadcrumbs.map((b) => (
          <span key={b.href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-text-3" />
            {b.isLast ? (
              <span className="text-text font-semibold">{b.label}</span>
            ) : (
              <Link href={b.href} className="text-text-3 hover:text-text-2 transition-colors">
                {b.label}
              </Link>
            )}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-text-2 border border-border rounded-lg px-3 py-2 hover:border-border-2 hover:text-text transition-colors"
        >
          View storefront <ExternalLink className="w-3 h-3" />
        </a>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-glass-2 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.avatarInitials ?? "AD"}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-text leading-tight">{user?.name ?? "Admin"}</div>
              <div className="text-[11px] text-text-3 leading-tight">{user?.role ?? "admin"}</div>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-12 w-52 bg-bg-2 border border-border rounded-xl shadow-2xl py-2 z-50 animate-fadeUp">
                <div className="px-4 py-2 border-b border-border mb-1">
                  <div className="text-xs font-semibold text-text">{user?.name}</div>
                  <div className="text-[11px] text-text-3">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red hover:bg-red/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
