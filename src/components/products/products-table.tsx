"use client";

import type { Brand, Category, Product } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, StockBadge } from "./badges";
import { formatIDR, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/card";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, Star, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ProductsTable({
  products,
  loading,
  brands,
  categories,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteRequest,
}: {
  products: Product[];
  loading: boolean;
  brands: Brand[];
  categories: Category[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDeleteRequest: (product: Product) => void;
}) {
  const brandName = (id: string) => brands.find((b) => b.id === id)?.name ?? "—";
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";
  const allSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  return (
    <div className="bg-bg-2 border border-border rounded-[20px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3.5 w-10">
                <Checkbox checked={allSelected} onChange={onToggleSelectAll} />
              </th>
              <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Product</th>
              <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">SKU</th>
              <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Brand</th>
              <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Category</th>
              <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Price</th>
              <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Stock</th>
              <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide">Updated</th>
              <th className="px-4 py-3.5 font-semibold text-text-3 text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} columns={10} />)}

            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center">
                  <Package className="w-10 h-10 text-text-3 mx-auto mb-3" />
                  <div className="text-sm font-semibold text-text mb-1">No products found</div>
                  <div className="text-xs text-text-3">Try adjusting your search or filters.</div>
                </td>
              </tr>
            )}

            {!loading &&
              products.map((p) => {
                const thumbnail = p.images.find((i) => i.isThumbnail) ?? p.images[0];
                const selected = selectedIds.includes(p.id);
                return (
                  <tr key={p.id} className={`border-b border-border hover:bg-glass transition-colors ${selected ? "bg-blue/5" : ""}`}>
                    <td className="px-4 py-3.5">
                      <Checkbox checked={selected} onChange={() => onToggleSelect(p.id)} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <div className="w-11 h-11 rounded-lg bg-bg-3 border border-border flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                          {thumbnail ? (
                            <Image src={thumbnail.url} alt={p.name} fill className="object-contain p-1.5" unoptimized />
                          ) : (
                            <Package className="w-5 h-5 text-text-3" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${p.id}`}
                            className="text-sm font-semibold text-text hover:text-blue-2 transition-colors line-clamp-1"
                          >
                            {p.name}
                          </Link>
                          <div className="flex items-center gap-1.5 mt-1">
                            {p.featured && (
                              <Badge tone="gold" className="px-1.5 py-0.5">
                                <Star className="w-2.5 h-2.5" /> Featured
                              </Badge>
                            )}
                            {p.bestseller && <Badge tone="blue" className="px-1.5 py-0.5">Best Seller</Badge>}
                            {p.newArrival && <Badge tone="green" className="px-1.5 py-0.5">New</Badge>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-text-2 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3.5 text-text-2">{brandName(p.brandId)}</td>
                    <td className="px-4 py-3.5 text-text-2">{categoryName(p.categoryId)}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-text font-semibold">{formatIDR(p.discountPrice ?? p.price)}</div>
                      {p.discountPrice && <div className="text-text-3 text-xs line-through">{formatIDR(p.price)}</div>}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-text font-medium mb-1">{p.stock}</div>
                      <StockBadge stock={p.stock} lowStockThreshold={p.lowStockThreshold} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3.5 text-text-3 text-xs">{formatDate(p.updatedAt)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/products/${p.id}`}
                          className="w-8 h-8 rounded-lg bg-glass-2 border border-border flex items-center justify-center text-text-2 hover:text-blue-2 hover:border-blue/30 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => onDeleteRequest(p)}
                          className="w-8 h-8 rounded-lg bg-glass-2 border border-border flex items-center justify-center text-text-2 hover:text-red hover:border-red/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
