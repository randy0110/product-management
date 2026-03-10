import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import type { Product, ProductFormData } from '../types/product';

// ─── Zod Validation Schema ────────────────────────────────────────────────────

const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional(),
  price: z
    .number({ message: 'Enter a valid price' })
    .positive('Price must be greater than 0'),
  stock: z
    .number({ message: 'Enter a valid stock quantity' })
    .int('Stock must be an integer')
    .min(0, 'Stock must be 0 or more'),
  sku: z
    .string()
    .regex(/^[A-Z0-9]+$/, 'SKU must contain only uppercase letters and numbers'),
  active: z.boolean(),
});

type FormValues = z.infer<typeof productSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

interface ProductFormProps {
  product?: Product;
  isSubmitting: boolean;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductForm({ product, isSubmitting, onSubmit, onCancel }: ProductFormProps) {
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(productSchema) as never,
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price ? parseFloat(product.price) : undefined,
      stock: product?.stock ?? 0,
      sku: product?.sku ?? '',
      active: product?.active ?? true,
    },
  });

  // Reset form when product changes (e.g. opening edit for different product)
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description ?? '',
        price: parseFloat(product.price),
        stock: product.stock,
        sku: product.sku,
        active: product.active,
      });
    }
  }, [product, reset]);

  const descriptionValue = watch('description') ?? '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit((values) => onSubmit(values as unknown as ProductFormData))} className="overflow-y-auto">
          <div className="px-6 py-5 space-y-4">
            {/* Name */}
            <Field label="Name *" error={errors.name?.message}>
              <input
                {...register('name')}
                placeholder="e.g. Wireless Headphones"
                className={inputClass(!!errors.name)}
              />
            </Field>

            {/* Description */}
            <Field label="Description" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Optional product description"
                className={inputClass(!!errors.description) + ' resize-none'}
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {descriptionValue.length}/1000
              </p>
            </Field>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price ($) *" error={errors.price?.message}>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className={inputClass(!!errors.price)}
                />
              </Field>
              <Field label="Stock *" error={errors.stock?.message}>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  className={inputClass(!!errors.stock)}
                />
              </Field>
            </div>

            {/* SKU */}
            <Field label="SKU *" error={errors.sku?.message}>
              <input
                {...register('sku')}
                placeholder="e.g. PROD001"
                className={inputClass(!!errors.sku) + ' uppercase'}
                onInput={(e) => {
                  (e.target as HTMLInputElement).value = (
                    e.target as HTMLInputElement
                  ).value.toUpperCase();
                }}
              />
              <p className="text-xs text-gray-400 mt-1">Uppercase letters and numbers only</p>
            </Field>

            {/* Active toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Active</label>
                <p className="text-xs text-gray-400">Product will be visible to customers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register('active')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-75 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isEditing ? 'Saving…' : 'Creating…'}
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition ${
    hasError
      ? 'border-red-300 focus:ring-red-200 bg-red-50'
      : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400 bg-white'
  }`;
}
