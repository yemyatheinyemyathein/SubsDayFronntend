import { motion } from 'framer-motion';
import { Mail, Send, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Subscription } from '@/types';

interface InviteModalProps {
  isOpen: boolean;
  mySubscriptions: Subscription[];
  selectedSub: Subscription | null;
  inviteEmail: string;
  inviteAmount: string;
  isPending: boolean;
  onClose: () => void;
  onSelectSub: (sub: Subscription) => void;
  onEmailChange: (email: string) => void;
  onAmountChange: (amount: string) => void;
  onSend: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  mySubscriptions,
  selectedSub,
  inviteEmail,
  inviteAmount,
  isPending,
  onClose,
  onSelectSub,
  onEmailChange,
  onAmountChange,
  onSend,
}: InviteModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="card w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="5" y="10" width="30" height="20" rx="4" fill="url(#modalGrad)" />
              <path d="M5 14L20 24L35 14" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.1)" />
              <defs>
                <linearGradient id="modalGrad" x1="5" y1="10" x2="35" y2="30">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <h2 className="text-xl font-bold">Share Subscription</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label mb-2">Select Subscription</label>
            <select
              className="input"
              value={selectedSub?._id || ''}
              onChange={(e) => {
                const sub = mySubscriptions.find((s) => s._id === e.target.value);
                if (sub) onSelectSub(sub);
              }}
            >
              <option value="">Choose a subscription...</option>
              {mySubscriptions.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name} - {formatCurrency(sub.price, sub.currency)}
                </option>
              ))}
            </select>
          </div>

          {selectedSub && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div>
                <label className="label mb-2">Member Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="friend@example.com"
                  value={inviteEmail}
                  onChange={(e) => onEmailChange(e.target.value)}
                />
              </div>
              <div>
                <label className="label mb-2">
                  Share Amount ({selectedSub.currency})
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="0.00"
                  value={inviteAmount}
                  onChange={(e) => onAmountChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Total: {formatCurrency(selectedSub.price, selectedSub.currency)} ÷{' '}
                  {inviteAmount ? Math.floor(selectedSub.price / parseFloat(inviteAmount)) : '?'} people
                </p>
              </div>
              <motion.div
                className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-primary" />
                  <span className="text-muted-foreground">
                    An invitation email will be sent with your share details
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          <div className="flex gap-2 pt-4">
            <button className="btn-secondary flex-1" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-primary flex-1 gap-2"
              onClick={onSend}
              disabled={isPending}
            >
              {isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={16} />
                </motion.div>
              ) : (
                <>
                  <Send size={16} />
                  Send Invite
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InviteModal;
