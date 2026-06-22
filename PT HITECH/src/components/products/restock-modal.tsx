"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

function RestockFields({
  product,
  onClose,
  onSubmit,
  submitting,
}: {
  product: Product;
  onClose: () => void;
  onSubmit: (productId: string, addQuantity: number) => void;
  submitting: boolean;
}) {
  const [qty, setQty] = useState(10);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-glass border border-border rounded-xl p-4 flex items-center justify-between text-sm">
        <span className="text-text-2">Current stock</span>
        <span className="font-bold text-text">{product.stock} units</span>
      </div>
      <Input label="Quantity to add" type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
      <div className="bg-blue/10 border border-blue/30 rounded-xl p-4 flex items-center justify-between text-sm">
        <span className="text-text-2">New stock level</span>
        <span className="font-bold text-blue-2">{product.stock + qty} units</span>
      </div>
      <div className="flex gap-3 justify-end mt-1">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" loading={submitting} onClick={() => onSubmit(product.id, qty)} disabled={qty <= 0}>
          Confirm Restock
        </Button>
      </div>
    </div>
  );
}

export function RestockModal({
  product,
  onClose,
  onSubmit,
  submitting,
}: {
  product: Product | null;
  onClose: () => void;
  onSubmit: (productId: string, addQuantity: number) => void;
  submitting: boolean;
}) {
  if (!product) return null;

  return (
    <Modal open={!!product} onClose={onClose} title={`Restock "${product.name}"`} maxWidth="max-w-sm">
      {/* Keyed by product id so quantity resets to the default each
          time a different product is targeted, without an effect. */}
      <RestockFields key={product.id} product={product} onClose={onClose} onSubmit={onSubmit} submitting={submitting} />
    </Modal>
  );
}
