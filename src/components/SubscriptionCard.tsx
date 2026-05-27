import { formatCurrency, getDaysUntil, getLogoUrl } from '@/lib/utils';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import type { Subscription } from '@/types';

interface SubscriptionCardProps {
  subscription: Subscription;
  dropdownOpen: boolean;
  onToggleDropdown: () => void;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription: sub,
  dropdownOpen,
  onToggleDropdown,
  onEdit,
  onDelete,
}: SubscriptionCardProps) => {
  const days = getDaysUntil(sub.nextBillingDate);

  return (
    <div className="card p-6 relative">
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button
            onClick={onToggleDropdown}
            className="p-1 rounded-lg hover:bg-accent"
          >
            <MoreHorizontal size={16} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg border bg-card shadow-lg py-1">
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                onClick={() => onEdit(sub)}
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-accent"
                onClick={() => onDelete(sub._id)}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <img
          src={sub.logo || getLogoUrl(sub.name)}
          alt={sub.name}
          className="h-10 w-10 rounded-lg object-contain bg-muted"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '';
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{sub.name}</h3>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            sub.status === 'active'
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
          }`}>
            {sub.status}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="font-semibold">
            {formatCurrency(sub.price, sub.currency)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Billing</span>
          <span className="text-sm capitalize">{sub.billingCycle}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Category</span>
          <span className="text-sm">{sub.category}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Next billing</span>
          <span className={`text-sm ${days <= 3 && sub.status === 'active' ? 'text-red-500 font-medium' : ''}`}>
            {format(new Date(sub.nextBillingDate), 'MMM d, yyyy')}
          </span>
        </div>
        {sub.startDate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Start date</span>
            <span className="text-sm">{format(new Date(sub.startDate), 'MMM d, yyyy')}</span>
          </div>
        )}
        {sub.endDate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">End date</span>
            <span className="text-sm">{format(new Date(sub.endDate), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>

      {sub.status === 'active' && (
        <div className="mt-4 pt-4 border-t">
          <p className={`text-xs text-center ${
            days <= 0 ? 'text-red-500 font-medium' :
            days <= 3 ? 'text-orange-500' : 'text-muted-foreground'
          }`}>
            {days === 0 ? 'Due today' : days === 1 ? 'Due tomorrow' : `Due in ${days} days`}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
