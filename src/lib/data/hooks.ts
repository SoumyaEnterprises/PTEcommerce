"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataAdapter } from "./index";
import type { Brand, Category, Product, ProductFilters } from "@/types";

// ---- Products ----

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => dataAdapter.listProducts(filters),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => dataAdapter.getProduct(id as string),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Product, "id" | "createdAt" | "updatedAt">) => dataAdapter.createProduct(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["activity"] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Product> }) => dataAdapter.updateProduct(id, input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars.id] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["activity"] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dataAdapter.deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["activity"] });
    },
  });
}

export function useBulkAction() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    qc.invalidateQueries({ queryKey: ["activity"] });
  };
  const deleteMany = useMutation({ mutationFn: (ids: string[]) => dataAdapter.bulkDelete(ids), onSuccess: invalidate });
  const setStatus = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: Product["status"] }) => dataAdapter.bulkUpdateStatus(ids, status),
    onSuccess: invalidate,
  });
  const setCategory = useMutation({
    mutationFn: ({ ids, categoryId }: { ids: string[]; categoryId: string }) => dataAdapter.bulkSetCategory(ids, categoryId),
    onSuccess: invalidate,
  });
  const setBrand = useMutation({
    mutationFn: ({ ids, brandId }: { ids: string[]; brandId: string }) => dataAdapter.bulkSetBrand(ids, brandId),
    onSuccess: invalidate,
  });
  return { deleteMany, setStatus, setCategory, setBrand };
}

// ---- Categories ----

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: () => dataAdapter.listCategories() });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Category, "id" | "createdAt" | "productCount" | "slug">) => dataAdapter.createCategory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Category> }) => dataAdapter.updateCategory(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dataAdapter.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// ---- Brands ----

export function useBrands() {
  return useQuery({ queryKey: ["brands"], queryFn: () => dataAdapter.listBrands() });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Brand, "id" | "createdAt" | "productCount" | "slug">) => dataAdapter.createBrand(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Brand> }) => dataAdapter.updateBrand(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dataAdapter.deleteBrand(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
}

// ---- Dashboard ----

export function useDashboardStats() {
  return useQuery({ queryKey: ["dashboard-stats"], queryFn: () => dataAdapter.getDashboardStats() });
}

export function useRecentActivity() {
  return useQuery({ queryKey: ["activity"], queryFn: () => dataAdapter.getRecentActivity() });
}
