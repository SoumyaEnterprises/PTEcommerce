"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, type ProductFormInput, defaultProductFormValues } from "@/lib/product-schema";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploader } from "./image-uploader";
import { SpecificationsEditor } from "./specifications-editor";
import { TagsInput } from "./tags-input";
import { useBrands, useCategories } from "@/lib/data/hooks";
import type { Product, ProductImage } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  mode: "create" | "edit";
  initialProduct?: Product;
  onSubmit: (data: {
    values: ProductFormInput;
    images: ProductImage[];
    specifications: { key: string; value: string }[];
    tags: string[];
  }) => Promise<void>;
  submitting: boolean;
}

export function ProductForm({ mode, initialProduct, onSubmit, submitting }: ProductFormProps) {
  const router = useRouter();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const [images, setImages] = useState<ProductImage[]>(initialProduct?.images ?? []);
  const [specs, setSpecs] = useState(initialProduct?.specifications ?? [{ key: "", value: "" }]);
  const [tags, setTags] = useState<string[]>(initialProduct?.tags ?? []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialProduct
      ? {
          name: initialProduct.name,
          sku: initialProduct.sku,
          brandId: initialProduct.brandId,
          categoryId: initialProduct.categoryId,
          description: initialProduct.description,
          price: initialProduct.price,
          discountPrice: initialProduct.discountPrice ?? "",
          currency: initialProduct.currency,
          stock: initialProduct.stock,
          lowStockThreshold: initialProduct.lowStockThreshold,
          warranty: initialProduct.warranty,
          featured: initialProduct.featured,
          bestseller: initialProduct.bestseller,
          newArrival: initialProduct.newArrival,
          status: initialProduct.status,
        }
      : defaultProductFormValues,
  });

  const featured = watch("featured");
  const bestseller = watch("bestseller");
  const newArrival = watch("newArrival");
  const status = watch("status");

  async function submit(values: ProductFormInput) {
    const cleanSpecs = specs.filter((s) => s.key.trim() && s.value.trim());
    await onSubmit({ values, images, specifications: cleanSpecs, tags });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6 animate-fadeUp">
      <div className="flex items-center gap-3">
        <Link href="/products" className="w-9 h-9 rounded-lg bg-glass-2 border border-border flex items-center justify-center text-text-2 hover:text-text transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text">
            {mode === "create" ? "Add New Product" : `Edit "${initialProduct?.name}"`}
          </h1>
          <p className="text-sm text-text-2 mt-0.5">
            {mode === "create" ? "Fill in the details below to list a new product." : "Changes will reflect instantly on the storefront."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-bg-2 border border-border rounded-[20px] p-6">
            <h2 className="font-display text-base font-bold text-text mb-5">Basic Information</h2>
            <div className="flex flex-col gap-4">
              <Input label="Product Name" required placeholder="e.g. Samsung 990 Pro NVMe SSD 2TB" error={errors.name?.message} {...register("name")} />

              <div className="grid grid-cols-2 gap-4">
                <Input label="SKU" required placeholder="e.g. SSD-SAM-990P-2TB" error={errors.sku?.message} {...register("sku")} />
                <Select label="Warranty" required error={errors.warranty?.message} {...register("warranty")}>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="Lifetime">Lifetime</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select label="Brand" required error={errors.brandId?.message} {...register("brandId")}>
                  <option value="">Select brand...</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Select>
                <Select label="Category" required error={errors.categoryId?.message} {...register("categoryId")}>
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>

              <Textarea
                label="Description"
                required
                rows={5}
                placeholder="Describe the product, its key features, and use cases..."
                error={errors.description?.message}
                {...register("description")}
              />
            </div>
          </section>

          <section className="bg-bg-2 border border-border rounded-[20px] p-6">
            <h2 className="font-display text-base font-bold text-text mb-1">Product Images</h2>
            <p className="text-xs text-text-3 mb-5">Drag and drop, or click to upload. The first image becomes the thumbnail by default.</p>
            <ImageUploader images={images} onChange={setImages} />
          </section>

          <section className="bg-bg-2 border border-border rounded-[20px] p-6">
            <h2 className="font-display text-base font-bold text-text mb-1">Specifications</h2>
            <p className="text-xs text-text-3 mb-5">Add technical details shown on the product page (e.g. Interface, Capacity, Speed).</p>
            <SpecificationsEditor specs={specs} onChange={setSpecs} />
          </section>

          <section className="bg-bg-2 border border-border rounded-[20px] p-6">
            <h2 className="font-display text-base font-bold text-text mb-1">Tags</h2>
            <p className="text-xs text-text-3 mb-4">Used for search and storefront filtering.</p>
            <TagsInput tags={tags} onChange={setTags} />
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="bg-bg-2 border border-border rounded-[20px] p-6">
            <h2 className="font-display text-base font-bold text-text mb-5">Pricing</h2>
            <div className="flex flex-col gap-4">
              <Select label="Currency" {...register("currency")}>
                <option value="IDR">IDR — Indonesian Rupiah</option>
                <option value="USD">USD — US Dollar</option>
                <option value="SGD">SGD — Singapore Dollar</option>
                <option value="EUR">EUR — Euro</option>
              </Select>
              <Input label="Price" required type="number" step="1" placeholder="2900000" error={errors.price?.message} {...register("price")} />
              <Input
                label="Discount Price"
                type="number"
                step="1"
                placeholder="2450000"
                hint="Leave blank if not on sale"
                error={errors.discountPrice?.message as string | undefined}
                {...register("discountPrice")}
              />
            </div>
          </section>

          <section className="bg-bg-2 border border-border rounded-[20px] p-6">
            <h2 className="font-display text-base font-bold text-text mb-5">Inventory</h2>
            <div className="flex flex-col gap-4">
              <Input label="Stock Quantity" required type="number" error={errors.stock?.message} {...register("stock")} />
              <Input
                label="Low Stock Threshold"
                type="number"
                hint="Trigger a low-stock warning below this number"
                error={errors.lowStockThreshold?.message}
                {...register("lowStockThreshold")}
              />
            </div>
          </section>

          <section className="bg-bg-2 border border-border rounded-[20px] p-6">
            <h2 className="font-display text-base font-bold text-text mb-5">Visibility &amp; Flags</h2>
            <div className="flex flex-col gap-3.5">
              <Select label="Status" {...register("status")}>
                <option value="active">Active — visible on storefront</option>
                <option value="hidden">Hidden — kept in database, removed from storefront</option>
                <option value="draft">Draft — not yet published</option>
              </Select>
              <div className="h-px bg-border my-1" />
              <Checkbox checked={featured} onChange={(v) => setValue("featured", v)} label="Featured product" />
              <Checkbox checked={bestseller} onChange={(v) => setValue("bestseller", v)} label="Best seller" />
              <Checkbox checked={newArrival} onChange={(v) => setValue("newArrival", v)} label="New arrival" />
            </div>
          </section>

          <div className="flex flex-col gap-2.5 sticky top-24">
            <Button type="submit" size="lg" loading={submitting} className="w-full justify-center">
              <Save className="w-4 h-4" />
              {mode === "create" ? "Publish Product" : "Save Changes"}
            </Button>
            <Button type="button" variant="ghost" size="md" className="w-full justify-center" onClick={() => router.push("/products")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
