import { Badge } from "@/components/ui/card";
import type { Product, StockStatus } from "@/types";

export function StatusBadge({ status }: { status: Product["status"] }) {
  if (status === "active") return <Badge tone="green">Active</Badge>;
  if (status === "hidden") return <Badge tone="neutral">Hidden</Badge>;
  return <Badge tone="gold">Draft</Badge>;
}

export function StockBadge({ stock, lowStockThreshold }: { stock: number; lowStockThreshold: number }) {
  let status: StockStatus = "in_stock";
  if (stock <= 0) status = "out_of_stock";
  else if (stock <= lowStockThreshold) status = "low_stock";

  if (status === "out_of_stock") return <Badge tone="red">Out of Stock</Badge>;
  if (status === "low_stock") return <Badge tone="gold">Low Stock</Badge>;
  return <Badge tone="green">In Stock</Badge>;
}
