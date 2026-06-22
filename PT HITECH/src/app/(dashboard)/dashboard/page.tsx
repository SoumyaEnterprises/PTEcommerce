"use client";

import { useDashboardStats, useRecentActivity } from "@/lib/data/hooks";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatCardSkeleton } from "@/components/ui/skeleton";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { RevenueTrendChart, StockDistributionChart } from "@/components/dashboard/charts";
import { formatIDR } from "@/lib/format";
import {
  Package,
  PackageCheck,
  PackageX,
  FolderTree,
  ShoppingCart,
  Users,
  Wallet,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: activity } = useRecentActivity();
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col gap-6 animate-fadeUp">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            Welcome back, {user?.name?.split(" ")[0] ?? "Admin"} 👋
          </h1>
          <p className="text-sm text-text-2 mt-1">Here&apos;s what&apos;s happening with your storefront today.</p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 bg-blue text-white text-sm font-semibold rounded-xl px-5 py-2.5 hover:bg-[#2563eb] transition-colors shadow-[0_0_24px_rgba(59,130,246,0.3)]"
        >
          + Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading || !stats ? (
          Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Products" value={stats.totalProducts.toString()} icon={Package} tone="blue" />
            <StatCard label="In Stock" value={stats.inStock.toString()} icon={PackageCheck} tone="green" />
            <StatCard label="Out of Stock" value={stats.outOfStock.toString()} icon={PackageX} tone="red" />
            <StatCard label="Categories" value={stats.totalCategories.toString()} icon={FolderTree} tone="gold" />
            <StatCard
              label="Orders"
              value={stats.totalOrders.toLocaleString("id-ID")}
              icon={ShoppingCart}
              tone="blue"
              trend={{ value: "Future module", positive: true }}
            />
            <StatCard
              label="Total Customers"
              value={stats.totalCustomers.toLocaleString("id-ID")}
              icon={Users}
              tone="blue"
              trend={{ value: "Future module", positive: true }}
            />
            <StatCard label="Revenue (est.)" value={formatIDR(stats.revenue)} icon={Wallet} tone="green" />
            <StatCard label="Brands" value={stats.totalBrands.toString()} icon={Tag} tone="gold" />
          </>
        )}
      </div>

      {/* Charts + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-2 border border-border rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-text">Revenue Trend</h2>
              <p className="text-xs text-text-3">Placeholder data — connects to real orders in a future module</p>
            </div>
          </div>
          <RevenueTrendChart />
        </div>

        <div className="bg-bg-2 border border-border rounded-[20px] p-6">
          <h2 className="font-display text-base font-bold text-text mb-4">Stock Health</h2>
          {stats && (
            <StockDistributionChart inStock={stats.inStock} lowStock={stats.lowStock} outOfStock={stats.outOfStock} />
          )}
        </div>
      </div>

      <div className="bg-bg-2 border border-border rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-base font-bold text-text">Recent Activity</h2>
        </div>
        <ActivityFeed entries={activity ?? []} />
      </div>
    </div>
  );
}
