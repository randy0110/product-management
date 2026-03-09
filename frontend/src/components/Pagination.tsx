import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '../types/product';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { current_page, total_pages, total_count, per_page } = meta;

  if (total_pages <= 1) return null;

  const from = (current_page - 1) * per_page + 1;
  const to = Math.min(current_page * per_page, total_count);

  const pages = buildPageList(current_page, total_pages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
      {/* Info */}
      <span className="text-sm text-gray-600">
        Showing <strong>{from}</strong>–<strong>{to}</strong> of{' '}
        <strong>{total_count}</strong> products
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
              &hellip;
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-9 h-9 rounded-md border text-sm font-medium transition ${
                page === current_page
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === total_pages}
          className="p-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('ellipsis');

  pages.push(total);
  return pages;
}
