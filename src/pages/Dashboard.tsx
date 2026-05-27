import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useStats, useSubscriptions } from '@/hooks/useSubscriptions';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, CreditCard, CalendarDays, Plus } from 'lucide-react';
import StatCard from '@/components/StatCard';
import UpcomingPayments from '@/components/UpcomingPayments';
import CategoryBreakdown from '@/components/CategoryBreakdown';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useStats();
  const { data: subsData, isLoading: subsLoading } = useSubscriptions({ status: 'active' });

  const stats = statsData;
  const subscriptions = subsData?.subscriptions || [];

  const upcomingPayments = subscriptions
    .filter((sub) => sub.status === 'active')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 5);

  if (statsLoading || subsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6">
              <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Overview of your subscriptions</p>
        </div>
        <Link to="/subscriptions" className="btn-primary gap-2 hover:shadow-lg hover:shadow-primary/25 transition-shadow self-start sm:self-auto">
          <Plus size={16} />
          Add Subscription
        </Link>
      </motion.div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Monthly Spending"
          value={formatCurrency(stats?.monthlySpending || 0, stats?.baseCurrency)}
          color="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Yearly Projection"
          value={formatCurrency(stats?.yearlyProjection || 0, stats?.baseCurrency)}
          color="green"
        />
        <StatCard
          icon={CreditCard}
          label="Active Subs"
          value={String(stats?.totalActive || 0)}
          color="blue"
        />
        <StatCard
          icon={CalendarDays}
          label="Next Payment"
          value={
            upcomingPayments[0]
              ? formatCurrency(upcomingPayments[0].price, upcomingPayments[0].currency)
              : '$0'
          }
          color="orange"
        />
      </div>

      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        <UpcomingPayments payments={upcomingPayments} />
        <CategoryBreakdown
          breakdown={stats?.categoryBreakdown || []}
          monthlySpending={stats?.monthlySpending || 0}
          baseCurrency={stats?.baseCurrency || 'USD'}
        />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
