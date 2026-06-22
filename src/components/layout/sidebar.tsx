"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Boxes,
  ShoppingCart,
  Users,
  Ticket,
  Star,
  BarChart3,
  Truck,
  CreditCard,
  Building2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/cn";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/brands", label: "Brands", icon: Tag },
  { href: "/inventory", label: "Inventory", icon: Boxes },
];

const futureNav = [
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Coupons", icon: Ticket },
  { label: "Reviews", icon: Star },
  { label: "Analytics", icon: BarChart3 },
  { label: "Shipping", icon: Truck },
  { label: "Payments", icon: CreditCard },
  { label: "Vendors", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] flex-shrink-0 bg-bg-2 border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="h-[72px] flex items-center gap-3 px-6 border-b border-border flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue to-indigo-600 flex items-center justify-center text-white font-black text-lg">
          H
        </div>
        <div>
          <div className="text-sm font-bold text-text leading-tight">PT. HI-TECH</div>
          <div className="text-[11px] text-text-3 leading-tight">Admin Portal</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-3 mb-2">Manage</div>
        <div className="flex flex-col gap-1 mb-6">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active ? "bg-blue/15 text-blue-2 border border-blue/30" : "text-text-2 border border-transparent hover:bg-glass-2 hover:text-text"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="text-[11px] font-bold uppercase tracking-wider text-text-3 px-3 mb-2">Coming Soon</div>
        <div className="flex flex-col gap-1">
          {futureNav.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-3 cursor-not-allowed"
                title="Reserved for a future module"
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                <Lock className="w-3 h-3" />
              </div>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-glass border border-border rounded-xl px-3 py-2.5 text-[11px] text-text-3 leading-relaxed">
          Running on mock data for this demo.
        </div>
      </div>
    </aside>
  );
}
