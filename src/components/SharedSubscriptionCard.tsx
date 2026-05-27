import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { CreditCard, Users, CheckCircle, Clock, Send, Trash2 } from 'lucide-react';
import { formatCurrency, getDaysUntil } from '@/lib/utils';
import { format } from 'date-fns';
import type { Subscription } from '@/types';

function getMonthlyEquivalent(amount: number, billingCycle: string): number {
  switch (billingCycle) {
    case 'yearly': return amount / 12;
    case 'weekly': return amount * 4.33;
    case 'monthly': return amount;
    default: return amount;
  }
}

interface SharedSubscriptionCardProps {
  subscription: Subscription;
  isOwner: boolean;
  onResendInvite: (subId: string, email: string) => void;
  onRemoveMember: (subId: string, memberEmail: string) => void;
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const SharedSubscriptionCard: React.FC<SharedSubscriptionCardProps> = ({
  subscription: sub,
  isOwner,
  onResendInvite,
  onRemoveMember,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className="card p-6 relative overflow-hidden group"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(var(--primary), 0.05) 0%, rgba(126, 75, 162, 0.05) 100%)',
            'linear-gradient(225deg, rgba(var(--primary), 0.1) 0%, rgba(126, 75, 162, 0.1) 100%)',
            'linear-gradient(135deg, rgba(var(--primary), 0.05) 0%, rgba(126, 75, 162, 0.05) 100%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg bg-primary/10"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <CreditCard size={20} className="text-primary" />
            </motion.div>
            <div>
              <h3 className="font-semibold">{sub.name}</h3>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(sub.price, sub.currency)}
              </span>
            </div>
          </div>
          <motion.span
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-500/10 text-green-600 rounded-full"
            whileHover={{ scale: 1.1 }}
          >
            <Users size={12} />
            {sub.sharedMembers?.filter((m) => m.status === 'active').length || 0}
          </motion.span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Billing</span>
            <span className="capitalize">{sub.billingCycle}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next Payment</span>
            <span className={getDaysUntil(sub.nextBillingDate) <= 3 ? 'text-red-500' : ''}>
              {format(new Date(sub.nextBillingDate), 'MMM d, yyyy')}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Members</p>
          <div className="space-y-2">
            {sub.sharedMembers?.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {member.status === 'active' ? (
                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                  ) : (
                    <Clock size={14} className="text-orange-500 shrink-0" />
                  )}
                  <span className={`truncate ${member.status === 'pending' ? 'text-muted-foreground' : ''}`}>
                    {member.email}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">
                      {formatCurrency(member.shareAmount, sub.currency)}/{sub.billingCycle === 'yearly' ? 'yr' : sub.billingCycle === 'weekly' ? 'wk' : sub.billingCycle === 'monthly' ? 'mo' : 'period'}
                    </span>
                    {isOwner && member.status === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onResendInvite(sub._id, member.email)}
                        className="text-primary hover:text-purple-700 transition-colors"
                        title="Resend invitation"
                      >
                        <Send size={12} />
                      </motion.button>
                    )}
                    {isOwner && member.status === 'active' && (
                      <button
                        onClick={() => onRemoveMember(sub._id, member.email)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground text-right leading-tight">
                    ~{formatCurrency(getMonthlyEquivalent(member.shareAmount, sub.billingCycle), sub.currency)}/mo &middot; ~{formatCurrency(getMonthlyEquivalent(member.shareAmount, sub.billingCycle) * 12, sub.currency)}/yr &middot; ~{formatCurrency(getMonthlyEquivalent(member.shareAmount, sub.billingCycle) / 30, sub.currency)}/day
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SharedSubscriptionCard;
