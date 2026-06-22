"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Brand, Category, ProductFilters } from "@/types";

export function ProductsToolbar({
  filters,
  onChange,
  brands,
  categories,
  resultCount,
}: {
  filters: ProductFilters;
  onChange: (next: Partial<ProductFilters>) => void;
  brands: Brand[];
  categories: Category[];
  resultCount: number;
}) {
  const hasActiveFilters =
    filters.brandId !== "all" || filters.categoryId !== "all" || filters.status !== "all" || filters.stock !== "all" || filters.featured !== "all";

  return (
    <div className="bg-bg-2 border border-border rounded-[20px] p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-glass-2 border border-border rounded-xl px-3.5 py-2.5 flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-text-3 flex-shrink-0" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            placeholder="Search by name, SKU, or tag..."
            className="bg-transparent outline-none text-sm text-text placeholder:text-text-3 w-full"
          />
          {filters.search && (
            <button onClick={() => onChange({ search: "", page: 1 })}>
              <X className="w-3.5 h-3.5 text-text-3 hover:text-text" />
            </button>
          )}
        </div>

        <select
          value={filters.brandId}
          onChange={(e) => onChange({ brandId: e.target.value, page: 1 })}
          className="bg-glass-2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-text outline-none cursor-pointer"
        >
          <option value="all">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={filters.categoryId}
          onChange={(e) => onChange({ categoryId: e.target.value, page: 1 })}
          className="bg-glass-2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-text outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as ProductFilters["sort"] })}
          className="bg-glass-2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-text outline-none cursor-pointer ml-auto"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name_asc">Name: A-Z</option>
          <option value="name_desc">Name: Z-A</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="stock_asc">Stock: Low to High</option>
          <option value="stock_desc">Stock: High to Low</option>
        </select>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-text-3">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters:
        </div>

        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value as ProductFilters["status"], page: 1 })}
          className="bg-glass border border-border rounded-lg px-3 py-1.5 text-xs text-text-2 outline-none cursor-pointer"
        >
          <option value="all">Any Status</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={filters.stock}
          onChange={(e) => onChange({ stock: e.target.value as ProductFilters["stock"], page: 1 })}
          className="bg-glass border border-border rounded-lg px-3 py-1.5 text-xs text-text-2 outline-none cursor-pointer"
        >
          <option value="all">Any Stock Level</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>

        <select
          value={filters.featured === "all" ? "all" : String(filters.featured)}
          onChange={(e) =>
            onChange({ featured: e.target.value === "all" ? "all" : e.target.value === "true", page: 1 })
          }
          className="bg-glass border border-border rounded-lg px-3 py-1.5 text-xs text-text-2 outline-none cursor-pointer"
        >
          <option value="all">Featured: Any</option>
          <option value="true">Featured Only</option>
          <option value="false">Not Featured</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => onChange({ brandId: "all", categoryId: "all", status: "all", stock: "all", featured: "all", page: 1 })}
            className="text-xs font-semibold text-blue-2 hover:text-blue-3 transition-colors"
          >
            Clear filters
          </button>
        )}

        <span className="text-xs text-text-3 ml-auto">{resultCount} result{resultCount !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
