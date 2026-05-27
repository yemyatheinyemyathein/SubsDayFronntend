import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import type { Subscription } from '@/types';

interface PaymentSummaryProps {
  currentDate: Date;
  subscriptions: Subscription[];
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ currentDate, subscriptions }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const monthSubs = subscriptions
    .filter((sub) => {
      const billingDate = parseISO(sub.nextBillingDate);
      return billingDate >= monthStart && billingDate <= monthEnd;
    })
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());

  return (
    <div className="card p-6">
      <h3 className="font-semibold mb-4">Payment Summary - {format(currentDate, 'MMMM yyyy')}</h3>
      <div className="space-y-3">
        {monthSubs.map((sub) => (
          <div key={sub._id} className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-medium truncate">{sub.name}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(sub.nextBillingDate), 'MMM d')} - {sub.billingCycle}
              </p>
            </div>
            <p className="font-medium shrink-0 ml-2">
              {formatCurrency(sub.price, sub.currency)}
            </p>
          </div>
        ))}
        {monthSubs.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No payments this month</p>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;
