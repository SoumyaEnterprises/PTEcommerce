import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  sku: z.string().min(2, "SKU is required."),
  brandId: z.string().min(1, "Select a brand."),
  categoryId: z.string().min(1, "Select a category."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be greater than 0."),
  discountPrice: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
  currency: z.enum(["IDR", "USD", "SGD", "EUR"]),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  lowStockThreshold: z.coerce.number().int().min(0),
  warranty: z.string().min(1, "Warranty information is required."),
  featured: z.boolean(),
  bestseller: z.boolean(),
  newArrival: z.boolean(),
  status: z.enum(["active", "hidden", "draft"]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormInput = z.input<typeof productFormSchema>;

export const defaultProductFormValues: ProductFormInput = {
  name: "",
  sku: "",
  brandId: "",
  categoryId: "",
  description: "",
  price: 0,
  discountPrice: "",
  currency: "IDR",
  stock: 0,
  lowStockThreshold: 10,
  warranty: "1 Year",
  featured: false,
  bestseller: false,
  newArrival: true,
  status: "active",
};
