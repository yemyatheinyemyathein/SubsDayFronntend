import { useStats } from '@/hooks/useSubscriptions';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#6366f1'];

const Stats: React.FC = () => {
  const { data, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="card p-6 h-80">
              <div className="h-full bg-muted/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = data;

  const categoryData = stats?.categoryBreakdown.map((cat) => ({
    name: cat.category,
    value: cat.total,
  })) || [];

  const billingCycleData = [
    { name: 'Monthly', value: stats?.categoryBreakdown.reduce((acc, cat) => acc + cat.count, 0) || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">Insights into your spending</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Monthly Spending</p>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(stats?.monthlySpending || 0, stats?.baseCurrency)}
          </p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Yearly Projection</p>
          <p className="text-3xl font-bold text-green-500">
            {formatCurrency(stats?.yearlyProjection || 0, stats?.baseCurrency)}
          </p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Daily Average</p>
          <p className="text-3xl font-bold text-orange-500">
            {formatCurrency((stats?.monthlySpending || 0) / 30, stats?.baseCurrency)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          {categoryData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, stats?.baseCurrency)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-4 space-y-2">
            {stats?.categoryBreakdown.slice(0, 5).map((cat, index) => (
              <div key={cat.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{cat.category}</span>
                </div>
                <span className="font-medium">
                  {formatCurrency(cat.total, stats?.baseCurrency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Category Breakdown</h3>
          {categoryData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, stats?.baseCurrency)}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {stats?.upcomingPayments && stats.upcomingPayments.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Upcoming Payments (Next 30 Days)</h3>
          <div className="space-y-3">
            {stats.upcomingPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{payment.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-medium">
                  {formatCurrency(payment.price, payment.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
