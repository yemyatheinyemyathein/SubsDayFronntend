import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi, statsApi } from '@/services/api';
import type { Subscription, Stats } from '@/types';
import toast from 'react-hot-toast';

export const useSubscriptions = (params?: { status?: string; category?: string }) => {
  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: () => subscriptionApi.getAll(params),
    refetchInterval: 30_000,
  });
};

export const useSharedSubscriptions = () => {
  return useQuery({
    queryKey: ['sharedSubscriptions'],
    queryFn: () => subscriptionApi.getShared().then((res) => res.subscriptions),
    refetchInterval: 15_000,
  });
};

export const useSubscription = (id: string) => {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Subscription>) => subscriptionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Subscription created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create subscription');
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subscription> }) =>
      subscriptionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Subscription updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to update subscription');
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Subscription deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to delete subscription');
    },
  });
};

export const useImportSubscriptions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subscriptions: Partial<Subscription>[]) => subscriptionApi.import(subscriptions),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success(`Successfully imported ${data.count} subscriptions!`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to import subscriptions');
    },
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { email: string; shareAmount: number } }) =>
      subscriptionApi.inviteMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['sharedSubscriptions'] });
      toast.success('Member invited successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to invite member');
    },
  });
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionApi.acceptInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['sharedSubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['pendingInvitations'] });
      toast.success('Invitation accepted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to accept invitation');
    },
  });
};

export const useResendInvitation = () => {
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      subscriptionApi.resendInvitation(id, email),
    onSuccess: () => {
      toast.success('Invitation email resent successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to resend invitation');
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, memberEmail }: { id: string; memberEmail: string }) =>
      subscriptionApi.removeMember(id, memberEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['sharedSubscriptions'] });
      toast.success('Member removed successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to remove member');
    },
  });
};

export const usePendingInvitations = () => {
  return useQuery({
    queryKey: ['pendingInvitations'],
    queryFn: () => subscriptionApi.getInvitations().then((res) => res.invitations),
    refetchInterval: 10_000,
  });
};

export const useStats = () => {
  return useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: () => statsApi.getStats().then((res) => res.stats),
    refetchInterval: 30_000,
  });
};
