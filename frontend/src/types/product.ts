// Product types matching the backend model

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string; // Decimal comes as string from Rails
  stock: number;
  sku: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  active: boolean;
}

export interface PaginationMeta {
  total_count: number;
  current_page: number;
  total_pages: number;
  per_page: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: PaginationMeta;
}

export interface ProductResponse {
  data: Product;
}

export interface ProductFilters {
  search?: string;
  active?: boolean | undefined;
  page?: number;
  per_page?: number;
}
