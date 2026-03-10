import { X, PlusCircle, Edit3, Trash2, Clock } from 'lucide-react';
import { useProductAudits } from '../hooks/useProducts';
import { LoadingSpinner } from './LoadingSpinner';
import type { Product, AuditRecord } from '../types/product';

interface ProductHistoryModalProps {
  product: Product;
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  description: 'Description',
  price: 'Price',
  stock: 'Stock',
  sku: 'SKU',
  active: 'Active',
  discarded_at: 'Discarded At',
};

function formatValue(field: string, value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (field === 'price') return `$${parseFloat(String(value)).toFixed(2)}`;
  return String(value);
}

function ActionBadge({ action }: { action: AuditRecord['action'] }) {
  const config = {
    create: { label: 'Created', className: 'bg-green-100 text-green-700', Icon: PlusCircle },
    update: { label: 'Updated', className: 'bg-blue-100 text-blue-700', Icon: Edit3 },
    destroy: { label: 'Deleted', className: 'bg-red-100 text-red-700', Icon: Trash2 },
  }[action];

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${config.className}`}>
      <config.Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function AuditEntry({ audit }: { audit: AuditRecord }) {
  const date = new Date(audit.created_at);
  const isUpdate = audit.action === 'update';
  const changes = Object.entries(audit.audited_changes);

  return (
    <div className="flex gap-4 pb-6 last:pb-0">
      {/* Timeline dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-300 mt-1.5 ring-2 ring-white" />
        <div className="w-px flex-1 bg-gray-100 mt-1" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <ActionBadge action={audit.action} />
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-xs text-gray-300">v{audit.version}</span>
        </div>

        {changes.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {changes.map(([field, value]) => {
              const label = FIELD_LABELS[field] ?? field;

              if (isUpdate && Array.isArray(value)) {
                const [before, after] = value as [unknown, unknown];
                return (
                  <div key={field} className="text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <span className="font-medium text-gray-600">{label}:</span>{' '}
                    <span className="text-red-500 line-through">{formatValue(field, before)}</span>
                    {' → '}
                    <span className="text-green-600 font-medium">{formatValue(field, after)}</span>
                  </div>
                );
              }

              return (
                <div key={field} className="text-xs bg-gray-50 rounded-lg px-3 py-2">
                  <span className="font-medium text-gray-600">{label}:</span>{' '}
                  <span className="text-gray-800">{formatValue(field, value)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductHistoryModal({ product, onClose }: ProductHistoryModalProps) {
  const { data: audits, isLoading, isError } = useProductAudits(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Change History</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {isLoading && (
            <div className="py-16">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {isError && (
            <p className="text-center text-red-500 text-sm py-16">
              Failed to load change history.
            </p>
          )}

          {!isLoading && !isError && (!audits || audits.length === 0) && (
            <p className="text-center text-gray-400 text-sm py-16">No history available.</p>
          )}

          {audits && audits.length > 0 && (
            <div>
              {audits.map((audit) => (
                <AuditEntry key={audit.id} audit={audit} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
