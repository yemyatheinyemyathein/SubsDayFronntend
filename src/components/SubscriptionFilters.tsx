import { Search } from 'lucide-react';
import { CATEGORIES } from '@/types';

interface SubscriptionFiltersProps {
  search: string;
  categoryFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({
  search,
  categoryFilter,
  statusFilter,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: SubscriptionFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          className="input pl-9"
          placeholder="Search subscriptions..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="input sm:w-40"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        className="input sm:w-36"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="canceled">Canceled</option>
      </select>
    </div>
  );
};

export default SubscriptionFilters;
