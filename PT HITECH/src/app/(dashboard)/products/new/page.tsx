"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/products/product-form";
import { useCreateProduct } from "@/lib/data/hooks";
import { toast } from "@/store/toast-store";
import type { Product } from "@/types";
import type { ProductFormInput } from "@/lib/product-schema";

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  async function handleSubmit({
    values,
    images,
    specifications,
    tags,
  }: {
    values: ProductFormInput;
    images: Product["images"];
    specifications: Product["specifications"];
    tags: string[];
  }) {
    if (images.length === 0) {
      toast.error("Add at least one image", "Products need at least one image before they can be published.");
      return;
    }

    const payload: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name: values.name,
      slug: "", // computed by the data adapter
      sku: values.sku,
      brandId: values.brandId,
      categoryId: values.categoryId,
      description: values.description,
      specifications,
      price: Number(values.price),
      discountPrice: values.discountPrice === "" ? null : Number(values.discountPrice),
      currency: values.currency,
      stock: Number(values.stock),
      lowStockThreshold: Number(values.lowStockThreshold),
      images,
      featured: values.featured,
      bestseller: values.bestseller,
      newArrival: values.newArrival,
      warranty: values.warranty,
      tags,
      status: values.status,
    };

    const created = await createProduct.mutateAsync(payload);
    toast.success("Product created", `"${created.name}" is now live on the storefront.`);
    router.push("/products");
  }

  return <ProductForm mode="create" onSubmit={handleSubmit} submitting={createProduct.isPending} />;
}
