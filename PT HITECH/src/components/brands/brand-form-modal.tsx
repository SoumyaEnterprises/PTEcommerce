"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Brand } from "@/types";
import { Tag, UploadCloud } from "lucide-react";

function BrandFormFields({
  initial,
  onSubmit,
  onClose,
  submitting,
}: {
  initial?: Brand;
  onSubmit: (data: { name: string; logo: string | null }) => void;
  onClose: () => void;
  submitting: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [logo, setLogo] = useState<string | null>(initial?.logo ?? null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setLogo(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), logo });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="w-20 h-20 rounded-full bg-bg-3 border border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 hover:border-border-2 transition-colors">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="w-full h-full object-cover" />
          ) : (
            <Tag className="w-6 h-6 text-text-3" />
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
        <div className="flex-1">
          <div className="text-xs font-semibold text-text-2 mb-1">Brand Logo</div>
          <div className="text-xs text-text-3 flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5" /> Click the circle to upload
          </div>
        </div>
      </div>

      <Input label="Brand Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Corsair" />

      <div className="flex gap-3 justify-end mt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="sm" loading={submitting}>
          {initial ? "Save Changes" : "Create Brand"}
        </Button>
      </div>
    </form>
  );
}

export function BrandFormModal({
  open,
  onClose,
  onSubmit,
  initial,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; logo: string | null }) => void;
  initial?: Brand;
  submitting: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Brand" : "Add Brand"}>
      {/* Keying by id (or "new") forces a fresh mount per target, so
          field state initializes from `initial` without an effect. */}
      <BrandFormFields key={initial?.id ?? "new"} initial={initial} onSubmit={onSubmit} onClose={onClose} submitting={submitting} />
    </Modal>
  );
}
