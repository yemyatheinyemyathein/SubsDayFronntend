import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CategoryItem {
  category: string;
  total: number;
}

interface CategoryBreakdownProps {
  breakdown: CategoryItem[];
  monthlySpending: number;
  baseCurrency: string;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ breakdown, monthlySpending, baseCurrency }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold">Spending by Category</h2>
        <Link to="/stats" className="text-sm text-primary hover:underline flex items-center gap-1">
          Details <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="p-6">
        {breakdown.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {breakdown.slice(0, 5).map((cat, idx) => {
              const percentage = monthlySpending ? (cat.total / monthlySpending) * 100 : 0;
              return (
                <div key={cat.category} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(cat.total, baseCurrency)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-700 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
