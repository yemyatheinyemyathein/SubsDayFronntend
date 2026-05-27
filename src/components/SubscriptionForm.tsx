import { useState, useEffect } from 'react';
import { format, addMonths, addYears, addWeeks } from 'date-fns';
import { Users, Trash2, Plus } from 'lucide-react';
import { useCreateSubscription, useUpdateSubscription } from '@/hooks/useSubscriptions';
import { CATEGORIES, CURRENCIES, BILLING_CYCLES } from '@/types';
import type { Subscription, SharedMember } from '@/types';

interface SubscriptionFormProps {
  subscription?: Subscription | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ subscription, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'USD',
    billingCycle: 'monthly' as Subscription['billingCycle'],
    nextBillingDate: format(new Date(), 'yyyy-MM-dd'),
    startDate: '',
    endDate: '',
    category: 'Other',
    status: 'active' as Subscription['status'],
    notes: '',
    isShared: false,
    splitType: 'equal' as 'equal' | 'custom',
  });
  const [sharedMembers, setSharedMembers] = useState<SharedMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberAmount, setNewMemberAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();

  useEffect(() => {
    if (subscription) return;
    if (formData.billingCycle === 'custom') return;
    const baseDate = formData.startDate ? new Date(formData.startDate) : new Date();
    let next: Date;
    switch (formData.billingCycle) {
      case 'monthly': next = addMonths(baseDate, 1); break;
      case 'yearly': next = addYears(baseDate, 1); break;
      case 'weekly': next = addWeeks(baseDate, 1); break;
      default: return;
    }
    setFormData(prev => ({ ...prev, nextBillingDate: format(next, 'yyyy-MM-dd') }));
  }, [formData.startDate, formData.billingCycle, subscription]);

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        price: subscription.price.toString(),
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        nextBillingDate: format(new Date(subscription.nextBillingDate), 'yyyy-MM-dd'),
        startDate: subscription.startDate ? format(new Date(subscription.startDate), 'yyyy-MM-dd') : '',
        endDate: subscription.endDate ? format(new Date(subscription.endDate), 'yyyy-MM-dd') : '',
        category: subscription.category,
        status: subscription.status,
        notes: subscription.notes || '',
        isShared: subscription.isShared || false,
        splitType: subscription.splitType || 'equal',
      });
      setSharedMembers(subscription.sharedMembers || []);
    }
  }, [subscription]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.nextBillingDate) newErrors.nextBillingDate = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addMember = () => {
    if (!newMemberEmail || !newMemberAmount) return;
    const newMember: SharedMember = {
      email: newMemberEmail,
      shareAmount: parseFloat(newMemberAmount),
      status: 'pending',
    };
    setSharedMembers([...sharedMembers, newMember]);
    setNewMemberEmail('');
    setNewMemberAmount('');
  };

  const removeMember = (index: number) => {
    setSharedMembers(sharedMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: Record<string, any> = {
      ...formData,
      price: parseFloat(formData.price),
      nextBillingDate: new Date(formData.nextBillingDate).toISOString(),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      sharedMembers: formData.isShared ? sharedMembers : [],
    };

    try {
      if (subscription) {
        await updateMutation.mutateAsync({ id: subscription._id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
    } catch {
      setErrors({ submit: 'Failed to save subscription' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {errors.submit}
        </div>
      )}

      <div>
        <label className="label">Name</label>
        <input
          className="input mt-1"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Netflix, Spotify"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Price</label>
          <input
            className="input mt-1"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="9.99"
          />
          {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
        </div>

        <div>
          <label className="label">Currency</label>
          <select
            className="input mt-1"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Billing Cycle</label>
          <select
            className="input mt-1"
            value={formData.billingCycle}
            onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as Subscription['billingCycle'] })}
          >
            {BILLING_CYCLES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Next Billing Date</label>
          <input
            className="input mt-1"
            type="date"
            value={formData.nextBillingDate}
            onChange={(e) => setFormData({ ...formData, nextBillingDate: e.target.value })}
            disabled={!subscription && formData.billingCycle !== 'custom'}
          />
          {!subscription && formData.billingCycle !== 'custom' && (
            <p className="mt-1 text-[10px] text-muted-foreground">Auto-calculated from start date and billing cycle</p>
          )}
          {errors.nextBillingDate && <p className="mt-1 text-xs text-red-500">{errors.nextBillingDate}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Start Date</label>
          <input
            className="input mt-1"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        <div>
          <label className="label">End Date</label>
          <input
            className="input mt-1"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select
            className="input mt-1"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Status</label>
          <select
            className="input mt-1"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Subscription['status'] })}
          >
            <option value="active">Active</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="isShared"
            checked={formData.isShared}
            onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })}
            className="rounded border-input"
          />
          <label htmlFor="isShared" className="flex items-center gap-2 font-medium cursor-pointer">
            <Users size={16} />
            Shared Subscription
          </label>
        </div>

        {formData.isShared && (
          <div className="space-y-4 ml-6">
            <div>
              <label className="label">Split Type</label>
              <select
                className="input mt-1"
                value={formData.splitType}
                onChange={(e) => setFormData({ ...formData, splitType: e.target.value as 'equal' | 'custom' })}
              >
                <option value="equal">Equal Split</option>
                <option value="custom">Custom Amounts</option>
              </select>
            </div>

            {formData.splitType === 'equal' && formData.price && (
              <p className="text-sm text-muted-foreground">
                Each member pays: ${((parseFloat(formData.price) || 0) / (sharedMembers.length + 1)).toFixed(2)}
              </p>
            )}

            <div>
              <label className="label">Add Member</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  className="input flex-1"
                  placeholder="member@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
                {formData.splitType === 'custom' && (
                  <input
                    type="number"
                    className="input w-24"
                    placeholder="Amount"
                    value={newMemberAmount}
                    onChange={(e) => setNewMemberAmount(e.target.value)}
                  />
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={addMember}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {sharedMembers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Members</p>
                {sharedMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-muted/50 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{member.email}</span>
                      <span className="text-xs text-muted-foreground">
                        ${member.shareAmount.toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="label">Notes (optional)</label>
        <textarea
          className="input mt-1"
          rows={2}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending
            ? 'Saving...'
            : subscription
            ? 'Update'
            : 'Add Subscription'}
        </button>
      </div>
    </form>
  );
};

export default SubscriptionForm;
