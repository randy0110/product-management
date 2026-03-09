import { useState, useCallback } from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../hooks/useProducts';
import { extractErrorMessage } from '../lib/api';

import { ProductCard } from './ProductCard';
import { ProductSearchBar } from './ProductSearchBar';
import { ProductForm } from './ProductForm';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Pagination } from './Pagination';
import { LoadingSpinner } from './LoadingSpinner';

import type { Product, ProductFormData } from '../types/product';

export function ProductList() {
  // ── Filters state ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingProduct, setDeletingProduct] = useState<Product | undefined>();

  // ── Data ───────────────────────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useProducts({
    search: search || undefined,
    active: activeFilter,
    page,
    per_page: 9,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((value: boolean | undefined) => {
    setActiveFilter(value);
    setPage(1);
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteRequest = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data: formData });
        toast.success('Product updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Product created successfully');
      }
      setShowForm(false);
      setEditingProduct(undefined);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await deleteMutation.mutateAsync(deletingProduct.id);
      toast.success(`"${deletingProduct.name}" deleted`);
      setDeletingProduct(undefined);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Product Manager</h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {data?.meta.total_count ?? 0} products
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingProduct(undefined);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Product</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filters */}
        <div className="mb-6">
          <ProductSearchBar
            search={search}
            activeFilter={activeFilter}
            onSearchChange={handleSearchChange}
            onActiveFilterChange={handleFilterChange}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-20 text-center">
            <p className="text-red-500 font-medium">
              {extractErrorMessage(error)}
            </p>
            <p className="text-gray-400 text-sm mt-1">Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && data?.data.length === 0 && (
          <div className="py-20 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No products found</p>
            {search && (
              <p className="text-gray-400 text-sm mt-1">
                Try a different search term or clear the filters.
              </p>
            )}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !isError && data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.data.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination meta={data.meta} onPageChange={setPage} />
          </>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          isSubmitting={isSubmitting}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(undefined);
          }}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProduct(undefined)}
        />
      )}
    </div>
  );
}
