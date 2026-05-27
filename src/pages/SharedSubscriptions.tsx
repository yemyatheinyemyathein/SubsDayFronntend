import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Mail, UserPlus,
} from 'lucide-react';
import { useSubscriptions, useInviteMember, useAcceptInvitation, useRemoveMember, useResendInvitation, usePendingInvitations, useSharedSubscriptions } from '@/hooks/useSubscriptions';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { AnimatedUsersSVG, MailWithSparklesSVG } from '@/components/AnimatedSVG';
import SharedSubscriptionCard from '@/components/SharedSubscriptionCard';
import PendingInvitationCard from '@/components/PendingInvitationCard';
import InviteModal from '@/components/InviteModal';
import AcceptSuccessOverlay from '@/components/AcceptSuccessOverlay';
import type { Subscription } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const SharedSubscriptions = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'mine' | 'invitations'>('mine');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteAmount, setInviteAmount] = useState('');
  const [acceptSuccess, setAcceptSuccess] = useState(false);

  const { data: subsData, isLoading: subsLoading } = useSubscriptions({ status: 'active' });
  const { data: memberSharedSubs, isLoading: memberSharedLoading } = useSharedSubscriptions();
  const { data: pendingInvitationsData, isLoading: invitesLoading } = usePendingInvitations();
  const inviteMutation = useInviteMember();
  const acceptMutation = useAcceptInvitation();
  const removeMutation = useRemoveMember();
  const resendMutation = useResendInvitation();

  const subscriptions = subsData?.subscriptions || [];
  const memberSubs = memberSharedSubs || [];
  const pendingInvitations = pendingInvitationsData || [];

  const ownedSharedSubs = subscriptions.filter((sub) => sub.isShared);
  const mySubscriptions = subscriptions.filter((sub) => !sub.isShared);

  const allSharedSubs = useMemo(() => {
    const seen = new Set<string>();
    const merged: { sub: Subscription; isOwner: boolean }[] = [];

    for (const sub of ownedSharedSubs) {
      if (!seen.has(sub._id)) {
        seen.add(sub._id);
        merged.push({ sub, isOwner: true });
      }
    }

    for (const sub of memberSubs) {
      if (!seen.has(sub._id)) {
        seen.add(sub._id);
        merged.push({ sub, isOwner: false });
      }
    }

    return merged;
  }, [ownedSharedSubs, memberSubs]);

  const mineLoading = subsLoading || memberSharedLoading;

  useEffect(() => {
    const acceptParam = searchParams.get('accept');
    const emailParam = searchParams.get('email');
    if (acceptParam && emailParam) {
      setActiveTab('invitations');
      const timer = setTimeout(() => {
        handleAccept(acceptParam);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleAccept = async (subId: string) => {
    try {
      await acceptMutation.mutateAsync(subId);
      setAcceptSuccess(true);
      setTimeout(() => setAcceptSuccess(false), 3000);
    } catch {
      // Error handled in mutation
    }
  };

  const handleResendInvite = async (subId: string, email: string) => {
    try {
      await resendMutation.mutateAsync({ id: subId, email });
    } catch {
      // Error handled in mutation
    }
  };

  const handleInvite = async () => {
    if (!selectedSub || !inviteEmail || !inviteAmount) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await inviteMutation.mutateAsync({
        id: selectedSub._id,
        data: {
          email: inviteEmail,
          shareAmount: parseFloat(inviteAmount),
        },
      });
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteAmount('');
      setSelectedSub(null);
    } catch {
      // Error handled in mutation
    }
  };

  const handleRemoveMember = async (subId: string, memberEmail: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await removeMutation.mutateAsync({ id: subId, memberEmail });
    } catch {
      // Error handled in mutation
    }
  };

  const handleDecline = async (subId: string, memberEmail: string) => {
    await handleRemoveMember(subId, memberEmail);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="url(#headerGrad)" strokeWidth="3" strokeDasharray="8 4" />
              <path d="M15 20L24 28L33 20" stroke="url(#headerGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="headerGrad" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Shared Subscriptions
            </h1>
            <p className="text-muted-foreground">Manage family and group subscriptions</p>
          </div>
        </div>
        <button
          className="btn-primary gap-2 self-start sm:self-auto"
          onClick={() => {
            if (mySubscriptions.length === 0) {
              toast.error('You need at least one subscription to share');
              return;
            }
            setShowInviteModal(true);
          }}
        >
          <UserPlus size={16} />
          Share Subscription
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 border-b overflow-x-auto"
      >
        <button
          className={`px-4 py-2 font-medium transition-colors relative whitespace-nowrap ${
            activeTab === 'mine'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('mine')}
        >
          <span className="flex items-center gap-2">
            My Shared Subs
          </span>
          {activeTab === 'mine' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          className={`flex px-4 py-2 font-medium transition-colors relative whitespace-nowrap ${
            activeTab === 'invitations'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('invitations')}
        >
          <span className="flex items-center gap-2">
            <Mail size={16} />
            Pending Invitations
          </span>
          {pendingInvitations.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
            >
              {pendingInvitations.length}
            </motion.span>
          )}
          {activeTab === 'invitations' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'mine' ? (
          <motion.div
            key="mine"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {mineLoading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-6">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
                    <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : allSharedSubs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-12 text-center"
              >
                <div className="flex justify-center mb-6">
                  <AnimatedUsersSVG />
                </div>
                <p className="text-muted-foreground mb-4">No shared subscriptions yet</p>
                <button
                  className="btn-primary gap-2"
                  onClick={() => setShowInviteModal(true)}
                >
                  <Users size={16} />
                  Share Your First Subscription
                </button>
              </motion.div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {allSharedSubs.map(({ sub, isOwner }) => (
                  <SharedSubscriptionCard
                    key={sub._id}
                    subscription={sub}
                    isOwner={isOwner}
                    onResendInvite={handleResendInvite}
                    onRemoveMember={handleRemoveMember}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="invitations"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            <AcceptSuccessOverlay show={acceptSuccess} />

            {invitesLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="card p-6">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
                    <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : pendingInvitations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-12 text-center"
              >
                <div className="flex justify-center mb-6">
                  <MailWithSparklesSVG />
                </div>
                <p className="text-muted-foreground">No pending invitations</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {pendingInvitations.map((sub) => {
                  const pendingMember = sub.sharedMembers?.find(
                    (m) => m.status === 'pending'
                  );
                  if (!pendingMember) return null;
                  return (
                    <PendingInvitationCard
                      key={sub._id}
                      subscription={sub}
                      pendingMember={pendingMember}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      isAccepting={acceptMutation.isPending}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <InviteModal
        isOpen={showInviteModal}
        mySubscriptions={mySubscriptions}
        selectedSub={selectedSub}
        inviteEmail={inviteEmail}
        inviteAmount={inviteAmount}
        isPending={inviteMutation.isPending}
        onClose={() => { setShowInviteModal(false); setSelectedSub(null); setInviteEmail(''); setInviteAmount(''); }}
        onSelectSub={setSelectedSub}
        onEmailChange={setInviteEmail}
        onAmountChange={setInviteAmount}
        onSend={handleInvite}
      />
    </div>
  );
};

export default SharedSubscriptions;
