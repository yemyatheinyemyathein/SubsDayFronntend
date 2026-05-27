import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Subscription, SharedMember } from '@/types';

interface PendingInvitationCardProps {
  subscription: Subscription;
  pendingMember: SharedMember;
  onAccept: (subId: string) => void;
  onDecline: (subId: string, memberEmail: string) => void;
  isAccepting: boolean;
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const PendingInvitationCard: React.FC<PendingInvitationCardProps> = ({
  subscription: sub,
  pendingMember,
  onAccept,
  onDecline,
  isAccepting,
}: PendingInvitationCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className="card p-6 relative overflow-hidden"
      whileHover={{ scale: 1.01 }}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 shrink-0"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertCircle size={24} className="text-orange-500" />
          </motion.div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate">{sub.name}</h3>
            <p className="text-sm text-muted-foreground">
              Invited to share {formatCurrency(sub.price, sub.currency)} subscription
            </p>
            {pendingMember && (
              <p className="text-xs text-muted-foreground mt-1">
                Your share: {formatCurrency(pendingMember.shareAmount, sub.currency)}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <motion.button
            className="btn-primary gap-2"
            onClick={() => onAccept(sub._id)}
            disabled={isAccepting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAccepting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={16} />
              </motion.div>
            ) : (
              <>
                <CheckCircle size={16} />
                Accept
              </>
            )}
          </motion.button>
          <motion.button
            className="btn-danger gap-2"
            onClick={() => onDecline(sub._id, pendingMember.email)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <XCircle size={16} />
            Decline
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PendingInvitationCard;
