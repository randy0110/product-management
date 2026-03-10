import { Edit2, Trash2, Package, History } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onHistory: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete, onHistory }: ProductCardProps) {
  const price = parseFloat(product.price).toFixed(2);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Status badge */}
      <div className="h-1 w-full" style={{ backgroundColor: product.active ? '#22c55e' : '#e5e7eb' }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Package className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
              {product.name}
            </h3>
          </div>
          <span
            className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
              product.active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {product.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Price</p>
            <p className="text-sm font-bold text-gray-900">${price}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Stock</p>
            <p className={`text-sm font-bold ${product.stock === 0 ? 'text-red-500' : 'text-gray-900'}`}>
              {product.stock}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">SKU</p>
            <p className="text-xs font-mono font-bold text-blue-600 truncate">{product.sku}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onHistory(product)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            title="Change history"
          >
            <History className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
