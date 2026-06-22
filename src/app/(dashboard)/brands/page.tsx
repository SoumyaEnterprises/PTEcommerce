"use client";

import { useState } from "react";
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from "@/lib/data/hooks";
import { BrandFormModal } from "@/components/brands/brand-form-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/store/toast-store";
import type { Brand } from "@/types";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";

export default function BrandsPage() {
  const { data: brands = [], isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  function openCreate() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEdit(brand: Brand) {
    setEditing(brand);
    setModalOpen(true);
  }

  async function handleSubmit(data: { name: string; logo: string | null }) {
    if (editing) {
      await updateBrand.mutateAsync({ id: editing.id, input: data });
      toast.success("Brand updated", `"${data.name}" has been updated.`);
    } else {
      await createBrand.mutateAsync({ ...data });
      toast.success("Brand created", `"${data.name}" is now available for products.`);
    }
    setModalOpen(false);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteBrand.mutateAsync(deleteTarget.id);
    toast.success("Brand deleted", `"${deleteTarget.name}" has been removed.`);
    setDeleteTarget(null);
  }

  return (
    <div className="flex flex-col gap-5 animate-fadeUp">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">Brands</h1>
          <p className="text-sm text-text-2 mt-1">Manage the authorized brands shown on the storefront.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Brand
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading && Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-[20px]" />)}

        {!isLoading && brands.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Tag className="w-10 h-10 text-text-3 mx-auto mb-3" />
            <div className="text-sm font-semibold text-text mb-1">No brands yet</div>
            <div className="text-xs text-text-3">Add your first brand to start tagging products.</div>
          </div>
        )}

        {!isLoading &&
          brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-bg-2 border border-border rounded-[20px] p-5 flex flex-col items-center text-center hover:border-border-2 transition-colors group"
            >
              <div className="w-14 h-14 rounded-full bg-bg-3 border border-border flex items-center justify-center mb-3 overflow-hidden">
                {brand.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                ) : (
                  <Tag className="w-5 h-5 text-text-3" />
                )}
              </div>
              <div className="text-sm font-semibold text-text mb-1 line-clamp-1">{brand.name}</div>
              <div className="text-xs text-text-3 mb-4">{brand.productCount} products</div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity w-full">
                <button
                  onClick={() => openEdit(brand)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-text-2 border border-border rounded-lg py-2 hover:border-border-2 hover:text-text transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(brand)}
                  className="w-8 h-8 flex items-center justify-center text-text-3 border border-border rounded-lg hover:text-red hover:border-red/30 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
      </div>

      <BrandFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
        submitting={createBrand.isPending || updateBrand.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this brand?"
        description={`"${deleteTarget?.name}" will be removed. Products assigned to it will need to be reassigned.`}
        confirmLabel="Delete Brand"
        loading={deleteBrand.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
