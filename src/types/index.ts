// Core domain types for the PT. HI-TECH Admin Dashboard.
// These mirror the eventual Supabase table shapes 1:1 so the
// data-access layer (src/lib/data/*) can be swapped from mock to
// live without touching components or forms.

export type ProductStatus = "active" | "hidden" | "draft";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductImage {
  id: string;
  url: string; // object URL (mock) or storage URL (live)
  isThumbnail: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brandId: string;
  categoryId: string;
  description: string;
  specifications: { key: string; value: string }[];
  price: number;
  discountPrice: number | null;
  currency: "IDR" | "USD" | "SGD" | "EUR";
  stock: number;
  lowStockThreshold: number;
  images: ProductImage[];
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  warranty: string;
  tags: string[];
  status: ProductStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  productCount: number;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  avatarInitials: string;
}

export interface ActivityLogEntry {
  id: string;
  type: "product_created" | "product_updated" | "product_deleted" | "stock_alert" | "login";
  message: string;
  timestamp: string;
}

export type SortKey = "name_asc" | "name_desc" | "price_asc" | "price_desc" | "stock_asc" | "stock_desc" | "newest" | "oldest";

export interface ProductFilters {
  search: string;
  brandId: string | "all";
  categoryId: string | "all";
  status: ProductStatus | "all";
  stock: StockStatus | "all";
  featured: boolean | "all";
  sort: SortKey;
  page: number;
  pageSize: number;
}
