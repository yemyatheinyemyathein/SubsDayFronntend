import { useState } from 'react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { ChevronLeft, ChevronRight, CreditCard, CalendarDays, Tag, Repeat, Users } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import CalendarDay from '@/components/CalendarDay';
import PaymentSummary from '@/components/PaymentSummary';
import Modal from '@/components/Modal';
import { formatCurrency } from '@/lib/utils';
import type { Subscription } from '@/types';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const { data } = useSubscriptions({ status: 'active' });

  const subscriptions = data?.subscriptions || [];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getSubscriptionsForDay = (day: Date) => {
    return subscriptions.filter((sub) => {
      const billingDate = parseISO(sub.nextBillingDate);
      return isSameDay(billingDate, day);
    });
  };

  const getDayTotal = (day: Date) => {
    return getSubscriptionsForDay(day).reduce((sum, sub) => sum + sub.price, 0);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">View your upcoming payments</p>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 sm:px-6 py-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-accent">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-accent">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 min-w-[560px] sm:min-w-0">
            {weekDays.map((day) => (
              <div key={day} className="px-1 sm:px-2 py-3 text-center text-xs sm:text-sm font-medium text-muted-foreground border-b">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}

            {days.map((day) => (
              <CalendarDay
                key={day.toString()}
                day={day}
                currentDate={currentDate}
                subscriptions={getSubscriptionsForDay(day)}
                dayTotal={getDayTotal(day)}
                onSubscriptionClick={setSelectedSub}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        title={selectedSub?.name || ''}
      >
        {selectedSub && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(selectedSub.price, selectedSub.currency)}</p>
                <p className="text-sm text-muted-foreground capitalize">{selectedSub.billingCycle}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CalendarDays size={14} /> Next billing
                </span>
                <span>{format(new Date(selectedSub.nextBillingDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Tag size={14} /> Category
                </span>
                <span>{selectedSub.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Repeat size={14} /> Status
                </span>
                <span className="capitalize">{selectedSub.status}</span>
              </div>
              {selectedSub.startDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Start date</span>
                  <span>{format(new Date(selectedSub.startDate), 'MMM d, yyyy')}</span>
                </div>
              )}
              {selectedSub.endDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">End date</span>
                  <span>{format(new Date(selectedSub.endDate), 'MMM d, yyyy')}</span>
                </div>
              )}
              {selectedSub.isShared && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users size={14} /> Shared
                  </span>
                  <span>{selectedSub.sharedMembers?.length || 0} members</span>
                </div>
              )}
            </div>

            {selectedSub.notes && (
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{selectedSub.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <PaymentSummary currentDate={currentDate} subscriptions={subscriptions} />
    </div>
  );
};

export default Calendar;
