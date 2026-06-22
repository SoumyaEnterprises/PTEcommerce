"use client";

import { useMemo, useState } from "react";
import { useProducts, useBrands, useCategories, useUpdateProduct } from "@/lib/data/hooks";
import { RestockModal } from "@/components/products/restock-modal";
import { StockBadge } from "@/components/products/badges";
import { formatDate } from "@/lib/format";
import { toast } from "@/store/toast-store";
import type { Product, ProductFilters } from "@/types";
import { AlertTriangle, PackageX, Boxes, Search, RefreshCw } from "lucide-react";
import Image from "next/image";

const BASE_FILTERS: ProductFilters = {
  search: "",
  brandId: "all",
  categoryId: "all",
  status: "all",
  stock: "all",
  featured: "all",
  sort: "stock_asc",
  page: 1,
  pageSize: 100,
};

type TabKey = "all" | "low_stock" | "out_of_stock";

export default function InventoryPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [restockTarget, setRestockTarget] = useState<Product | null>(null);

  const filters: ProductFilters = { ...BASE_FILTERS, search, stock: tab === "all" ? "all" : tab };
  const { data, isLoading } = useProducts(filters);
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const updateProduct = useUpdateProduct();

  const items = data?.items ?? [];

  const counts = useMemo(() => {
    const lowStock = items.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
    const outOfStock = items.filter((p) => p.stock <= 0).length;
    return { lowStock, outOfStock, total: items.length };
  }, [items]);

  async function handleRestock(productId: string, addQty: number) {
    const product = items.find((p) => p.id === productId);
    if (!product) return;
    await updateProduct.mutateAsync({ id: productId, input: { stock: product.stock + addQty } });
    toast.success("Stock updated", `${product.name} restocked by +${addQty} units.`);
    setRestockTarget(null);
  }

  const brandName = (id: string) => brands.find((b) => b.id === id)?.name ?? "—";
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="flex flex-col gap-5 animate-fadeUp">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">Inventory</h1>
        <p className="text-sm text-text-2 mt-1">Monitor stock levels and restock products before they run out.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setTab("all")}
          className={`text-left bg-bg-2 border rounded-[20px] p-5 transition-colors ${tab === "all" ? "border-blue/40" : "border-border hover:border-border-2"}`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue/15 flex items-center justify-center mb-3">
            <Boxes className="w-5 h-5 text-blue-2" />
          </div>
          <div className="font-display text-2xl font-bold text-text">{tab === "all" ? counts.total : "—"}</div>
          <div className="text-xs text-text-3 mt-1">All Products</div>
        </button>

        <button
          onClick={() => setTab("low_stock")}
          className={`text-left bg-bg-2 border rounded-[20px] p-5 transition-colors ${tab === "low_stock" ? "border-gold/40" : "border-border hover:border-border-2"}`}
        >
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-gold" />
          </div>
          <div className="font-display text-2xl font-bold text-text">{tab === "low_stock" ? counts.total : "—"}</div>
          <div className="text-xs text-text-3 mt-1">Low Stock Warning</div>
        </button>

        <button
          onClick={() => setTab("out_of_stock")}
          className={`text-left bg-bg-2 border rounded-[20px] p-5 transition-colors ${tab === "out_of_stock" ? "border-red/40" : "border-border hover:border-border-2"}`}
        >
          <div className="w-10 h-10 rounded-xl bg-red/15 flex items-center justify-center mb-3">
            <PackageX className="w-5 h-5 text-red" />
          </div>
          <div className="font-display text-2xl font-bold text-text">{tab === "out_of_stock" ? counts.total : "—"}</div>
          <div className="text-xs text-text-3 mt-1">Out of Stock Alert</div>
        </button>
      </div>

      <div className="flex items-center gap-2 bg-glass-2 border border-border rounded-xl px-3.5 py-2.5 max-w-md">
        <Search className="w-4 h-4 text-text-3 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="bg-transparent outline-none text-sm text-text placeholder:text-text-3 w-full"
        />
      </div>

      <div className="bg-bg-2 border border-border rounded-[20px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Product</th>
                <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Brand</th>
                <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Category</th>
                <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Current Stock</th>
                <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Status</th>
                <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Last Updated</th>
                <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-sm text-text-3">
                    No products match this view.
                  </td>
                </tr>
              )}
              {items.map((p) => {
                const thumbnail = p.images.find((i) => i.isThumbnail) ?? p.images[0];
                return (
                  <tr key={p.id} className="border-b border-border hover:bg-glass transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-10 h-10 rounded-lg bg-bg-3 border border-border flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                          {thumbnail && <Image src={thumbnail.url} alt={p.name} fill className="object-contain p-1" unoptimized />}
                        </div>
                        <span className="text-text font-medium line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-text-2">{brandName(p.brandId)}</td>
                    <td className="px-4 py-3.5 text-text-2">{categoryName(p.categoryId)}</td>
                    <td className="px-4 py-3.5 text-text font-semibold">{p.stock} units</td>
                    <td className="px-4 py-3.5">
                      <StockBadge stock={p.stock} lowStockThreshold={p.lowStockThreshold} />
                    </td>
                    <td className="px-4 py-3.5 text-text-3 text-xs">{formatDate(p.updatedAt)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setRestockTarget(p)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-2 border border-blue/30 rounded-lg px-3 py-1.5 hover:bg-blue/10 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" /> Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <RestockModal
        product={restockTarget}
        onClose={() => setRestockTarget(null)}
        onSubmit={handleRestock}
        submitting={updateProduct.isPending}
      />
    </div>
  );
}
