import { useState } from 'react';
import { useSubscriptions, useDeleteSubscription } from '@/hooks/useSubscriptions';
import { Plus, Upload } from 'lucide-react';
import Modal from '@/components/Modal';
import SubscriptionForm from '@/components/SubscriptionForm';
import ImportCSV from '@/components/ImportCSV';
import SubscriptionFilters from '@/components/SubscriptionFilters';
import SubscriptionCard from '@/components/SubscriptionCard';
import type { Subscription } from '@/types';

const Subscriptions = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const { data, isLoading } = useSubscriptions({
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
  });
  const deleteMutation = useDeleteSubscription();

  const subscriptions = data?.subscriptions || [];

  const filtered = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">{subscriptions.length} total subscriptions</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button className="btn-secondary gap-2" onClick={() => setShowImport(true)}>
            <Upload size={16} />
            Import
          </button>
          <button className="btn-primary gap-2" onClick={() => { setEditingSub(null); setShowForm(true); }}>
            <Plus size={16} />
            Add New
          </button>
        </div>
      </div>

      <SubscriptionFilters
        search={search}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6">
              <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
              <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-muted-foreground">No subscriptions found</p>
          <button className="btn-primary mt-4" onClick={() => setShowForm(true)}>
            Add your first subscription
          </button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sub) => (
            <SubscriptionCard
              key={sub._id}
              subscription={sub}
              dropdownOpen={dropdownOpen === sub._id}
              onToggleDropdown={() => setDropdownOpen(dropdownOpen === sub._id ? null : sub._id)}
              onEdit={(sub) => { setEditingSub(sub); setShowForm(true); setDropdownOpen(null); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingSub(null); }}
        title={editingSub ? 'Edit Subscription' : 'Add Subscription'}
      >
        <SubscriptionForm
          subscription={editingSub}
          onSuccess={() => { setShowForm(false); setEditingSub(null); }}
          onCancel={() => { setShowForm(false); setEditingSub(null); }}
        />
      </Modal>

      <Modal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        title="Import Subscriptions"
      >
        <ImportCSV
          onSuccess={() => setShowImport(false)}
          onCancel={() => setShowImport(false)}
        />
      </Modal>
    </div>
  );
};

export default Subscriptions;
