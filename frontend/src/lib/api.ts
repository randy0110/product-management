import axios from 'axios';
import type {
  Product,
  ProductFormData,
  ProductFilters,
  ProductListResponse,
  ProductResponse,
  AuditRecord,
} from '../types/product';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ''}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Products API ─────────────────────────────────────────────────────────────

export const productsApi = {
  /**
   * List products with optional filters, search and pagination.
   */
  list: async (filters: ProductFilters = {}): Promise<ProductListResponse> => {
    const params: Record<string, string | number | boolean> = {};
    if (filters.search) params.search = filters.search;
    if (filters.active !== undefined) params.active = filters.active;
    if (filters.page) params.page = filters.page;
    if (filters.per_page) params.per_page = filters.per_page;

    const { data } = await api.get<ProductListResponse>('/products', { params });
    return data;
  },

  /**
   * Get a single product by ID.
   */
  get: async (id: number): Promise<Product> => {
    const { data } = await api.get<ProductResponse>(`/products/${id}`);
    return data.data;
  },

  /**
   * Create a new product.
   */
  create: async (payload: ProductFormData): Promise<Product> => {
    const { data } = await api.post<ProductResponse>('/products', { product: payload });
    return data.data;
  },

  /**
   * Update an existing product.
   */
  update: async (id: number, payload: Partial<ProductFormData>): Promise<Product> => {
    const { data } = await api.put<ProductResponse>(`/products/${id}`, {
      product: payload,
    });
    return data.data;
  },

  /**
   * Delete a product.
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  /**
   * Get audit history for a product.
   */
  audits: async (id: number): Promise<AuditRecord[]> => {
    const { data } = await api.get<{ data: AuditRecord[] }>(`/products/${id}/audits`);
    return data.data;
  },
};

/**
 * Extract a human-readable error message from an Axios error.
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errors = error.response?.data?.errors;
    if (Array.isArray(errors)) return errors.join(', ');
    const err = error.response?.data?.error;
    if (err) return err;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
