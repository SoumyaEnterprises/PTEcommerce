"use client";

import { useRouter, useParams } from "next/navigation";
import { useProduct, useUpdateProduct } from "@/lib/data/hooks";
import { ProductForm } from "@/components/products/product-form";
import { toast } from "@/store/toast-store";
import type { Product } from "@/types";
import type { ProductFormInput } from "@/lib/product-schema";
import { Loader2, PackageX } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(params.id);
  const updateProduct = useUpdateProduct();

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
      toast.error("Add at least one image", "Products need at least one image to remain visible on the storefront.");
      return;
    }

    const payload: Partial<Product> = {
      name: values.name,
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

    await updateProduct.mutateAsync({ id: params.id, input: payload });
    toast.success("Changes saved", `"${values.name}" has been updated on the storefront.`);
    router.push("/products");
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-6 h-6 text-blue-2 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <PackageX className="w-10 h-10 text-text-3" />
        <div className="text-sm font-semibold text-text">Product not found</div>
        <Link href="/products" className="text-sm text-blue-2 hover:text-blue-3">
          ← Back to products
        </Link>
      </div>
    );
  }

  return <ProductForm mode="edit" initialProduct={product} onSubmit={handleSubmit} submitting={updateProduct.isPending} />;
}
