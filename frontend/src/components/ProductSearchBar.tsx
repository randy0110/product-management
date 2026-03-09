import { Search } from 'lucide-react';

interface ProductSearchBarProps {
  search: string;
  activeFilter: boolean | undefined;
  onSearchChange: (value: string) => void;
  onActiveFilterChange: (value: boolean | undefined) => void;
}

export function ProductSearchBar({
  search,
  activeFilter,
  onSearchChange,
  onActiveFilterChange,
}: ProductSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        />
      </div>

      {/* Status Filter */}
      <div className="flex rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {([
          { label: 'All', value: undefined },
          { label: 'Active', value: true },
          { label: 'Inactive', value: false },
        ] as const).map(({ label, value }) => (
          <button
            key={label}
            onClick={() => onActiveFilterChange(value)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-r last:border-r-0 border-gray-200 ${
              activeFilter === value
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
