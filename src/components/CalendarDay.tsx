import { format, isSameMonth, isSameDay } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import type { Subscription } from '@/types';

interface CalendarDayProps {
  day: Date;
  currentDate: Date;
  subscriptions: Subscription[];
  dayTotal: number;
  onSubscriptionClick?: (sub: Subscription) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, currentDate, subscriptions, dayTotal, onSubscriptionClick }) => {
  const isToday = isSameDay(day, new Date());
  const isCurrentMonth = isSameMonth(day, currentDate);

  return (
    <div
      className={`min-h-[80px] sm:min-h-[100px] border-b border-r p-1 sm:p-2 ${
        !isCurrentMonth ? 'bg-muted/30' : ''
      } ${isToday ? 'bg-primary/5' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs sm:text-sm ${
            isToday
              ? 'flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium'
              : !isCurrentMonth
              ? 'text-muted-foreground/50'
              : ''
          }`}
        >
          {format(day, 'd')}
        </span>
        {dayTotal > 0 && (
          <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate ml-1">
            {formatCurrency(dayTotal, 'USD')}
          </span>
        )}
      </div>

      <div className="mt-1 space-y-0.5 sm:space-y-1">
        {subscriptions.slice(0, 2).map((sub) => (
          <div
            key={sub._id}
            className="rounded px-1 py-0.5 text-[10px] sm:text-xs truncate bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition-colors"
            title={`${sub.name} - ${formatCurrency(sub.price, sub.currency)}`}
            onClick={() => onSubscriptionClick?.(sub)}
          >
            {sub.name}
          </div>
        ))}
        {subscriptions.length > 2 && (
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            +{subscriptions.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
