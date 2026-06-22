"use client";

import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/lib/data/hooks";
import { CategoryFormModal } from "@/components/categories/category-form-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/store/toast-store";
import type { Category } from "@/types";
import { Plus, Pencil, Trash2, FolderTree, ImageIcon } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  function openCreate() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setModalOpen(true);
  }

  async function handleSubmit(data: { name: string; image: string | null }) {
    if (editing) {
      await updateCategory.mutateAsync({ id: editing.id, input: data });
      toast.success("Category updated", `"${data.name}" has been updated.`);
    } else {
      await createCategory.mutateAsync({ ...data });
      toast.success("Category created", `"${data.name}" is now available for products.`);
    }
    setModalOpen(false);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteCategory.mutateAsync(deleteTarget.id);
    toast.success("Category deleted", `"${deleteTarget.name}" has been removed.`);
    setDeleteTarget(null);
  }

  return (
    <div className="flex flex-col gap-5 animate-fadeUp">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">Categories</h1>
          <p className="text-sm text-text-2 mt-1">Organize your catalog into browsable categories.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-[20px]" />)}

        {!isLoading && categories.length === 0 && (
          <div className="col-span-full text-center py-16">
            <FolderTree className="w-10 h-10 text-text-3 mx-auto mb-3" />
            <div className="text-sm font-semibold text-text mb-1">No categories yet</div>
            <div className="text-xs text-text-3">Add your first category to start organizing products.</div>
          </div>
        )}

        {!isLoading &&
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-bg-2 border border-border rounded-[20px] p-5 hover:border-border-2 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-bg-3 border border-border flex items-center justify-center mb-4 overflow-hidden">
                {cat.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-text-3" />
                )}
              </div>
              <div className="text-sm font-semibold text-text mb-1 line-clamp-1">{cat.name}</div>
              <div className="text-xs text-text-3 mb-4">{cat.productCount} products</div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-text-2 border border-border rounded-lg py-2 hover:border-border-2 hover:text-text transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="w-8 h-8 flex items-center justify-center text-text-3 border border-border rounded-lg hover:text-red hover:border-red/30 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
      </div>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
        submitting={createCategory.isPending || updateCategory.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        description={`"${deleteTarget?.name}" will be removed. Products assigned to it will need to be reassigned.`}
        confirmLabel="Delete Category"
        loading={deleteCategory.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
