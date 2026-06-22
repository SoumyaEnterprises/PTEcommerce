"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";
import { ImageIcon, UploadCloud } from "lucide-react";

function CategoryFormFields({
  initial,
  onSubmit,
  onClose,
  submitting,
}: {
  initial?: Category;
  onSubmit: (data: { name: string; image: string | null }) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [image, setImage] = useState<string | null>(initial?.image ?? null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), image });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="w-20 h-20 rounded-xl bg-bg-3 border border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 hover:border-border-2 transition-colors">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-text-3" />
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        <div className="flex-1">
          <div className="text-xs font-semibold text-text-2 mb-1">Category Image</div>
          <div className="text-xs text-text-3 flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5" /> Click the box to upload
          </div>
        </div>
      </div>

      <Input label="Category Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Graphics Cards" />

      <div className="flex gap-3 justify-end mt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="sm" loading={submitting}>
          {initial ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}

export function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  initial,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; image: string | null }) => void;
  initial?: Category;
  submitting: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Category" : "Add Category"}>
      {/* Keying by id (or "new") forces a fresh mount per target, so
          field state initializes from `initial` without needing an
          effect to resync it after the modal is already open. */}
      <CategoryFormFields key={initial?.id ?? "new"} initial={initial} onSubmit={onSubmit} onClose={onClose} submitting={submitting} />
    </Modal>
  );
}
