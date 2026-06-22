import type { Brand, Category, Product, ProductFilters, StockStatus } from "@/types";
import type { DataAdapter, PaginatedResult } from "./adapter";
import { seedProducts } from "@/lib/seed-products";
import { seedCategories } from "@/lib/seed-categories";
import { seedBrands } from "@/lib/seed-brands";
import { loadFromStorage, saveToStorage } from "@/lib/storage";

// --- in-memory state, hydrated from localStorage on first access ---

let products: Product[] | null = null;
let categories: Category[] | null = null;
let brands: Brand[] | null = null;
let activity: import("@/types").ActivityLogEntry[] | null = null;

function ensureLoaded() {
  if (products === null) products = loadFromStorage("products", seedProducts);
  if (categories === null) categories = loadFromStorage("categories", seedCategories);
  if (brands === null) brands = loadFromStorage("brands", seedBrands);
  if (activity === null) {
    activity = loadFromStorage<import("@/types").ActivityLogEntry[]>("activity", [
      { id: "a1", type: "login", message: "Admin signed in", timestamp: new Date().toISOString() },
    ]);
  }
}

function persist() {
  if (products) saveToStorage("products", products);
  if (categories) saveToStorage("categories", categories);
  if (brands) saveToStorage("brands", brands);
  if (activity) saveToStorage("activity", activity);
}

function pushActivity(entry: Omit<import("@/types").ActivityLogEntry, "id" | "timestamp">) {
  ensureLoaded();
  activity!.unshift({
    ...entry,
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  });
  activity = activity!.slice(0, 30);
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stockStatus(p: Product): StockStatus {
  if (p.stock <= 0) return "out_of_stock";
  if (p.stock <= p.lowStockThreshold) return "low_stock";
  return "in_stock";
}

// simulate realistic network latency so loading states are visible in the demo
function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const mockAdapter: DataAdapter = {
  async listProducts(filters: ProductFilters): Promise<PaginatedResult<Product>> {
    ensureLoaded();
    let list = [...products!];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.brandId !== "all") list = list.filter((p) => p.brandId === filters.brandId);
    if (filters.categoryId !== "all") list = list.filter((p) => p.categoryId === filters.categoryId);
    if (filters.status !== "all") list = list.filter((p) => p.status === filters.status);
    if (filters.stock !== "all") list = list.filter((p) => stockStatus(p) === filters.stock);
    if (filters.featured !== "all") list = list.filter((p) => p.featured === filters.featured);

    switch (filters.sort) {
      case "name_asc": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name_desc": list.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "price_asc": list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)); break;
      case "price_desc": list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)); break;
      case "stock_asc": list.sort((a, b) => a.stock - b.stock); break;
      case "stock_desc": list.sort((a, b) => b.stock - a.stock); break;
      case "oldest": list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "newest":
      default: list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = list.length;
    const start = (filters.page - 1) * filters.pageSize;
    const items = list.slice(start, start + filters.pageSize);

    return delay({ items, total, page: filters.page, pageSize: filters.pageSize });
  },

  async getProduct(id: string): Promise<Product | null> {
    ensureLoaded();
    return delay(products!.find((p) => p.id === id) ?? null, 200);
  },

  async createProduct(input): Promise<Product> {
    ensureLoaded();
    const now = new Date().toISOString();
    const product: Product = {
      ...input,
      id: `prod-${Date.now()}`,
      slug: slugify(input.name),
      createdAt: now,
      updatedAt: now,
    };
    products!.unshift(product);
    pushActivity({ type: "product_created", message: `Product "${product.name}" was created` });
    persist();
    return delay(product);
  },

  async updateProduct(id, input): Promise<Product> {
    ensureLoaded();
    const idx = products!.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    const updated: Product = {
      ...products![idx],
      ...input,
      slug: input.name ? slugify(input.name) : products![idx].slug,
      updatedAt: new Date().toISOString(),
    };
    products![idx] = updated;
    pushActivity({ type: "product_updated", message: `Product "${updated.name}" was updated` });
    persist();
    return delay(updated);
  },

  async deleteProduct(id): Promise<void> {
    ensureLoaded();
    const found = products!.find((p) => p.id === id);
    products = products!.filter((p) => p.id !== id);
    if (found) pushActivity({ type: "product_deleted", message: `Product "${found.name}" was deleted` });
    persist();
    return delay(undefined);
  },

  async bulkUpdateStatus(ids, status): Promise<void> {
    ensureLoaded();
    products = products!.map((p) => (ids.includes(p.id) ? { ...p, status, updatedAt: new Date().toISOString() } : p));
    pushActivity({ type: "product_updated", message: `${ids.length} product(s) set to "${status}"` });
    persist();
    return delay(undefined);
  },

  async bulkDelete(ids): Promise<void> {
    ensureLoaded();
    products = products!.filter((p) => !ids.includes(p.id));
    pushActivity({ type: "product_deleted", message: `${ids.length} product(s) deleted` });
    persist();
    return delay(undefined);
  },

  async bulkSetCategory(ids, categoryId): Promise<void> {
    ensureLoaded();
    products = products!.map((p) => (ids.includes(p.id) ? { ...p, categoryId, updatedAt: new Date().toISOString() } : p));
    persist();
    return delay(undefined);
  },

  async bulkSetBrand(ids, brandId): Promise<void> {
    ensureLoaded();
    products = products!.map((p) => (ids.includes(p.id) ? { ...p, brandId, updatedAt: new Date().toISOString() } : p));
    persist();
    return delay(undefined);
  },

  async listCategories(): Promise<Category[]> {
    ensureLoaded();
    return delay([...categories!]);
  },

  async createCategory(input): Promise<Category> {
    ensureLoaded();
    const category: Category = {
      ...input,
      id: `cat-${Date.now()}`,
      slug: slugify(input.name),
      productCount: 0,
      createdAt: new Date().toISOString(),
    };
    categories!.unshift(category);
    persist();
    return delay(category);
  },

  async updateCategory(id, input): Promise<Category> {
    ensureLoaded();
    const idx = categories!.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Category not found");
    const updated = { ...categories![idx], ...input, slug: input.name ? slugify(input.name) : categories![idx].slug };
    categories![idx] = updated;
    persist();
    return delay(updated);
  },

  async deleteCategory(id): Promise<void> {
    ensureLoaded();
    categories = categories!.filter((c) => c.id !== id);
    persist();
    return delay(undefined);
  },

  async listBrands(): Promise<Brand[]> {
    ensureLoaded();
    return delay([...brands!]);
  },

  async createBrand(input): Promise<Brand> {
    ensureLoaded();
    const brand: Brand = {
      ...input,
      id: `brand-${Date.now()}`,
      slug: slugify(input.name),
      productCount: 0,
      createdAt: new Date().toISOString(),
    };
    brands!.unshift(brand);
    persist();
    return delay(brand);
  },

  async updateBrand(id, input): Promise<Brand> {
    ensureLoaded();
    const idx = brands!.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Brand not found");
    const updated = { ...brands![idx], ...input, slug: input.name ? slugify(input.name) : brands![idx].slug };
    brands![idx] = updated;
    persist();
    return delay(updated);
  },

  async deleteBrand(id): Promise<void> {
    ensureLoaded();
    brands = brands!.filter((b) => b.id !== id);
    persist();
    return delay(undefined);
  },

  async getDashboardStats() {
    ensureLoaded();
    const totalProducts = products!.length;
    const inStock = products!.filter((p) => stockStatus(p) === "in_stock").length;
    const outOfStock = products!.filter((p) => stockStatus(p) === "out_of_stock").length;
    const lowStock = products!.filter((p) => stockStatus(p) === "low_stock").length;
    const revenue = products!.reduce((sum, p) => sum + (p.discountPrice ?? p.price) * Math.max(1, Math.round(p.stock / 4)), 0);

    return delay({
      totalProducts,
      inStock,
      outOfStock,
      lowStock,
      totalCategories: categories!.length,
      totalBrands: brands!.length,
      totalOrders: 1284,
      totalCustomers: 612,
      revenue,
    });
  },

  async getRecentActivity() {
    ensureLoaded();
    return delay([...activity!]);
  },
};

export { stockStatus };
