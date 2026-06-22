// The DataAdapter contract.
//
// Every screen in this admin talks to data ONLY through this interface
// (consumed via the hooks in src/lib/data/hooks.ts). Today `mockAdapter`
// (src/lib/data/mock-adapter.ts) implements it on top of in-memory state
// + localStorage. Swapping to Supabase later means writing one new file,
// `supabase-adapter.ts`, that implements the same methods against real
// tables, then changing a single import in `src/lib/data/index.ts`.
// No component, form, or page in the app needs to change.

import type { Brand, Category, Product, ProductFilters } from "@/types";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DataAdapter {
  // Products
  listProducts(filters: ProductFilters): Promise<PaginatedResult<Product>>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(input: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product>;
  updateProduct(id: string, input: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  bulkUpdateStatus(ids: string[], status: Product["status"]): Promise<void>;
  bulkDelete(ids: string[]): Promise<void>;
  bulkSetCategory(ids: string[], categoryId: string): Promise<void>;
  bulkSetBrand(ids: string[], brandId: string): Promise<void>;

  // Categories
  listCategories(): Promise<Category[]>;
  createCategory(input: Omit<Category, "id" | "createdAt" | "productCount" | "slug">): Promise<Category>;
  updateCategory(id: string, input: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Brands
  listBrands(): Promise<Brand[]>;
  createBrand(input: Omit<Brand, "id" | "createdAt" | "productCount" | "slug">): Promise<Brand>;
  updateBrand(id: string, input: Partial<Brand>): Promise<Brand>;
  deleteBrand(id: string): Promise<void>;

  // Dashboard
  getDashboardStats(): Promise<{
    totalProducts: number;
    inStock: number;
    outOfStock: number;
    lowStock: number;
    totalCategories: number;
    totalBrands: number;
    totalOrders: number; // future-ready, static placeholder
    totalCustomers: number; // future-ready, static placeholder
    revenue: number; // placeholder
  }>;
  getRecentActivity(): Promise<import("@/types").ActivityLogEntry[]>;
}
