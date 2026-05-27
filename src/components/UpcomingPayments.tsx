import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, AlertCircle } from 'lucide-react';
import { formatCurrency, getDaysUntil } from '@/lib/utils';
import { format } from 'date-fns';
import type { Subscription } from '@/types';

interface UpcomingPaymentsProps {
  payments: Subscription[];
}

const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ payments }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold">Upcoming Payments</h2>
        <Link to="/calendar" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="divide-y">
        {payments.length === 0 ? (
          <div className="px-6 py-8 text-center text-muted-foreground">
            <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
            <p>No upcoming payments</p>
          </div>
        ) : (
          payments.map((sub, idx) => {
            const days = getDaysUntil(sub.nextBillingDate);
            return (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${sub.name.toLowerCase().replace(/\s+/g, '')}.com&sz=32`}
                    alt=""
                    className="h-8 w-8 rounded-lg object-contain bg-muted"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(sub.nextBillingDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(sub.price, sub.currency)}
                  </p>
                  <p className={`text-xs ${days <= 3 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingPayments;
