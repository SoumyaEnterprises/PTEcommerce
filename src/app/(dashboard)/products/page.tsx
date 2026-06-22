"use client";

import { useState } from "react";
import Link from "next/link";
import { useProducts, useBrands, useCategories, useDeleteProduct, useBulkAction } from "@/lib/data/hooks";
import { ProductsToolbar } from "@/components/products/products-toolbar";
import { ProductsTable } from "@/components/products/products-table";
import { BulkActionsBar } from "@/components/products/bulk-actions-bar";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/toast-store";
import type { Product, ProductFilters } from "@/types";
import { Plus, Download } from "lucide-react";

const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  brandId: "all",
  categoryId: "all",
  status: "all",
  stock: "all",
  featured: "all",
  sort: "newest",
  page: 1,
  pageSize: 8,
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const { data, isLoading } = useProducts(filters);
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();
  const bulk = useBulkAction();

  function updateFilters(next: Partial<ProductFilters>) {
    setFilters((prev) => ({ ...prev, ...next }));
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    if (!data) return;
    const allSelected = data.items.every((p) => selectedIds.includes(p.id));
    setSelectedIds(allSelected ? selectedIds.filter((id) => !data.items.some((p) => p.id === id)) : [...new Set([...selectedIds, ...data.items.map((p) => p.id)])]);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteProduct.mutateAsync(deleteTarget.id);
    toast.success("Product deleted", `"${deleteTarget.name}" has been removed from the catalog.`);
    setDeleteTarget(null);
  }

  async function handleBulkDelete() {
    await bulk.deleteMany.mutateAsync(selectedIds);
    toast.success("Products deleted", `${selectedIds.length} product(s) removed.`);
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  }

  async function handleBulkPublish() {
    await bulk.setStatus.mutateAsync({ ids: selectedIds, status: "active" });
    toast.success("Products published", `${selectedIds.length} product(s) are now live on the storefront.`);
    setSelectedIds([]);
  }

  async function handleBulkHide() {
    await bulk.setStatus.mutateAsync({ ids: selectedIds, status: "hidden" });
    toast.success("Products hidden", `${selectedIds.length} product(s) removed from the storefront.`);
    setSelectedIds([]);
  }

  return (
    <div className="flex flex-col gap-5 animate-fadeUp">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">Products</h1>
          <p className="text-sm text-text-2 mt-1">Manage every product shown on the storefront.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" onClick={() => toast.info("Export started", "Your CSV will download shortly. (Demo only)")}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Link href="/products/new">
            <Button size="md">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <ProductsToolbar filters={filters} onChange={updateFilters} brands={brands} categories={categories} resultCount={data?.total ?? 0} />

      <BulkActionsBar
        count={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onPublish={handleBulkPublish}
        onHide={handleBulkHide}
        onDelete={() => setBulkDeleteOpen(true)}
        loading={bulk.setStatus.isPending || bulk.deleteMany.isPending}
      />

      <ProductsTable
        products={data?.items ?? []}
        loading={isLoading}
        brands={brands}
        categories={categories}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onDeleteRequest={setDeleteTarget}
      />

      {data && <Pagination page={filters.page} pageSize={filters.pageSize} total={data.total} onPageChange={(page) => updateFilters({ page })} />}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this product?"
        description={`"${deleteTarget?.name}" will be permanently removed from the catalog and storefront. This action cannot be undone.`}
        confirmLabel="Delete Product"
        loading={deleteProduct.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        title={`Delete ${selectedIds.length} products?`}
        description="These products will be permanently removed from the catalog and storefront. This action cannot be undone."
        confirmLabel="Delete Products"
        loading={bulk.deleteMany.isPending}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </div>
  );
}
